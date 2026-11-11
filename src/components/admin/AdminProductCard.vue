<script setup lang="ts">
import { computed } from 'vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import { productsCopy as copy } from '@/config/admin.copy'
import { imageUrl } from '@/utils/format'
import type { Product } from '@/types'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ toggle: [field: 'isPublished' | 'featured'] }>()

const published = computed({
  get: () => props.product.isPublished,
  set: () => emit('toggle', 'isPublished'),
})
const featured = computed({
  get: () => props.product.featured,
  set: () => emit('toggle', 'featured'),
})
</script>

<template>
  <article
    class="pcard"
    :class="{ 'pcard--hidden': !product.isPublished }"
    :style="{ '--p': product.theme?.primary || '#17a34a', '--s': product.theme?.secondary || '#b8f05a' }"
  >
    <RouterLink :to="`/admin/productos/${product._id}`" class="pcard__media">
      <img :src="imageUrl(product.cutout || product.images[0])" :alt="product.name" loading="lazy" />
      <span v-if="product.featured" class="pcard__star"><i class="fa-solid fa-star"></i> {{ copy.featured }}</span>
      <span class="pcard__order">#{{ product.order }}</span>
    </RouterLink>

    <div class="pcard__body">
      <RouterLink :to="`/admin/productos/${product._id}`" class="pcard__name">
        {{ product.name }} <em v-if="product.nameAccent">{{ product.nameAccent }}</em>
      </RouterLink>
      <p class="pcard__meta">{{ product.categoryLabel || product.category }}</p>

      <div class="pcard__switches">
        <AdminSwitch v-model="published" :label="product.isPublished ? copy.published : copy.hidden" small />
        <AdminSwitch v-model="featured" :label="copy.featured" small />
      </div>

      <RouterLink :to="`/admin/productos/${product._id}`" class="pcard__edit">
        <i class="fa-solid fa-pen"></i> {{ copy.edit }}
      </RouterLink>
    </div>
  </article>
</template>

<style scoped lang="scss">
.pcard {
  @include card;
  @include flex(column, stretch, flex-start);
  overflow: hidden;
  transition:
    transform 0.35s $ease,
    box-shadow 0.35s $ease,
    opacity 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;

    .pcard__media img {
      transform: scale(1.05) rotate(-2deg);
    }
  }

  &__media {
    position: relative;
    @include flex(row, center, center);
    height: 190px;
    background: radial-gradient(circle at 50% 60%, color-mix(in srgb, var(--s) 45%, white), color-mix(in srgb, var(--p) 18%, white));

    img {
      max-height: 160px;
      max-width: 75%;
      object-fit: contain;
      filter: drop-shadow(0 14px 18px rgba(0, 0, 0, 0.18));
      transition:
        transform 0.5s $ease,
        filter 0.3s ease;
    }
  }

  &__star,
  &__order {
    position: absolute;
    top: 0.7rem;
    padding: 0.25rem 0.6rem;
    border-radius: $radius-pill;
    font-size: 0.7rem;
    font-weight: 800;
  }

  &__star {
    left: 0.7rem;
    background: $ink;
    color: $lime;
  }

  &__order {
    right: 0.7rem;
    background: rgba(255, 255, 255, 0.85);
    color: $ink-soft;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.55rem);
    padding: 1rem 1.1rem 1.1rem;
  }

  &__name {
    @include display($text-lg, 800);

    em {
      font-style: normal;
      color: var(--p);
    }
  }

  &__meta {
    margin-top: -0.35rem;
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__switches {
    @include flex(row, center, flex-start, 1rem);
    flex-wrap: wrap;
    padding-top: 0.7rem;
    border-top: 1px solid $line;
  }

  &__edit {
    @include flex(row, center, center, 0.45rem);
    margin-top: 0.3rem;
    padding: 0.65rem;
    border-radius: $radius-pill;
    background: $paper;
    font-size: $text-sm;
    font-weight: 700;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background: $ink;
      color: $surface;
    }
  }

  &--hidden {
    .pcard__media img {
      filter: grayscale(0.85) opacity(0.6);
    }
  }
}
</style>
