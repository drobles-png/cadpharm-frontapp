<script setup lang="ts">
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { checkoutCopy, successCopy } from '@/config/checkout.copy'
import { formatCents, imageUrl } from '@/utils/format'
import type { PublicOrder } from '@/services/order.service'

/** Resumen del pedido confirmado; mientras llega, un esqueleto con su misma forma. */
defineProps<{ order: PublicOrder | null; loading: boolean }>()
</script>

<template>
  <section class="osum" aria-labelledby="osum-title" :aria-busy="loading">
    <h2 id="osum-title" class="osum__title">{{ successCopy.summary }}</h2>

    <div v-if="loading || !order" class="osum__list">
      <div v-for="n in 2" :key="n" class="osum__item">
        <SkeletonBlock width="3.2rem" height="3.2rem" radius="14px" />
        <div class="osum__sk-text">
          <SkeletonBlock width="70%" height="0.9rem" />
          <SkeletonBlock width="35%" height="0.75rem" />
        </div>
        <SkeletonBlock width="3.5rem" height="0.9rem" />
      </div>
      <SkeletonBlock height="1.4rem" />
    </div>

    <template v-else>
      <ul class="osum__list">
        <li v-for="item in order.items" :key="item.product" class="osum__item">
          <span class="osum__media"><img :src="imageUrl(item.image)" alt="" width="44" height="44" /></span>
          <span class="osum__name">
            {{ item.name }}
            <small>x {{ item.quantity }}</small>
          </span>
          <span class="osum__price">{{ formatCents(item.subtotal) }}</span>
        </li>
      </ul>
      <dl class="osum__totals">
        <div>
          <dt>{{ checkoutCopy.subtotal }}</dt>
          <dd>{{ formatCents(order.subtotal) }}</dd>
        </div>
        <div>
          <dt>{{ checkoutCopy.shipping }}</dt>
          <dd>{{ order.shipping ? formatCents(order.shipping) : checkoutCopy.shippingPending }}</dd>
        </div>
        <div class="osum__total">
          <dt>{{ checkoutCopy.total }}</dt>
          <dd>{{ formatCents(order.total) }}</dd>
        </div>
      </dl>
      <p class="osum__city">
        <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
        {{ successCopy.deliverTo(order.customer.city) }}
      </p>
    </template>
  </section>
</template>

<style scoped lang="scss">
.osum {
  @include card;
  border-radius: $radius-lg;
  padding: 1.25rem;
  text-align: left;

  @include from('md') {
    padding: 1.6rem;
  }

  &__title {
    @include display($text-lg, 700);
    color: $ink;
    margin-bottom: 1rem;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    @include flex(column, stretch, flex-start, 0.8rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.8rem);
  }

  &__sk-text {
    flex: 1;
    @include flex(column, stretch, flex-start, 0.4rem);
  }

  &__media {
    @include flex(row, center, center);
    flex: 0 0 3.2rem;
    height: 3.2rem;
    border-radius: 14px;
    background: $paper;

    img {
      width: 80%;
      height: 80%;
      object-fit: contain;
    }
  }

  &__name {
    flex: 1;
    min-width: 0;
    font-weight: 600;
    font-size: $text-sm;
    color: $ink;

    small {
      display: block;
      font-weight: 500;
      color: $ink-muted;
    }
  }

  &__price {
    font-weight: 700;
    font-size: $text-sm;
    font-variant-numeric: tabular-nums;
  }

  &__totals {
    margin: 1rem 0 0;
    padding-top: 1rem;
    border-top: 1px dashed $line;
    @include flex(column, stretch, flex-start, 0.45rem);

    div {
      @include flex(row, baseline, space-between);
      font-size: $text-sm;
      color: $ink-soft;
    }

    dd {
      margin: 0;
      font-weight: 600;
      color: $ink;
    }
  }

  &__total {
    margin-top: 0.3rem;

    dt {
      font-weight: 700;
      color: $ink;
    }

    dd {
      @include display($text-xl, 800);
    }
  }

  &__city {
    margin-top: 1rem;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $accent;
      margin-right: 0.3rem;
    }
  }
}
</style>
