<script setup lang="ts">
import AdminFormSection from '@/components/admin/AdminFormSection.vue'
import AdminField from '@/components/admin/AdminField.vue'
import { productFormCopy as copy } from '@/config/admin.copy'
import type { ProductForm } from '@/composables/useAdminProductForm'

const form = defineModel<ProductForm>({ required: true })
const section = copy.sections[5]!
const f = copy.fields
</script>

<template>
  <AdminFormSection :id="section.id" :title="section.label" :icon="section.icon">
    <AdminField :label="f.sanitaryRegistry" for="p-arcsa">
      <input id="p-arcsa" v-model="form.sanitaryRegistry" type="text" />
    </AdminField>
    <AdminField :label="f.barcode" for="p-barcode">
      <input id="p-barcode" v-model="form.barcode" type="text" inputmode="numeric" />
    </AdminField>
    <AdminField :label="f.audience" for="p-audience">
      <input id="p-audience" v-model="form.audience" type="text" />
    </AdminField>
    <AdminField :label="f.manufacturer" for="p-maker" wide>
      <input id="p-maker" v-model="form.manufacturer" type="text" />
    </AdminField>
  </AdminFormSection>
</template>
