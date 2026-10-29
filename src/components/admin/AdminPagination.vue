<script setup lang="ts">
import { ordersCopy as copy } from '@/config/admin.copy'

defineProps<{ pages: number }>()
const page = defineModel<number>({ required: true })
</script>

<template>
  <nav v-if="pages > 1" class="pager" aria-label="Paginación">
    <button class="pager__btn" type="button" :disabled="page <= 1" @click="page--">
      <i class="fa-solid fa-chevron-left"></i>
      <span>{{ copy.prev }}</span>
    </button>
    <span class="pager__info">{{ copy.pageOf(page, pages) }}</span>
    <button class="pager__btn" type="button" :disabled="page >= pages" @click="page++">
      <span>{{ copy.next }}</span>
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, space-between, 0.8rem);
  margin-top: $space-md;

  &__info {
    font-size: $text-sm;
    color: $ink-muted;
    font-variant-numeric: tabular-nums;
  }

  &__btn {
    @include flex(row, center, center, 0.5rem);
    padding: 0.6rem 1rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-size: $text-sm;
    font-weight: 600;
    transition:
      border-color 0.2s ease,
      transform 0.2s $ease;
    @include focus-ring;

    &:hover:not(:disabled) {
      border-color: $ink;
    }

    &:active:not(:disabled) {
      transform: scale(0.96);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    span {
      display: none;

      @include from('sm') {
        display: inline;
      }
    }
  }
}
</style>
