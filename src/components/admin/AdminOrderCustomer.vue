<script setup lang="ts">
import { computed } from 'vue'
import { orderDetailCopy as copy, waLink } from '@/config/admin.copy'
import type { Order } from '@/types'

const props = defineProps<{ order: Order }>()

const c = computed(() => props.order.customer)
const wa = computed(() => waLink(c.value.phone, copy.waMessage(c.value.name, props.order.orderNumber)))
const rows = computed(() =>
  [
    { label: copy.document, value: c.value.documentId, icon: 'fa-solid fa-id-card' },
    { label: copy.city, value: c.value.city, icon: 'fa-solid fa-location-dot' },
    { label: copy.address, value: c.value.address, icon: 'fa-solid fa-house' },
    { label: copy.notes, value: c.value.notes, icon: 'fa-solid fa-note-sticky' },
  ].filter((r) => r.value),
)
</script>

<template>
  <section class="customer">
    <h2 class="customer__title">{{ copy.customer }}</h2>
    <div class="customer__who">
      <span class="customer__avatar">{{ (c.name || '?').charAt(0).toUpperCase() }}</span>
      <div class="customer__id">
        <strong>{{ c.name }}</strong>
        <a :href="`mailto:${c.email}`">{{ c.email }}</a>
        <a :href="`tel:${c.phone}`">{{ c.phone }}</a>
      </div>
    </div>

    <div class="customer__actions">
      <a :href="wa" target="_blank" rel="noopener" class="btn btn--primary customer__wa">
        <i class="fa-brands fa-whatsapp"></i> {{ copy.whatsapp }}
      </a>
      <a :href="`tel:${c.phone}`" class="btn btn--ghost">
        <i class="fa-solid fa-phone"></i> {{ copy.call }}
      </a>
    </div>

    <dl class="customer__list">
      <div v-for="r in rows" :key="r.label" class="customer__row">
        <dt><i :class="r.icon"></i> {{ r.label }}</dt>
        <dd>{{ r.value }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped lang="scss">
.customer {
  @include card;
  @include flex(column, stretch, flex-start, 1rem);
  padding: 1.2rem;

  &__title {
    @include display($text-lg, 700);
  }

  &__who {
    @include flex(row, center, flex-start, 0.85rem);
  }

  &__avatar {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: linear-gradient(140deg, $brand-blue, $accent);
    color: $surface;
    font-family: $font-display;
    font-size: 1.3rem;
    font-weight: 800;
  }

  &__id {
    @include flex(column, flex-start, flex-start);
    min-width: 0;
    line-height: 1.4;

    strong {
      font-size: 1.05rem;
    }

    a {
      font-size: $text-sm;
      color: $ink-soft;
      word-break: break-all;

      &:hover {
        color: $accent-deep;
      }
    }
  }

  &__actions {
    @include flex(row, stretch, flex-start, 0.6rem);
    flex-wrap: wrap;

    .btn {
      flex: 1 1 160px;
    }
  }

  &__wa {
    background: #1fa855;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.8rem);
    border-top: 1px solid $line;
    padding-top: 1rem;
  }

  &__row {
    dt {
      @include flex(row, center, flex-start, 0.45rem);
      font-size: $text-xs;
      font-weight: 700;
      color: $ink-muted;
      text-transform: uppercase;
      letter-spacing: 0.05em;

      i {
        width: 14px;
        color: $accent;
      }
    }

    dd {
      margin-top: 0.15rem;
      font-size: $text-sm;
      white-space: pre-line;
    }
  }
}
</style>
