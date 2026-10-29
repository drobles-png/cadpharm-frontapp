<script setup lang="ts">
import { useRouter } from 'vue-router'
import AdminPill from '@/components/admin/AdminPill.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { orderStatus, ordersCopy as copy } from '@/config/admin.copy'
import { formatCents, formatDateTime } from '@/utils/format'
import type { Order } from '@/types'

defineProps<{ orders: Order[]; loading: boolean }>()

const router = useRouter()
const open = (o: Order) => router.push(`/admin/pedidos/${o._id}`)
const units = (o: Order) => o.items.reduce((sum, i) => sum + i.quantity, 0)
</script>

<template>
  <div class="orders">
    <!-- Encabezado solo en escritorio; en móvil cada pedido es una tarjeta. -->
    <div class="orders__head" aria-hidden="true">
      <span class="orders__c orders__c--num">{{ copy.cols.number }}</span>
      <span class="orders__c orders__c--who">{{ copy.cols.customer }}</span>
      <span class="orders__c orders__c--date">{{ copy.cols.date }}</span>
      <span class="orders__c orders__c--pay">{{ copy.cols.payment }}</span>
      <span class="orders__c orders__c--total">{{ copy.cols.total }}</span>
      <span class="orders__c orders__c--status">{{ copy.cols.status }}</span>
    </div>

    <template v-if="loading">
      <div v-for="n in 6" :key="n" class="orders__row orders__row--skeleton">
        <span class="orders__c orders__c--num"><SkeletonBlock width="90px" /></span>
        <span class="orders__c orders__c--who"><SkeletonBlock width="70%" /><SkeletonBlock width="45%" height="0.7rem" /></span>
        <span class="orders__c orders__c--date"><SkeletonBlock width="80%" /></span>
        <span class="orders__c orders__c--pay"><SkeletonBlock width="70%" /></span>
        <span class="orders__c orders__c--total"><SkeletonBlock width="60px" /></span>
        <span class="orders__c orders__c--status"><SkeletonBlock width="86px" height="1.5rem" radius="99px" /></span>
      </div>
    </template>

    <TransitionGroup v-else name="list" tag="div" class="orders__body">
      <button
        v-for="(o, i) in orders"
        :key="o._id"
        type="button"
        class="orders__row"
        :style="{ '--i': i }"
        @click="open(o)"
      >
        <span class="orders__c orders__c--num">
          <strong>{{ o.orderNumber }}</strong>
          <small>{{ copy.items(units(o)) }}</small>
        </span>
        <span class="orders__c orders__c--who">
          <strong>{{ o.customer.name }}</strong>
          <small>{{ o.customer.city || o.customer.phone }}</small>
        </span>
        <span class="orders__c orders__c--date">{{ formatDateTime(o.createdAt) }}</span>
        <span class="orders__c orders__c--pay">{{ copy.payment[o.paymentMethod] || o.paymentMethod }}</span>
        <span class="orders__c orders__c--total">{{ formatCents(o.total) }}</span>
        <span class="orders__c orders__c--status">
          <AdminPill :label="orderStatus[o.status].label" :tone="orderStatus[o.status].tone" />
        </span>
      </button>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.orders {
  @include flex(column, stretch, flex-start, 0.6rem);

  @include from('lg') {
    @include card;
    gap: 0;
    overflow: hidden;
  }

  &__head {
    display: none;

    @include from('lg') {
      @include flex(row, center, flex-start, 1rem);
      padding: 0.8rem 1.2rem;
      background: $sand;
      font-size: $text-xs;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: $ink-muted;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.6rem);

    @include from('lg') {
      gap: 0;
    }
  }

  // Móvil: tarjeta con número + estado arriba, cliente y total abajo.
  &__row {
    @include card;
    @include flex(row, center, space-between, 0.35rem 1rem);
    flex-wrap: wrap;
    width: 100%;
    padding: 1rem 1.1rem;
    text-align: left;
    animation: row-in 0.45s $ease both;
    animation-delay: calc(var(--i, 0) * 0.035s);
    transition:
      background-color 0.2s ease,
      transform 0.25s $ease,
      box-shadow 0.25s $ease;
    @include focus-ring;

    &:hover {
      box-shadow: $shadow-sm;
    }

    &:active {
      transform: scale(0.99);
    }

    @include from('lg') {
      flex-wrap: nowrap;
      gap: 1rem;
      border: none;
      border-radius: 0;
      border-top: 1px solid $line;
      padding: 0.9rem 1.2rem;

      &:hover {
        box-shadow: none;
        background: $paper;
      }
    }

    &--skeleton {
      cursor: default;
    }
  }

  &__c {
    @include flex(column, flex-start, center, 0.2rem);
    min-width: 0;
    font-size: $text-sm;

    strong {
      font-weight: 700;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    small {
      font-size: $text-xs;
      color: $ink-muted;
    }

    &--num {
      order: 1;
      flex: 1 1 50%;
    }

    &--status {
      order: 2;
      align-items: flex-end;
    }

    &--who {
      order: 3;
      flex: 1 1 60%;
    }

    &--total {
      order: 4;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }

    &--date,
    &--pay {
      display: none;
    }

    @include from('lg') {
      order: 0 !important;

      &--num {
        flex: 0 0 140px;
      }

      &--who {
        flex: 1 1 auto;
      }

      &--date {
        display: flex;
        flex: 0 0 150px;
        color: $ink-soft;
      }

      &--pay {
        display: flex;
        flex: 0 0 150px;
        color: $ink-soft;
      }

      &--total {
        flex: 0 0 100px;
        align-items: flex-end;
      }

      &--status {
        flex: 0 0 130px;
      }
    }
  }
}

.list-leave-active {
  display: none;
}

@keyframes row-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>
