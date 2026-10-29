<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { leadTypes, professionalsCopy } from '@/config/pages.copy'
import { useLeadForm } from '@/composables/useLeadForm'
import ChipSelect from './ChipSelect.vue'
import FormField from './FormField.vue'
import LeadSuccess from './LeadSuccess.vue'

const props = defineProps<{ products: Product[] }>()
const copy = professionalsCopy.form
const { form, website, sending, sent, successMessage, errorFor, touch, submit, reset } =
  useLeadForm()

// Se guardan nombres legibles: es lo que el equipo verá en el panel.
const productOptions = computed(() =>
  props.products.map((p) => {
    const label = `${p.name} ${p.nameAccent}`.trim()
    return { value: label, label }
  }),
)
const showSpecialty = computed(() => form.type === 'medico')
</script>

<template>
  <div class="lead">
    <Transition name="swap" mode="out-in">
      <LeadSuccess v-if="sent" :message="successMessage" @again="reset" />

      <form v-else class="lead__form" novalidate @submit.prevent="submit">
        <ChipSelect
          v-model="form.type"
          name="lead-type"
          :legend="copy.type"
          :options="leadTypes"
          :error="errorFor('type')"
          @blur="touch('type')"
        />

        <div class="lead__row">
          <FormField
            v-model="form.name"
            :label="copy.name"
            autocomplete="name"
            :error="errorFor('name')"
            @blur="touch('name')"
          />
          <Transition name="rise">
            <FormField
              v-if="showSpecialty"
              v-model="form.specialty"
              :label="copy.specialty"
              :placeholder="copy.specialtyPlaceholder"
              :optional="copy.optional"
            />
          </Transition>
        </div>
        <FormField
          v-model="form.institution"
          :label="copy.institution"
          autocomplete="organization"
          :optional="copy.optional"
        />
        <div class="lead__row">
          <FormField
            v-model="form.email"
            :label="copy.email"
            type="email"
            inputmode="email"
            autocomplete="email"
            :error="errorFor('email')"
            @blur="touch('email')"
          />
          <FormField
            v-model="form.phone"
            :label="copy.phone"
            type="tel"
            inputmode="tel"
            autocomplete="tel"
            :error="errorFor('phone')"
            @blur="touch('phone')"
          />
        </div>
        <FormField
          v-model="form.city"
          :label="copy.city"
          autocomplete="address-level2"
          :error="errorFor('city')"
          @blur="touch('city')"
        />

        <ChipSelect
          v-if="productOptions.length"
          v-model="form.productsOfInterest"
          name="lead-products"
          :legend="copy.products"
          :options="productOptions"
          multiple
        />

        <FormField
          v-model="form.message"
          :label="copy.message"
          :placeholder="copy.messagePlaceholder"
          :optional="copy.optional"
          textarea
        />

        <!-- Honeypot: invisible para personas, tentador para bots. -->
        <div class="lead__trap" aria-hidden="true">
          <label for="lead-website">Sitio web</label>
          <input
            id="lead-website"
            v-model="website"
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
          />
        </div>

        <button
          type="submit"
          class="btn btn--primary btn--lg btn--block lead__submit"
          :class="{ 'lead__submit--busy': sending }"
          :disabled="sending"
        >
          <span class="lead__progress" aria-hidden="true"></span>
          <i v-if="!sending" class="fa-solid fa-paper-plane" aria-hidden="true"></i>
          {{ sending ? copy.sending : copy.submit }}
        </button>
      </form>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.lead {
  position: relative;

  &__form {
    @include flex(column, stretch, flex-start, 1.2rem);
  }

  &__row {
    @include flex(column, stretch, flex-start, 1.2rem);

    @include from('md') {
      flex-direction: row;

      > * {
        flex: 1 1 0;
        min-width: 0;
      }
    }
  }

  &__trap {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  &__submit {
    position: relative;
    overflow: hidden;
    margin-top: 0.4rem;

    &:disabled {
      opacity: 1;
    }
  }

  // Sin spinner: una barra que avanza y un brillo que recorre el botón.
  &__progress {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    background: linear-gradient(
      100deg,
      transparent 20%,
      rgba(255, 255, 255, 0.35) 50%,
      transparent 80%
    );
    transform: translateX(-100%);
    pointer-events: none;
  }

  &__submit--busy {
    background: $accent-deep;
  }

  &__submit--busy &__progress {
    animation: shimmer 1.1s ease-in-out infinite;
  }
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.45s $ease;
}

.swap-enter-from {
  opacity: 0;
  transform: scale(0.96) translateY(12px);
}

.swap-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

@keyframes shimmer {
  to {
    transform: translateX(100%);
  }
}
</style>
