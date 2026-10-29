<script setup lang="ts">
import AdminFormSection from '@/components/admin/AdminFormSection.vue'
import AdminField from '@/components/admin/AdminField.vue'
import AdminListEditor from '@/components/admin/AdminListEditor.vue'
import AdminPairsEditor from '@/components/admin/AdminPairsEditor.vue'
import { productFormCopy as copy } from '@/config/admin.copy'
import type { ProductForm } from '@/composables/useAdminProductForm'

const form = defineModel<ProductForm>({ required: true })
const section = copy.sections[3]!
const f = copy.fields

const ingredientFields = [
  { key: 'name' as const, label: f.ingredientName, flex: '2 1 0' },
  { key: 'amount' as const, label: f.ingredientAmount },
]
const dosageFields = [
  { key: 'who' as const, label: f.dosageWho },
  { key: 'dose' as const, label: f.dosageDose, flex: '2 1 0' },
]
</script>

<template>
  <AdminFormSection :id="section.id" :title="section.label" :icon="section.icon">
    <AdminListEditor v-model="form.highlights" :label="f.highlights" />
    <AdminListEditor v-model="form.benefits" :label="f.benefits" />
    <AdminPairsEditor v-model="form.activeIngredients" :label="f.activeIngredients" :fields="ingredientFields" />
    <AdminPairsEditor v-model="form.dosage" :label="f.dosage" :fields="dosageFields" />
    <AdminListEditor v-model="form.warnings" :label="f.warnings" />
    <AdminField :label="f.ingredients" for="p-ingredients" wide>
      <textarea id="p-ingredients" v-model="form.ingredients" rows="3"></textarea>
    </AdminField>
    <AdminField :label="f.storage" for="p-storage" wide>
      <textarea id="p-storage" v-model="form.storage" rows="2"></textarea>
    </AdminField>
  </AdminFormSection>
</template>
