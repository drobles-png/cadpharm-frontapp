<script setup lang="ts">
defineProps<{ label: string; disabled?: boolean; small?: boolean }>()
const model = defineModel<boolean>({ required: true })
</script>

<template>
  <label class="switch" :class="{ 'switch--on': model, 'switch--small': small }">
    <input v-model="model" type="checkbox" class="visually-hidden" role="switch" :disabled="disabled" />
    <span class="switch__track" aria-hidden="true"><span class="switch__thumb"></span></span>
    <span class="switch__label">{{ label }}</span>
  </label>
</template>

<style scoped lang="scss">
.switch {
  @include flex(row, center, flex-start, 0.6rem);
  margin: 0;
  cursor: pointer;
  user-select: none;
  font-size: $text-sm;
  font-weight: 600;
  color: $ink-soft;

  &__track {
    position: relative;
    flex-shrink: 0;
    width: 44px;
    height: 26px;
    border-radius: $radius-pill;
    background: rgba($ink, 0.16);
    transition: background-color 0.3s $ease;
  }

  &__thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: $surface;
    box-shadow: 0 2px 6px rgba($ink, 0.25);
    transition: transform 0.35s $ease;
  }

  input:focus-visible + &__track {
    outline: 2px solid $accent;
    outline-offset: 3px;
  }

  &:active &__thumb {
    width: 24px;
  }

  &--on {
    color: $ink;

    .switch__track {
      background: $accent;
    }

    .switch__thumb {
      transform: translateX(18px);
    }

    &:active .switch__thumb {
      transform: translateX(14px);
    }
  }

  &--small {
    font-size: $text-xs;

    .switch__track {
      width: 36px;
      height: 22px;
    }

    .switch__thumb {
      width: 16px;
      height: 16px;
    }

    &.switch--on .switch__thumb {
      transform: translateX(14px);
    }
  }
}
</style>
