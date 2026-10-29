<script setup lang="ts">
import { useId } from 'vue'

/** Campo con label, error inline animado y marca de "opcional". */
withDefaults(
  defineProps<{
    label: string
    type?: string
    error?: string
    optional?: string
    textarea?: boolean
    autocomplete?: string
    placeholder?: string
    inputmode?: 'text' | 'email' | 'tel' | 'numeric'
  }>(),
  {
    type: 'text',
    error: '',
    optional: '',
    textarea: false,
    autocomplete: 'off',
    placeholder: '',
    inputmode: 'text',
  },
)
const model = defineModel<string>({ required: true })
const emit = defineEmits<{ blur: [] }>()
const id = useId()
</script>

<template>
  <div class="field" :class="{ 'field--error': error }">
    <label :for="id" class="field__label">
      {{ label }}<span v-if="optional" class="field__optional"> ({{ optional }})</span>
    </label>
    <textarea
      v-if="textarea"
      :id="id"
      v-model="model"
      class="field__input field__input--area"
      rows="4"
      :placeholder="placeholder"
      @blur="emit('blur')"
    ></textarea>
    <input
      v-else
      :id="id"
      v-model="model"
      class="field__input"
      :type="type"
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      @blur="emit('blur')"
    />
    <Transition name="rise">
      <p v-if="error" :id="`${id}-error`" class="field__error">
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>{{ error }}
      </p>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.field {
  @include flex(column, stretch, flex-start, 0.1rem);

  &__optional {
    font-weight: 400;
    color: $ink-muted;
  }

  &__input {
    // 16px evita el zoom automático de iOS al enfocar.
    font-size: 1rem;
    padding: 0.85rem 1rem;
    border-radius: $radius-sm;
    border-width: 1.5px;

    &--area {
      resize: vertical;
      min-height: 7rem;
    }
  }

  &--error &__input {
    border-color: $danger;

    &:focus {
      box-shadow: 0 0 0 3px $danger-bg;
    }
  }

  &__error {
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-xs;
    font-weight: 600;
    color: $danger;
    margin-top: 0.35rem;
  }
}
</style>
