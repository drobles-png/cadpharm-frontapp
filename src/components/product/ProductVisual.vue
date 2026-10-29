<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Product } from '@/types'
import { imageUrl } from '@/utils/format'

/**
 * Imagen "de vitrina" del producto: el recorte sin fondo si existe; si no
 * carga, cae a la primera foto real dentro de un marco redondeado para que el
 * reemplazo se vea intencional y no roto.
 */
const props = withDefaults(
  defineProps<{
    product: Pick<Product, 'cutout' | 'images' | 'name' | 'nameAccent'>
    lazy?: boolean
    alt?: string
  }>(),
  { lazy: true, alt: '' },
)

const failed = ref(false)
watch(
  () => props.product.cutout,
  () => (failed.value = false),
)

const usePhoto = computed(() => failed.value || !props.product.cutout)
const src = computed(() =>
  usePhoto.value ? imageUrl(props.product.images[0]) : props.product.cutout,
)
const altText = computed(
  () => props.alt || `${props.product.name} ${props.product.nameAccent}`.trim(),
)
</script>

<template>
  <span class="visual" :class="{ 'visual--photo': usePhoto }">
    <img
      class="visual__img"
      :src="src"
      :alt="altText"
      :loading="lazy ? 'lazy' : 'eager'"
      decoding="async"
      draggable="false"
      @error="failed = true"
    />
  </span>
</template>

<style scoped lang="scss">
.visual {
  @include flex(row, center, center);
  width: 100%;
  height: 100%;

  &__img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 22px 26px rgba($ink, 0.28));
    user-select: none;
  }

  &--photo {
    padding: 4%;

    .visual__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: $radius-md;
      border: 5px solid $surface;
      filter: none;
      box-shadow: $shadow-md;
    }
  }
}
</style>
