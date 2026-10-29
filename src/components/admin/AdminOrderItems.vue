<script setup lang="ts">
import { computed, ref } from 'vue'
import { orderDetailCopy as copy, ordersCopy } from '@/config/admin.copy'
import { formatCents, imageUrl } from '@/utils/format'
import type { Order } from '@/types'

const props = defineProps<{ order: Order }>()
const showRaw = ref(false)
const raw = computed(() =>
  props.order.payphoneResponse ? JSON.stringify(props.order.payphoneResponse, null, 2) : '',
)
</script>

<template>
  <section class="items">
    <h2 class="items__title">{{ copy.items }}</h2>
    <ul class="items__list">
      <li v-for="it in order.items" :key="it.product + it.name" class="items__row">
        <img :src="imageUrl(it.image)" :alt="it.name" class="items__img" loading="lazy" />
        <div class="items__name">
          <strong>{{ it.name }}</strong>
          <small>{{ it.quantity }} × {{ formatCents(it.unitPrice) }}</small>
        </div>
        <span class="items__sub">{{ formatCents(it.subtotal) }}</span>
      </li>
    </ul>

    <dl class="items__totals">
      <div><dt>{{ copy.subtotal }}</dt><dd>{{ formatCents(order.subtotal) }}</dd></div>
      <div>
        <dt>{{ copy.shipping }}</dt>
        <dd>{{ order.shipping ? formatCents(order.shipping) : copy.shippingFree }}</dd>
      </div>
      <div class="items__grand"><dt>{{ copy.total }}</dt><dd>{{ formatCents(order.total) }}</dd></div>
    </dl>

    <div class="items__pay">
      <span><i class="fa-solid fa-wallet"></i> {{ copy.paymentMethod }}</span>
      <strong>{{ ordersCopy.payment[order.paymentMethod] || order.paymentMethod }}</strong>
    </div>
    <div v-if="order.clientTransactionId" class="items__pay">
      <span><i class="fa-solid fa-hashtag"></i> {{ copy.transaction }}</span>
      <code>{{ order.clientTransactionId }}</code>
    </div>

    <div v-if="raw" class="items__raw">
      <button type="button" class="items__toggle" :aria-expanded="showRaw" @click="showRaw = !showRaw">
        <span>
          <strong>{{ copy.payphone }}</strong>
          <small>{{ copy.payphoneHint }}</small>
        </span>
        <i class="fa-solid fa-chevron-down" :class="{ 'items__chev--open': showRaw }"></i>
      </button>
      <div class="items__collapse" :class="{ 'items__collapse--open': showRaw }">
        <div><pre>{{ raw }}</pre></div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.items {
  @include card;
  @include flex(column, stretch, flex-start, 1rem);
  padding: 1.2rem;
  min-width: 0;

  &__title {
    @include display($text-lg, 700);
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.8rem);
  }

  &__row {
    @include flex(row, center, flex-start, 0.85rem);
  }

  &__img {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    object-fit: contain;
    border-radius: 12px;
    background: $sand;
    padding: 4px;
  }

  &__name {
    @include flex(column, flex-start, flex-start);
    flex: 1;
    min-width: 0;
    line-height: 1.35;

    small {
      color: $ink-muted;
      font-size: $text-xs;
    }
  }

  &__sub {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__totals {
    @include flex(column, stretch, flex-start, 0.4rem);
    border-top: 1px dashed $line;
    padding-top: 0.9rem;

    div {
      @include flex(row, center, space-between);
      font-size: $text-sm;
      color: $ink-soft;
    }

    dd {
      font-variant-numeric: tabular-nums;
    }
  }

  &__grand {
    margin-top: 0.3rem;
    font-size: 1.1rem !important;
    font-weight: 800;
    color: $ink !important;
  }

  &__pay {
    @include flex(row, center, space-between, 0.8rem);
    flex-wrap: wrap;
    padding: 0.75rem 0.9rem;
    border-radius: 12px;
    background: $paper;
    font-size: $text-sm;

    span {
      color: $ink-muted;

      i {
        margin-right: 0.35rem;
      }
    }

    code {
      font-size: $text-xs;
      word-break: break-all;
    }
  }

  &__toggle {
    @include flex(row, center, space-between, 1rem);
    width: 100%;
    padding: 0.75rem 0;
    text-align: left;

    span {
      @include flex(column, flex-start, flex-start);
    }

    small {
      color: $ink-muted;
      font-size: $text-xs;
    }

    i {
      transition: transform 0.35s $ease;
    }
  }

  &__chev--open {
    transform: rotate(180deg);
  }

  // Se anima max-height con un tope: el JSON tiene su propio scroll interno,
  // así que nunca hace falta medir la altura real.
  &__collapse {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition:
      max-height 0.45s $ease,
      opacity 0.3s ease;

    &--open {
      max-height: 480px;
      opacity: 1;
    }

    pre {
      max-height: 440px;
      overflow: auto;
      padding: 0.9rem;
      border-radius: 10px;
      background: $ink;
      color: $lime;
      font-size: 0.75rem;
      line-height: 1.5;
    }
  }
}
</style>
