<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import type { Product } from '@/types'
import { formatCents } from '@/utils/format'
import { productCopy as copy } from '@/config/pages.copy'

/** Barra fija inferior en móvil: precio siempre a la vista y un solo toque para comprar. */
defineProps<{ product: Product; visible: boolean; waHref: string }>()
defineEmits<{ add: [] }>()

// El botón de WhatsApp flotante sube para no tapar la barra.
onMounted(() => document.body.classList.add('has-buybar'))
onBeforeUnmount(() => document.body.classList.remove('has-buybar'))
</script>

<template>
  <Transition name="bar">
    <div v-if="visible" class="bar" :style="{ '--p': product.theme.primary }">
      <div class="bar__info">
        <span class="bar__name">{{ product.name }} {{ product.nameAccent }}</span>
        <span v-if="product.price !== null" class="bar__price">{{
          formatCents(product.price)
        }}</span>
        <span v-else class="bar__ask">{{ copy.askPrice }}</span>
      </div>
      <button
        v-if="product.price !== null"
        type="button"
        class="btn btn--primary"
        @click="$emit('add')"
      >
        <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>{{ copy.add }}
      </button>
      <a v-else :href="waHref" class="btn btn--dark" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>WhatsApp
      </a>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.bar {
  position: fixed;
  left: 0.6rem;
  right: 0.6rem;
  bottom: calc(0.6rem + env(safe-area-inset-bottom));
  z-index: 70;
  @include flex(row, center, space-between, 0.8rem);
  padding: 0.6rem 0.6rem 0.6rem 1.1rem;
  border-radius: $radius-pill;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  box-shadow: $shadow-lg;
  border: 1px solid $line;

  @include from('lg') {
    display: none;
  }

  &__info {
    @include flex(column, flex-start, center);
    min-width: 0;
    line-height: 1.2;
  }

  &__name {
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-muted;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  &__price {
    font-family: $font-display;
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  &__ask {
    font-size: $text-sm;
    font-weight: 700;
  }
}

.bar-enter-active,
.bar-leave-active {
  transition:
    transform 0.5s $ease,
    opacity 0.3s ease;
}

.bar-enter-from,
.bar-leave-to {
  transform: translateY(140%);
  opacity: 0;
}
</style>
