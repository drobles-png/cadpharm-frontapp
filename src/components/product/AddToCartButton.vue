<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cart'
import { whatsappLink } from '@/config/site'
import { productCopy } from '@/config/pages.copy'

/**
 * Botón de compra con microanimación: al agregar, el texto sale hacia arriba
 * y entra un check. Sin precio (por confirmar) se convierte en "Pedir por WhatsApp".
 */
const props = withDefaults(
  defineProps<{
    product: Product
    quantity?: number
    label?: string
    openDrawer?: boolean
    large?: boolean
    block?: boolean
  }>(),
  { quantity: 1, label: productCopy.add, openDrawer: false, large: false, block: false },
)

const cart = useCartStore()
const added = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const hasPrice = computed(() => props.product.price !== null)
const waHref = computed(() =>
  whatsappLink(productCopy.whatsappMessage(`${props.product.name} ${props.product.nameAccent}`)),
)

function add() {
  cart.add(props.product, props.quantity, props.openDrawer)
  added.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (added.value = false), 1600)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <button
    v-if="hasPrice"
    type="button"
    class="atc btn btn--primary"
    :class="{ 'atc--done': added, 'btn--lg': large, 'btn--block': block }"
    :aria-label="`${label}: ${product.name} ${product.nameAccent}`"
    @click="add"
  >
    <span class="atc__face atc__face--idle">
      <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>{{ label }}
    </span>
    <span class="atc__face atc__face--done" aria-hidden="true">
      <i class="fa-solid fa-check"></i>{{ productCopy.added }}
    </span>
    <span class="visually-hidden" aria-live="polite">{{ added ? productCopy.added : '' }}</span>
  </button>
  <a
    v-else
    :href="waHref"
    class="atc btn btn--dark"
    :class="{ 'btn--lg': large, 'btn--block': block }"
    target="_blank"
    rel="noopener"
  >
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>{{ productCopy.whatsapp }}
  </a>
</template>

<style scoped lang="scss">
.atc {
  position: relative;
  overflow: hidden;
  white-space: nowrap;

  &__face {
    @include flex(row, center, center, 0.5rem);
    transition:
      transform 0.45s $ease,
      opacity 0.3s ease;
  }

  &__face--done {
    position: absolute;
    inset: 0;
    transform: translateY(110%);
    opacity: 0;

    i {
      transform: scale(0);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.12s;
    }
  }

  &--done {
    background: $ink;

    .atc__face--idle {
      transform: translateY(-110%);
      opacity: 0;
    }

    .atc__face--done {
      transform: none;
      opacity: 1;

      i {
        transform: scale(1);
        color: $lime;
      }
    }
  }
}
</style>
