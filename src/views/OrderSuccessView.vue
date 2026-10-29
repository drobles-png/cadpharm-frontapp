<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import OrderCelebration from '@/components/checkout/OrderCelebration.vue'
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { orderService, type PublicOrder } from '@/services/order.service'
import { orderMessage, waLink } from '@/composables/useCheckoutMessages'
import { successCopy as copy } from '@/config/checkout.copy'

/**
 * Página de pedido recibido. WhatsApp no se abre solo (sería un popup sin
 * permiso): el botón grande lo abre en el mismo gesto del usuario.
 */
const route = useRoute()
const orderNumber = String(route.params.orderNumber || '')

const order = ref<PublicOrder | null>(null)
const loading = ref(true)
const notFound = ref(false)
const whatsappNumber = ref('')

const isPaid = computed(() =>
  ['paid', 'confirmed', 'shipped', 'delivered'].includes(order.value?.status ?? ''),
)
const isWhatsapp = computed(() => order.value?.paymentMethod === 'whatsapp' && !isPaid.value)
const title = computed(() =>
  isPaid.value ? copy.titlePaid : isWhatsapp.value ? copy.titleWhatsapp : copy.titleDefault,
)
const steps = computed(() => (isPaid.value ? copy.nextPaid : copy.nextWhatsapp))
const waHref = computed(() =>
  order.value
    ? waLink(orderMessage(order.value), whatsappNumber.value)
    : waLink(`Hola CadPharm, mi pedido es ${orderNumber}.`, whatsappNumber.value),
)

onMounted(async () => {
  orderService
    .getConfig()
    .then((c) => (whatsappNumber.value = c.whatsapp))
    .catch(() => {})
  try {
    order.value = await orderService.getPublic(orderNumber)
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="success">
    <div class="success__inner">
      <OrderCelebration class="success__art" />

      <p class="success__eyebrow">{{ copy.eyebrow }}</p>
      <Transition name="fade" mode="out-in">
        <h1 :key="title" class="success__title">{{ title }}</h1>
      </Transition>
      <p class="success__greet">
        <SkeletonBlock v-if="loading" width="9rem" height="1rem" />
        <template v-else-if="order">{{ copy.greeting(order.customer.name) }}</template>
      </p>

      <div class="success__number">
        <span>{{ copy.orderLabel }}</span>
        <strong>{{ orderNumber }}</strong>
      </div>

      <p v-if="notFound" class="success__warn" role="alert">
        <i class="fa-solid fa-circle-info" aria-hidden="true"></i> {{ copy.notFound }}
      </p>

      <div class="success__cta">
        <a
          :href="waHref"
          target="_blank"
          rel="noopener"
          class="success__wa"
          :class="{ 'success__wa--main': isWhatsapp || loading }"
        >
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
          {{ isPaid ? copy.whatsappHelp : copy.whatsappCta }}
        </a>
        <RouterLink to="/productos" class="btn btn--ghost btn--lg">{{ copy.keepShopping }}</RouterLink>
      </div>

      <div class="success__cols">
        <section v-if="!notFound" class="success__next" aria-labelledby="next-title">
          <h2 id="next-title" class="success__next-title">{{ copy.nextTitle }}</h2>
          <ol>
            <li v-for="(step, i) in steps" :key="step" :style="{ '--i': i }">
              <span>{{ i + 1 }}</span> {{ step }}
            </li>
          </ol>
        </section>
        <OrderSummaryCard v-if="!notFound" :order="order" :loading="loading" class="success__summary" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.success {
  padding: 2.5rem 0 5rem;
  background:
    radial-gradient(40rem 26rem at 50% -8rem, rgba($lime, 0.4), transparent 65%),
    $paper;

  &__inner {
    @include container(960px);
    @include flex(column, center, flex-start);
    text-align: center;
  }

  &__art {
    margin-bottom: 1.25rem;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md, 800);
    color: $ink;
    margin-top: 0.35rem;
  }

  &__greet {
    min-height: 1.6rem;
    margin-top: 0.4rem;
    @include flex(row, center, center);
    color: $ink-soft;
    font-size: $text-lg;
  }

  &__number {
    @include flex(column, center, center, 0.15rem);
    margin-top: 1.25rem;
    padding: 0.8rem 1.6rem;
    border: 1.5px dashed rgba($accent, 0.5);
    border-radius: $radius-md;
    background: $surface;

    span {
      font-size: $text-xs;
      color: $ink-muted;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      font-weight: 600;
    }

    strong {
      font-family: $font-display;
      font-size: $text-xl;
      letter-spacing: 0.04em;
      color: $ink;
      user-select: all;
    }
  }

  &__warn {
    margin-top: 1.25rem;
    max-width: 44ch;
    padding: 0.9rem 1.1rem;
    border-radius: $radius-md;
    background: $warning-bg;
    color: $ink;
    font-size: $text-sm;
  }

  &__cta {
    @include flex(column, stretch, center, 0.7rem);
    width: 100%;
    max-width: 420px;
    margin-top: 1.75rem;
  }

  &__wa {
    @include flex(row, center, center, 0.6rem);
    min-height: 3.4rem;
    padding: 0.9rem 1.5rem;
    border-radius: $radius-pill;
    font-weight: 800;
    color: $accent-deep;
    border: 1.5px solid rgba($accent, 0.4);
    background: $surface;
    transition:
      transform 0.25s $ease,
      box-shadow 0.25s ease;
    @include focus-ring;

    i {
      font-size: 1.35rem;
    }

    &--main {
      min-height: 3.8rem;
      font-size: 1.08rem;
      color: $surface;
      border: 0;
      background: linear-gradient(120deg, #128c4a, #25d366);
      box-shadow: 0 16px 36px rgba(#25d366, 0.35);
      animation: wa-breathe 2.4s ease-in-out 1.6s infinite;
    }

    &:hover {
      transform: translateY(-2px);
    }
  }

  &__cols {
    width: 100%;
    margin-top: 2.5rem;
    @include flex(column, stretch, flex-start, 1rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__next {
    flex: 1;
    text-align: left;
    padding: 1.25rem;
    border-radius: $radius-lg;
    background: $ink;
    color: $surface;

    @include from('md') {
      padding: 1.6rem;
    }

    ol {
      list-style: none;
      padding: 0;
      margin: 1rem 0 0;
      @include flex(column, stretch, flex-start, 0.85rem);
    }

    li {
      @include flex(row, flex-start, flex-start, 0.75rem);
      font-size: $text-sm;
      line-height: 1.5;
      color: rgba($surface, 0.85);
      animation: step-in 0.6s $ease both;
      animation-delay: calc(0.8s + var(--i) * 0.12s);
    }

    li span {
      @include flex(row, center, center);
      flex: 0 0 1.6rem;
      height: 1.6rem;
      border-radius: 50%;
      background: $lime;
      color: $ink;
      font-weight: 800;
      font-size: 0.78rem;
    }
  }

  &__next-title {
    @include display($text-lg, 700);
  }

  &__summary {
    flex: 1;
  }
}

@keyframes wa-breathe {
  50% {
    box-shadow: 0 16px 44px rgba(#25d366, 0.55);
    transform: translateY(-1px);
  }
}

@keyframes step-in {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
}
</style>
