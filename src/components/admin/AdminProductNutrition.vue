<script setup lang="ts">
import AdminFormSection from '@/components/admin/AdminFormSection.vue'
import AdminField from '@/components/admin/AdminField.vue'
import AdminPairsEditor from '@/components/admin/AdminPairsEditor.vue'
import { productFormCopy as copy } from '@/config/admin.copy'
import type { ProductForm } from '@/composables/useAdminProductForm'

const form = defineModel<ProductForm>({ required: true })
const section = copy.sections[4]!
const f = copy.fields

const rowFields = [
  { key: 'name' as const, label: f.rowName, flex: '2 1 0' },
  { key: 'amount' as const, label: f.rowAmount },
  { key: 'vdr' as const, label: f.rowVdr },
]
</script>

<template>
  <AdminFormSection :id="section.id" :title="section.label" :icon="section.icon">
    <AdminField :label="f.serving" for="p-serving">
      <input id="p-serving" v-model="form.nutrition.serving" type="text" />
    </AdminField>
    <AdminField :label="f.servingsPerPack" for="p-servings">
      <input id="p-servings" v-model="form.nutrition.servingsPerPack" type="text" />
    </AdminField>
    <AdminPairsEditor v-model="form.nutrition.rows" :label="f.nutritionRows" :fields="rowFields" />
  </AdminFormSection>
</template>
