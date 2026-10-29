<script setup lang="ts">
import { RouterLink } from 'vue-router'
import QuantityStepper from './QuantityStepper.vue'
import AnimatedPrice from './AnimatedPrice.vue'
import { cartCopy } from '@/config/checkout.copy'
import { imageUrl } from '@/utils/format'
import type { CartLine } from '@/stores/cart'

defineProps<{ line: CartLine }>()
const emit = defineEmits<{ quantity: [value: number]; remove: []; navigate: [] }>()
</script>

<template>
  <article class="line">
    <RouterLink
      :to="`/productos/${line.slug}`"
      class="line__media"
      :style="{ '--tone': line.color }"
      tabindex="-1"
      aria-hidden="true"
      @click="emit('navigate')"
    >
      <img :src="imageUrl(line.image)" :alt="''" loading="lazy" width="72" height="72" />
    </RouterLink>
    <div class="line__body">
      <div class="line__top">
        <RouterLink :to="`/productos/${line.slug}`" class="line__name" @click="emit('navigate')">
          {{ line.name }} <span v-if="line.nameAccent">{{ line.nameAccent }}</span>
        </RouterLink>
        <button
          type="button"
          class="line__remove"
          :aria-label="cartCopy.remove(`${line.name} ${line.nameAccent}`)"
          @click="emit('remove')"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <p class="line__presentation">{{ line.presentation }}</p>
      <div class="line__bottom">
        <QuantityStepper
          :model-value="line.quantity"
          :label="`${line.name} ${line.nameAccent}`"
          @update:model-value="emit('quantity', $event)"
          @remove="emit('remove')"
        />
        <AnimatedPrice class="line__price" :cents="line.unitPrice * line.quantity" />
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.line {
  @include flex(row, flex-start, flex-start, 0.95rem);
  padding: 1rem 0;
  border-bottom: 1px solid $line;

  &__media {
    position: relative;
    @include flex(row, center, center);
    flex: 0 0 4.75rem;
    height: 4.75rem;
    border-radius: $radius-md;
    background: $paper;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      width: 78%;
      aspect-ratio: 1;
      border-radius: 50%;
      background: var(--tone, #{$accent});
      opacity: 0.18;
      transition: transform 0.4s $ease;
    }

    img {
      position: relative;
      width: 86%;
      height: 86%;
      object-fit: contain;
      filter: drop-shadow(0 6px 10px rgba($ink, 0.14));
      transition: transform 0.4s $ease;
    }

    &:hover::before {
      transform: scale(1.12);
    }

    &:hover img {
      transform: translateY(-2px) rotate(-3deg);
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 0.2rem);
  }

  &__top {
    @include flex(row, flex-start, space-between, 0.5rem);
  }

  &__name {
    font-family: $font-display;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.2;
    color: $ink;

    span {
      color: $accent-deep;
    }

    &:hover {
      color: $brand-blue;
    }
  }

  &__remove {
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    color: $ink-muted;
    font-size: 0.85rem;
    transition:
      background 0.2s ease,
      color 0.2s ease;
    @include focus-ring;

    &:hover {
      background: $danger-bg;
      color: $danger;
    }
  }

  &__presentation {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__bottom {
    @include flex(row, center, space-between, 0.5rem);
    margin-top: 0.45rem;
  }

  &__price {
    font-weight: 700;
    color: $ink;
  }
}
</style>
