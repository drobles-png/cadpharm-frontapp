<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminEmptyState from '@/components/admin/AdminEmptyState.vue'
import { dashboardCopy as copy } from '@/config/admin.copy'
import { formatCents } from '@/utils/format'
import type { AdminStats } from '@/types'

const props = defineProps<{ items: AdminStats['topProducts'] }>()

// Las barras arrancan en 0 y crecen un frame después de montar.
const grown = ref(false)
onMounted(() => requestAnimationFrame(() => requestAnimationFrame(() => (grown.value = true))))

const maxUnits = computed(() => Math.max(1, ...props.items.map((p) => p.units)))
</script>

<template>
  <section class="top">
    <h2 class="top__title">{{ copy.topTitle }}</h2>
    <ol v-if="items.length" class="top__list">
      <li v-for="(p, i) in items" :key="p.productId" class="top__item">
        <div class="top__row">
          <span class="top__rank">{{ i + 1 }}</span>
          <span class="top__name">{{ p.name }}</span>
          <span class="top__revenue">{{ formatCents(p.revenue) }}</span>
        </div>
        <div class="top__bar">
          <span
            class="top__fill"
            :style="{
              width: grown ? `${(p.units / maxUnits) * 100}%` : '0%',
              transitionDelay: `${i * 0.1}s`,
            }"
          ></span>
        </div>
        <span class="top__units">{{ copy.topUnits(p.units) }}</span>
      </li>
    </ol>
    <AdminEmptyState v-else compact icon="fa-solid fa-ranking-star" :title="copy.emptyTop" />
  </section>
</template>

<style scoped lang="scss">
.top {
  @include card;
  padding: 1.2rem;

  &__title {
    @include display($text-lg, 700);
    margin-bottom: 1rem;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__row {
    @include flex(row, center, flex-start, 0.6rem);
    margin-bottom: 0.4rem;
  }

  &__rank {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 8px;
    background: $sand;
    font-size: 0.75rem;
    font-weight: 800;
  }

  &__name {
    flex: 1;
    min-width: 0;
    font-weight: 700;
    font-size: $text-sm;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__revenue {
    font-size: $text-sm;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__bar {
    height: 10px;
    border-radius: $radius-pill;
    background: $sand;
    overflow: hidden;
  }

  &__fill {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, $brand-blue, $accent);
    transition: width 1s $ease;
  }

  &__units {
    display: block;
    margin-top: 0.3rem;
    font-size: $text-xs;
    color: $ink-muted;
  }
}
</style>
