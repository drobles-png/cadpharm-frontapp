<script setup lang="ts" generic="T extends string">
/**
 * Grupo de chips seleccionables. `multiple` = varios (checkbox), si no, uno
 * solo (radio). Inputs nativos ocultos: teclado y lectores de pantalla gratis.
 */
const props = withDefaults(
  defineProps<{
    options: { value: T; label: string; icon?: string }[]
    name: string
    legend: string
    multiple?: boolean
    error?: string
  }>(),
  { multiple: false, error: '' },
)
const model = defineModel<T | T[]>({ required: true })
const emit = defineEmits<{ blur: [] }>()

function isOn(value: T) {
  return Array.isArray(model.value) ? model.value.includes(value) : model.value === value
}

function toggle(value: T) {
  if (!props.multiple) {
    model.value = value
    return
  }
  const list = Array.isArray(model.value) ? model.value : []
  model.value = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}
</script>

<template>
  <fieldset class="chips" :aria-invalid="!!error" @focusout="emit('blur')">
    <legend class="chips__legend">
      <slot name="legend">{{ legend }}</slot>
    </legend>
    <div class="chips__list">
      <label
        v-for="opt in options"
        :key="opt.value"
        class="chips__chip"
        :class="{ 'chips__chip--on': isOn(opt.value) }"
      >
        <input
          :type="multiple ? 'checkbox' : 'radio'"
          :name="name"
          :value="opt.value"
          :checked="isOn(opt.value)"
          class="visually-hidden"
          @change="toggle(opt.value)"
        />
        <i v-if="opt.icon" :class="opt.icon" aria-hidden="true"></i>
        <span>{{ opt.label }}</span>
        <i v-if="multiple" class="fa-solid fa-check chips__check" aria-hidden="true"></i>
      </label>
    </div>
    <Transition name="rise">
      <p v-if="error" class="chips__error" role="alert">{{ error }}</p>
    </Transition>
  </fieldset>
</template>

<style scoped lang="scss">
.chips {
  border: none;
  @include flex(column, stretch, flex-start, 0.5rem);

  &__legend {
    font-size: 0.82rem;
    font-weight: 600;
    color: $ink-soft;
    margin-bottom: 0.5rem;
  }

  &__list {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__chip {
    @include flex(row, center, center, 0.5rem);
    margin: 0;
    padding: 0.6rem 1rem;
    border-radius: $radius-pill;
    border: 1.5px solid $line;
    background: $surface;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    cursor: pointer;
    user-select: none;
    transition:
      background-color 0.25s ease,
      border-color 0.25s ease,
      color 0.25s ease,
      transform 0.25s $ease;

    &:hover {
      border-color: $ink;
      color: $ink;
    }

    &:active {
      transform: scale(0.95);
    }

    &:has(input:focus-visible) {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }

    &--on {
      background: $ink;
      border-color: $ink;
      color: $surface;

      &:hover {
        color: $surface;
      }
    }
  }

  &__check {
    width: 0;
    opacity: 0;
    transform: scale(0);
    color: $lime;
    transition:
      width 0.3s $ease,
      opacity 0.2s ease,
      transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &__chip--on &__check {
    width: 0.9rem;
    opacity: 1;
    transform: scale(1);
  }

  &__error {
    font-size: $text-xs;
    font-weight: 600;
    color: $danger;
  }
}
</style>
