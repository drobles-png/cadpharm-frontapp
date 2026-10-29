<script setup lang="ts">
import { computed } from 'vue'
import CheckoutSection from './CheckoutSection.vue'
import CheckoutField from './CheckoutField.vue'
import CheckoutPaymentOptions from './CheckoutPaymentOptions.vue'
import CheckoutPayButton from './CheckoutPayButton.vue'
import { site } from '@/config/site'
import {
  checkoutCopy as copy,
  customerFields,
  deliveryFields,
  ecuadorCities,
} from '@/config/checkout.copy'
import { formatCents } from '@/utils/format'
import type { CheckoutFormCtl } from '@/composables/useCheckoutForm'
import type { PaymentMethod } from '@/types'

/** Las tres secciones del checkout en una sola pantalla. Solo compone: la lógica es de useCheckout. */
const props = defineProps<{
  form: CheckoutFormCtl
  total: number
  payphoneEnabled: boolean
  configLoading: boolean
  submitting: boolean
  error: string
}>()
const method = defineModel<PaymentMethod>('method', { required: true })
const emit = defineEmits<{ submit: [] }>()

const isCard = computed(() => method.value === 'payphone')
const buttonLabel = computed(() =>
  isCard.value ? copy.payWithCard(formatCents(props.total)) : copy.sendOrder(formatCents(props.total)),
)
</script>

<template>
  <form class="co-form" novalidate @submit.prevent="emit('submit')">
    <Transition name="rise">
      <p v-if="form.usedRemembered.value" class="co-form__remembered">
        <i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>
        {{ copy.remembered }}
        <button type="button" @click="form.forget()">{{ copy.forget }}</button>
      </p>
    </Transition>

    <CheckoutSection
      :index="1"
      :title="copy.sections.customer.title"
      :subtitle="copy.sections.customer.subtitle"
      :done="form.customerDone.value"
    >
      <CheckoutField
        v-for="def in customerFields"
        :key="def.key"
        v-model="form.customer[def.key]"
        :def="def"
        :error="form.errors[def.key]"
        :wide="def.key === 'name'"
        @blur="form.onBlur(def.key)"
        @input="form.onInput(def.key)"
      />
    </CheckoutSection>

    <CheckoutSection
      :index="2"
      :title="copy.sections.delivery.title"
      :subtitle="copy.sections.delivery.subtitle"
      :done="form.deliveryDone.value"
    >
      <CheckoutField
        v-for="def in deliveryFields"
        :key="def.key"
        v-model="form.customer[def.key]"
        :def="def"
        :error="form.errors[def.key]"
        :wide="def.key !== 'city'"
        @blur="form.onBlur(def.key)"
        @input="form.onInput(def.key)"
      />
      <datalist id="checkout-cities">
        <option v-for="city in ecuadorCities" :key="city" :value="city" />
      </datalist>
    </CheckoutSection>

    <CheckoutSection
      :index="3"
      :title="copy.sections.payment.title"
      :subtitle="copy.sections.payment.subtitle"
    >
      <CheckoutPaymentOptions
        v-model="method"
        :payphone-enabled="payphoneEnabled"
        :loading="configLoading"
      />
    </CheckoutSection>

    <div class="co-form__submit">
      <div class="co-form__error" aria-live="assertive">
        <Transition name="rise">
          <p v-if="error" class="co-form__error-msg">
            <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
          </p>
        </Transition>
      </div>
      <CheckoutPayButton
        :label="buttonLabel"
        :loading="submitting"
        :icon="isCard ? 'fa-solid fa-lock' : 'fa-brands fa-whatsapp'"
        :whatsapp="!isCard"
      />
      <p class="co-form__secure">
        <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
        {{ copy.secureTitle }} · {{ copy.secureText }}
      </p>
      <p class="co-form__legal">{{ site.legal.disclaimer }}</p>
    </div>
  </form>
</template>

<style scoped lang="scss">
.co-form {
  @include flex(column, stretch, flex-start, 1rem);

  &__remembered {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    padding: 0.75rem 1rem;
    border-radius: $radius-md;
    background: linear-gradient(100deg, rgba($lime, 0.35), rgba($accent, 0.1));
    font-size: $text-sm;
    color: $ink;

    i {
      color: $accent-deep;
    }

    button {
      margin-left: auto;
      font-weight: 700;
      font-size: $text-xs;
      color: $brand-blue;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  &__submit {
    @include flex(column, stretch, flex-start, 0.75rem);
    padding-top: 0.25rem;
  }

  &__error {
    min-height: 0;
  }

  &__error-msg {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.75rem 1rem;
    border-radius: $radius-md;
    background: $danger-bg;
    color: darken($danger, 8%);
    font-size: $text-sm;
    font-weight: 600;
  }

  &__secure {
    text-align: center;
    font-size: $text-xs;
    color: $ink-soft;

    i {
      color: $accent;
      margin-right: 0.2rem;
    }
  }

  &__legal {
    text-align: center;
    font-size: 0.7rem;
    line-height: 1.5;
    color: $ink-muted;
    max-width: 62ch;
    margin-inline: auto;
  }
}
</style>
