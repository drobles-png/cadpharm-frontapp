<script setup lang="ts">
import { computed, toRef } from 'vue'
import { RouterLink } from 'vue-router'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { useAdminCountUp } from '@/composables/useAdminCountUp'
import { formatCents } from '@/utils/format'

const props = defineProps<{
  label: string
  icon: string
  value: number
  money?: boolean
  loading?: boolean
  /** Variación en %; null pinta el texto de "sin comparación". */
  delta?: number | null
  deltaLabel?: string
  noDeltaLabel?: string
  /** Texto chico bajo el valor, para dar contexto ("de 8 productos"). */
  hint?: string
  tone?: 'green' | 'blue' | 'warning' | 'lime'
  to?: string
}>()

const animated = useAdminCountUp(toRef(props, 'value'))
const display = computed(() =>
  props.money ? formatCents(Math.round(animated.value)) : Math.round(animated.value).toLocaleString('es-EC'),
)
const deltaText = computed(() => {
  if (props.delta === null || props.delta === undefined) return ''
  const sign = props.delta > 0 ? '+' : ''
  return `${sign}${props.delta.toFixed(1)}%`
})
</script>

<template>
  <component :is="to ? RouterLink : 'div'" :to="to" class="kpi" :class="[`kpi--${tone || 'green'}`, { 'kpi--link': to }]">
    <template v-if="loading">
      <SkeletonBlock width="42px" height="42px" radius="12px" />
      <SkeletonBlock width="60%" height="0.8rem" />
      <SkeletonBlock width="75%" height="1.8rem" />
    </template>
    <template v-else>
      <span class="kpi__icon"><i :class="icon"></i></span>
      <p class="kpi__label">{{ label }}</p>
      <p class="kpi__value">{{ display }}</p>
      <p v-if="hint" class="kpi__delta">{{ hint }}</p>
      <p v-if="delta !== undefined" class="kpi__delta">
        <span
          v-if="deltaText"
          class="kpi__trend"
          :class="{ 'kpi__trend--down': (delta ?? 0) < 0 }"
        >
          <i :class="(delta ?? 0) < 0 ? 'fa-solid fa-arrow-trend-down' : 'fa-solid fa-arrow-trend-up'"></i>
          {{ deltaText }}
        </span>
        <span>{{ deltaText ? deltaLabel : noDeltaLabel }}</span>
      </p>
    </template>
  </component>
</template>

<style scoped lang="scss">
.kpi {
  @include card;
  @include flex(column, flex-start, flex-start, 0.4rem);
  position: relative;
  overflow: hidden;
  padding: 1.15rem 1.2rem;
  min-height: 150px;
  transition:
    transform 0.3s $ease,
    box-shadow 0.3s $ease;

  &--link:hover {
    transform: translateY(-3px);
    box-shadow: $shadow-md;
  }

  &__icon {
    @include flex(row, center, center);
    width: 42px;
    height: 42px;
    border-radius: 12px;
    margin-bottom: 0.4rem;
    background: var(--kpi-soft);
    color: var(--kpi-color);
  }

  &__label {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-muted;
  }

  &__value {
    @include display($text-xl, 800);
    font-variant-numeric: tabular-nums;
  }

  &__delta {
    @include flex(row, center, flex-start, 0.45rem);
    flex-wrap: wrap;
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__trend {
    @include flex(row, center, flex-start, 0.3rem);
    padding: 0.15rem 0.5rem;
    border-radius: $radius-pill;
    background: $success-bg;
    color: $accent-deep;
    font-weight: 700;

    &--down {
      background: $danger-bg;
      color: $danger;
    }
  }

  &--green {
    --kpi-color: #{$accent-deep};
    --kpi-soft: #{$accent-soft};
  }

  &--blue {
    --kpi-color: #{$brand-blue};
    --kpi-soft: #{$brand-blue-soft};
  }

  &--warning {
    --kpi-color: #{darken($warning, 12%)};
    --kpi-soft: #{$warning-bg};
  }

  &--lime {
    --kpi-color: #{$ink};
    --kpi-soft: #{rgba($lime, 0.45)};
  }
}
</style>
