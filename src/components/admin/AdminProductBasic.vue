<script setup lang="ts">
import AdminFormSection from '@/components/admin/AdminFormSection.vue'
import AdminField from '@/components/admin/AdminField.vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import { categories, productFormCopy as copy } from '@/config/admin.copy'
import type { ProductForm } from '@/composables/useAdminProductForm'

const form = defineModel<ProductForm>({ required: true })
const section = copy.sections[0]!
const f = copy.fields

/** Al cambiar de categoría se propone su etiqueta, que luego se puede ajustar. */
function onCategory() {
  const match = categories.find((c) => c.value === form.value.category)
  if (match) form.value.categoryLabel = match.label
}
</script>

<template>
  <AdminFormSection :id="section.id" :title="section.label" :icon="section.icon">
    <AdminField :label="f.name" for="p-name">
      <input id="p-name" v-model="form.name" type="text" required />
    </AdminField>
    <AdminField :label="f.nameAccent" :hint="f.nameAccentHint" for="p-accent">
      <input id="p-accent" v-model="form.nameAccent" type="text" />
    </AdminField>
    <AdminField :label="f.tagline" for="p-tagline" wide>
      <input id="p-tagline" v-model="form.tagline" type="text" />
    </AdminField>
    <AdminField :label="f.description" for="p-desc" wide>
      <textarea id="p-desc" v-model="form.description" rows="4"></textarea>
    </AdminField>
    <AdminField :label="f.category" for="p-cat">
      <select id="p-cat" v-model="form.category" @change="onCategory">
        <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
      </select>
    </AdminField>
    <AdminField :label="f.categoryLabel" :hint="f.categoryLabelHint" for="p-catlabel">
      <input id="p-catlabel" v-model="form.categoryLabel" type="text" />
    </AdminField>
    <AdminField :label="f.presentation" :hint="f.presentationHint" for="p-pres" wide>
      <input id="p-pres" v-model="form.presentation" type="text" />
    </AdminField>
    <AdminField :label="f.price" :hint="f.priceHint" for="p-price">
      <div class="basic__money">
        <span>$</span>
        <input id="p-price" v-model="form.priceText" type="text" inputmode="decimal" placeholder="0.00" />
      </div>
    </AdminField>
    <AdminField :label="f.stock" for="p-stock">
      <input id="p-stock" v-model.number="form.stock" type="number" min="0" step="1" inputmode="numeric" />
    </AdminField>
    <AdminField :label="f.order" :hint="f.orderHint" for="p-order">
      <input id="p-order" v-model.number="form.order" type="number" step="1" inputmode="numeric" />
    </AdminField>
    <div class="basic__switches">
      <AdminSwitch v-model="form.isPublished" :label="f.isPublished" />
      <AdminSwitch v-model="form.featured" :label="f.featured" />
    </div>
  </AdminFormSection>
</template>

<style scoped lang="scss">
.basic {
  &__money {
    position: relative;

    span {
      position: absolute;
      left: 0.95rem;
      top: 50%;
      transform: translateY(-50%);
      font-weight: 700;
      color: $ink-muted;
    }

    input {
      padding-left: 1.9rem;
      font-variant-numeric: tabular-nums;
    }
  }

  &__switches {
    @include flex(row, center, flex-start, 1.5rem);
    flex: 1 1 100%;
    flex-wrap: wrap;
    padding: 1rem;
    border-radius: 12px;
    background: $paper;
  }
}
</style>
