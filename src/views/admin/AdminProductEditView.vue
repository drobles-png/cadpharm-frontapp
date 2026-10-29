<script setup lang="ts">
import { computed } from 'vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminSectionNav from '@/components/admin/AdminSectionNav.vue'
import AdminProductBasic from '@/components/admin/AdminProductBasic.vue'
import AdminProductColors from '@/components/admin/AdminProductColors.vue'
import AdminProductImages from '@/components/admin/AdminProductImages.vue'
import AdminProductContent from '@/components/admin/AdminProductContent.vue'
import AdminProductNutrition from '@/components/admin/AdminProductNutrition.vue'
import AdminProductRegistry from '@/components/admin/AdminProductRegistry.vue'
import AdminSaveBar from '@/components/admin/AdminSaveBar.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { useAdminProductForm } from '@/composables/useAdminProductForm'
import { productFormCopy as copy } from '@/config/admin.copy'

const {
  form,
  isNew,
  loading,
  saving,
  deleting,
  dirty,
  confirmDelete,
  leaveTarget,
  save,
  remove,
  confirmLeave,
} = useAdminProductForm()

const title = computed(() =>
  isNew.value ? copy.newTitle : [form.value.name, form.value.nameAccent].filter(Boolean).join(' '),
)
</script>

<template>
  <div class="pedit">
    <template v-if="loading">
      <SkeletonBlock width="140px" height="0.9rem" />
      <SkeletonBlock width="280px" height="2.2rem" />
      <div class="pedit__layout">
        <div class="pedit__nav"><SkeletonBlock height="44px" radius="99px" /></div>
        <div class="pedit__sections">
          <div v-for="n in 2" :key="n" class="pedit__skeleton">
            <SkeletonBlock width="40%" height="1.3rem" />
            <div class="pedit__skeleton-row">
              <SkeletonBlock height="2.8rem" />
              <SkeletonBlock height="2.8rem" />
            </div>
            <SkeletonBlock height="2.8rem" />
            <SkeletonBlock height="6rem" />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <AdminPageHeader :title="title" back-to="/admin/productos" :back-label="copy.back" />

      <div class="pedit__layout">
        <div class="pedit__nav">
          <AdminSectionNav :sections="copy.sections" />
        </div>
        <form class="pedit__sections" novalidate @submit.prevent="save">
          <AdminProductBasic v-model="form" />
          <AdminProductColors v-model="form" />
          <AdminProductImages v-model="form" />
          <AdminProductContent v-model="form" />
          <AdminProductNutrition v-model="form" />
          <AdminProductRegistry v-model="form" />
        </form>
      </div>

      <AdminSaveBar :dirty="dirty" :saving="saving" :is-new="isNew" @save="save" @remove="confirmDelete = true" />
    </template>

    <BaseModal
      :open="confirmDelete"
      :title="copy.deleteTitle"
      :message="copy.deleteMessage"
      :confirm-label="deleting ? copy.saving : copy.deleteConfirm"
      danger
      @confirm="remove"
      @cancel="confirmDelete = false"
    />
    <BaseModal
      :open="Boolean(leaveTarget)"
      :title="copy.leaveTitle"
      :message="copy.leaveMessage"
      :confirm-label="copy.leaveConfirm"
      :cancel-label="copy.leaveCancel"
      danger
      @confirm="confirmLeave"
      @cancel="leaveTarget = null"
    />
  </div>
</template>

<style scoped lang="scss">
.pedit {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__layout {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 1.5rem;
    }
  }

  &__nav {
    position: sticky;
    top: 4.4rem;
    z-index: 20;

    @include from('lg') {
      top: 1.5rem;
      flex: 0 0 190px;
    }
  }

  &__sections {
    @include flex(column, stretch, flex-start, 1.1rem);
    flex: 1;
    min-width: 0;

    > * {
      animation: section-in 0.5s $ease both;
    }

    @for $i from 1 through 6 {
      > :nth-child(#{$i}) {
        animation-delay: #{$i * 0.05}s;
      }
    }
  }

  &__skeleton {
    @include card;
    @include flex(column, stretch, flex-start, 1rem);
    padding: 1.4rem;
  }

  &__skeleton-row {
    @include flex(row, center, flex-start, 1rem);
  }
}

@keyframes section-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}
</style>
