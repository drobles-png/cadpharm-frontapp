<script setup lang="ts">
import { computed } from 'vue'
import AdminFormSection from '@/components/admin/AdminFormSection.vue'
import { productFormCopy as copy, productsCopy } from '@/config/admin.copy'
import { imageUrl } from '@/utils/format'
import type { ProductForm } from '@/composables/useAdminProductForm'

const form = defineModel<ProductForm>({ required: true })
const section = copy.sections[1]!

const swatches = [
  { key: 'primary', label: copy.fields.primary },
  { key: 'secondary', label: copy.fields.secondary },
  { key: 'ink', label: copy.fields.ink },
] as const

const price = computed(() => {
  const v = form.value.priceText.replace(',', '.').trim()
  return v && !isNaN(Number(v)) ? `$${Number(v).toFixed(2)}` : productsCopy.noPrice
})
</script>

<template>
  <AdminFormSection :id="section.id" :title="section.label" :icon="section.icon">
    <div class="colors">
      <div class="colors__pickers">
        <label v-for="s in swatches" :key="s.key" class="colors__swatch">
          <span class="colors__chip" :style="{ background: form.theme[s.key] }">
            <input v-model="form.theme[s.key]" type="color" :aria-label="s.label" />
          </span>
          <span class="colors__text">
            <strong>{{ s.label }}</strong>
            <input v-model.lazy="form.theme[s.key]" type="text" class="colors__hex" maxlength="7" />
          </span>
        </label>
      </div>

      <div class="colors__preview">
        <p class="colors__label">{{ copy.fields.previewLabel }}</p>
        <article
          class="colors__card"
          :style="{ '--p': form.theme.primary, '--s': form.theme.secondary, '--k': form.theme.ink }"
        >
          <div class="colors__media">
            <img :src="imageUrl(form.cutout || form.images[0])" alt="" />
          </div>
          <div class="colors__body">
            <p class="colors__cat">{{ form.categoryLabel }}</p>
            <h3 class="colors__name">
              {{ form.name || copy.newTitle }} <em>{{ form.nameAccent }}</em>
            </h3>
            <p class="colors__tagline">{{ form.tagline }}</p>
            <div class="colors__foot">
              <strong>{{ price }}</strong>
              <span class="colors__btn"><i class="fa-solid fa-bag-shopping"></i></span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </AdminFormSection>
</template>

<style scoped lang="scss">
.colors {
  @include flex(column, stretch, flex-start, 1.4rem);
  flex: 1 1 100%;

  @include from('md') {
    flex-direction: row;
    align-items: flex-start;
  }

  &__pickers {
    @include flex(column, stretch, flex-start, 0.8rem);
    flex: 1;
  }

  &__swatch {
    @include flex(row, center, flex-start, 0.9rem);
    margin: 0;
    padding: 0.7rem;
    border-radius: 14px;
    border: 1px solid $line;
    cursor: pointer;
    transition: border-color 0.2s ease;

    &:hover {
      border-color: rgba($ink, 0.3);
    }
  }

  &__chip {
    position: relative;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;

    input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
      padding: 0;
    }
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.2rem);
    flex: 1;

    strong {
      font-size: $text-sm;
    }
  }

  &__hex {
    width: 110px;
    padding: 0.3rem 0.55rem;
    font-family: ui-monospace, monospace;
    font-size: 0.82rem;
    text-transform: uppercase;
  }

  &__preview {
    flex: 0 0 auto;
    width: 100%;

    @include from('md') {
      width: 260px;
    }
  }

  &__label {
    font-size: $text-xs;
    font-weight: 700;
    color: $ink-muted;
    margin-bottom: 0.5rem;
  }

  &__card {
    overflow: hidden;
    border-radius: 22px;
    background: $surface;
    box-shadow: $shadow-md;
    transition: box-shadow 0.3s ease;
  }

  &__media {
    @include flex(row, center, center);
    height: 170px;
    background: radial-gradient(circle at 50% 65%, var(--s), var(--p));
    transition: background 0.4s ease;

    img {
      max-height: 140px;
      max-width: 70%;
      object-fit: contain;
      filter: drop-shadow(0 12px 16px rgba(0, 0, 0, 0.25));
    }
  }

  &__body {
    padding: 1rem 1.1rem 1.1rem;
    color: var(--k);
  }

  &__cat {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--p);
  }

  &__name {
    @include display($text-lg, 800);
    margin-top: 0.2rem;

    em {
      font-style: normal;
      color: var(--p);
    }
  }

  &__tagline {
    margin-top: 0.3rem;
    font-size: $text-xs;
    opacity: 0.75;
  }

  &__foot {
    @include flex(row, center, space-between);
    margin-top: 0.8rem;
  }

  &__btn {
    @include flex(row, center, center);
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--p);
    color: $surface;
    transition: background-color 0.3s ease;
  }
}
</style>
