<script setup lang="ts">
import { computed } from 'vue'
import { validationCopy, type FieldDef } from '@/config/checkout.copy'

/**
 * Campo del checkout con label, icono, ayuda y error inline. El error se
 * anuncia por aria-live y el input queda conectado a él con aria-describedby.
 * El alto del mensaje está reservado: que aparezca un error no empuja nada.
 */
const props = defineProps<{ def: FieldDef; error?: string; wide?: boolean }>()
const model = defineModel<string>({ required: true })
const emit = defineEmits<{ blur: []; input: [] }>()

const id = computed(() => `checkout-${props.def.key}`)
const valid = computed(() => !props.error && model.value.trim().length > 0)
const describedBy = computed(() =>
  [props.error ? `${id.value}-error` : '', props.def.hint ? `${id.value}-hint` : '']
    .filter(Boolean)
    .join(' ') || undefined,
)
</script>

<template>
  <div class="field" :class="{ 'field--wide': wide, 'has-error': error, 'is-valid': valid }">
    <label :for="id" class="field__label">
      {{ def.label }}
      <span v-if="def.optional" class="field__optional">{{ validationCopy.optional }}</span>
    </label>
    <div class="field__control">
      <i :class="def.icon" class="field__icon" aria-hidden="true"></i>
      <textarea
        v-if="def.multiline"
        :id="id"
        v-model="model"
        class="field__input field__input--area"
        rows="3"
        :placeholder="def.placeholder"
        :maxlength="def.maxlength"
        :autocomplete="def.autocomplete"
        :aria-invalid="!!error"
        :aria-describedby="describedBy"
        @blur="emit('blur')"
        @input="emit('input')"
      ></textarea>
      <input
        v-else
        :id="id"
        v-model="model"
        class="field__input"
        :type="def.type"
        :inputmode="def.inputmode"
        :autocomplete="def.autocomplete"
        :placeholder="def.placeholder"
        :maxlength="def.maxlength"
        :list="def.list"
        :required="!def.optional"
        :aria-invalid="!!error"
        :aria-describedby="describedBy"
        :autocapitalize="def.type === 'text' ? 'words' : 'off'"
        spellcheck="false"
        @blur="emit('blur')"
        @input="emit('input')"
      />
      <Transition name="tick">
        <i v-if="valid" class="fa-solid fa-circle-check field__tick" aria-hidden="true"></i>
      </Transition>
    </div>
    <div class="field__msg">
      <Transition name="msg" mode="out-in">
        <p v-if="error" :id="`${id}-error`" key="e" class="field__error" role="alert">
          <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
        </p>
        <p v-else-if="def.hint" :id="`${id}-hint`" key="h" class="field__hint">{{ def.hint }}</p>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.field {
  flex: 1 1 100%;
  min-width: 0;

  @include from('md') {
    flex: 1 1 calc(50% - 0.5rem);

    &--wide {
      flex-basis: 100%;
    }
  }

  &__label {
    @include flex(row, baseline, space-between);
    margin-bottom: 0.4rem;
    font-weight: 600;
    color: $ink;
  }

  &__optional {
    font-weight: 500;
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__control {
    position: relative;
  }

  &__icon {
    position: absolute;
    left: 1rem;
    top: 1.55rem;
    transform: translateY(-50%);
    font-size: 0.9rem;
    color: $ink-muted;
    pointer-events: none;
    transition: color 0.2s ease;
  }

  &__input {
    width: 100%;
    // 16px mínimo: por debajo iOS hace zoom al enfocar.
    font-size: 1rem;
    font-family: $font-principal;
    color: $ink;
    background: $paper;
    border: 1.5px solid $line;
    border-radius: $radius-sm + 4px;
    padding: 0.85rem 2.6rem 0.85rem 2.6rem;
    min-height: 3.1rem;
    transition:
      border-color 0.2s ease,
      background 0.2s ease,
      box-shadow 0.2s ease;

    &::placeholder {
      color: rgba($ink-muted, 0.75);
    }

    &:hover {
      border-color: darken($line, 8%);
    }

    &:focus {
      outline: none;
      background: $surface;
      border-color: $accent;
      box-shadow: 0 0 0 4px rgba($accent, 0.14);
    }

    &--area {
      resize: vertical;
      min-height: 4.6rem;
      line-height: 1.45;
    }
  }

  &__control:focus-within &__icon {
    color: $accent;
  }

  &.has-error &__input {
    border-color: $danger;
    background: rgba($danger, 0.04);
    animation: field-shake 0.4s ease;

    &:focus {
      box-shadow: 0 0 0 4px rgba($danger, 0.14);
    }
  }

  &.has-error &__icon {
    color: $danger;
  }

  &__tick {
    position: absolute;
    right: 1rem;
    top: 1.55rem;
    transform: translateY(-50%);
    color: $accent;
  }

  &__msg {
    min-height: 1.45rem;
    padding-top: 0.3rem;
  }

  &__error {
    font-size: $text-xs;
    font-weight: 600;
    color: $danger;
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }
}

.tick-enter-active {
  transition:
    transform 0.4s $ease,
    opacity 0.2s ease;
}
.tick-enter-from {
  transform: translateY(-50%) scale(0);
  opacity: 0;
}

.msg-enter-active,
.msg-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.msg-enter-from,
.msg-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes field-shake {
  25% {
    transform: translateX(-4px);
  }
  50% {
    transform: translateX(4px);
  }
  75% {
    transform: translateX(-2px);
  }
}
</style>
