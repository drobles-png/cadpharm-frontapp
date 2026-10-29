<script setup lang="ts">
defineProps<{ label: string; hint?: string; for?: string; wide?: boolean }>()
</script>

<template>
  <div class="field" :class="{ 'field--wide': wide }">
    <label :for="$props.for" class="field__label">{{ label }}</label>
    <slot />
    <p v-if="hint" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped lang="scss">
.field {
  flex: 1 1 220px;
  min-width: 0;

  &--wide {
    flex-basis: 100%;
  }

  &__label {
    font-weight: 700;
    color: $ink;
  }

  &__hint {
    margin-top: 0.3rem;
    font-size: $text-xs;
    color: $ink-muted;
  }

  :deep(textarea) {
    resize: vertical;
    min-height: 96px;
    line-height: 1.55;
  }
}
</style>
