<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { useAdminChart, type ChartPoint } from '@/composables/useAdminChart'
import { dashboardCopy as copy } from '@/config/admin.copy'
import { formatCents } from '@/utils/format'

const props = defineProps<{ data: ChartPoint[] }>()

const box = ref<HTMLElement | null>(null)
const chart = useAdminChart(toRef(props, 'data'), box)
const shortDate = new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'short' })

function label(date: string) {
  // Las fechas vienen como "YYYY-MM-DD": se fijan a mediodía para no correrse de día por zona horaria.
  return shortDate.format(new Date(`${date.slice(0, 10)}T12:00:00`))
}

const total = computed(() => props.data.reduce((sum, d) => sum + d.total, 0))
const tipStyle = computed(() => {
  const p = chart.activePoint.value
  if (!p) return {}
  const left = Math.min(Math.max(p.x, 70), chart.width.value - 70)
  return { left: `${left}px`, top: `${p.y}px` }
})
</script>

<template>
  <section class="chart">
    <header class="chart__head">
      <h2 class="chart__title">{{ copy.chartTitle }}</h2>
      <p class="chart__total">{{ formatCents(total) }}</p>
    </header>

    <div
      ref="box"
      class="chart__box"
      @pointermove="chart.pick($event.clientX)"
      @pointerdown="chart.pick($event.clientX)"
      @pointerleave="chart.clear()"
    >
      <svg :width="chart.width.value" :height="chart.height" class="chart__svg" role="img" :aria-label="copy.chartTitle">
        <defs>
          <linearGradient id="sales-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" class="chart__stop chart__stop--area-top" />
            <stop offset="100%" class="chart__stop chart__stop--area-bottom" />
          </linearGradient>
          <linearGradient id="sales-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" class="chart__stop chart__stop--blue" />
            <stop offset="100%" class="chart__stop chart__stop--green" />
          </linearGradient>
        </defs>

        <line
          v-for="y in chart.gridLines.value"
          :key="y"
          :x1="0"
          :x2="chart.width.value"
          :y1="y"
          :y2="y"
          class="chart__grid"
        />
        <path :d="chart.areaPath.value" fill="url(#sales-area)" class="chart__area" />
        <path :d="chart.linePath.value" pathLength="1" class="chart__line" stroke="url(#sales-line)" />

        <g v-if="chart.activePoint.value">
          <line
            :x1="chart.activePoint.value.x"
            :x2="chart.activePoint.value.x"
            :y1="0"
            :y2="chart.height - 28"
            class="chart__cursor"
          />
          <circle :cx="chart.activePoint.value.x" :cy="chart.activePoint.value.y" r="6" class="chart__dot" />
        </g>

        <text
          v-for="pt in chart.labels.value"
          :key="pt.date"
          :x="pt.x"
          :y="chart.height - 8"
          class="chart__label"
          text-anchor="middle"
        >
          {{ label(pt.date) }}
        </text>
      </svg>

      <Transition name="tip">
        <div v-if="chart.activePoint.value" class="chart__tip" :style="tipStyle">
          <strong>{{ formatCents(chart.activePoint.value.total) }}</strong>
          <span>{{ label(chart.activePoint.value.date) }} · {{ copy.chartOrders(chart.activePoint.value.orders) }}</span>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped lang="scss">
.chart {
  @include card;
  padding: 1.2rem 1.2rem 0.8rem;
  min-width: 0;

  &__head {
    @include flex(row, baseline, space-between, 1rem);
    flex-wrap: wrap;
    margin-bottom: 0.6rem;
  }

  &__title {
    @include display($text-lg, 700);
  }

  &__total {
    font-weight: 800;
    color: $accent-deep;
    font-variant-numeric: tabular-nums;
  }

  &__box {
    position: relative;
    width: 100%;
    touch-action: pan-y;
    cursor: crosshair;
  }

  &__svg {
    display: block;
    overflow: visible;
  }

  &__stop {
    stop-color: $accent;

    &--area-top {
      stop-opacity: 0.32;
    }

    &--area-bottom {
      stop-opacity: 0;
    }

    &--blue {
      stop-color: $brand-blue;
    }
  }

  &__grid {
    stroke: $line;
    stroke-dasharray: 4 6;
  }

  &__area {
    animation: area-in 1.2s 0.4s $ease both;
  }

  &__line {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: line-draw 1.6s $ease forwards;
  }

  &__cursor {
    stroke: rgba($ink, 0.18);
    stroke-dasharray: 3 4;
  }

  &__dot {
    fill: $surface;
    stroke: $accent;
    stroke-width: 3;
  }

  &__label {
    font-size: 11px;
    fill: $ink-muted;
    font-family: $font-principal;
  }

  &__tip {
    position: absolute;
    transform: translate(-50%, calc(-100% - 14px));
    @include flex(column, center, flex-start, 0.1rem);
    padding: 0.5rem 0.8rem;
    border-radius: 10px;
    background: $ink;
    color: $surface;
    pointer-events: none;
    white-space: nowrap;
    box-shadow: $shadow-md;
    transition:
      left 0.18s $ease,
      top 0.18s $ease;

    strong {
      font-size: 0.95rem;
    }

    span {
      font-size: 0.72rem;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

.tip-enter-active,
.tip-leave-active {
  transition: opacity 0.2s ease;
}

.tip-enter-from,
.tip-leave-to {
  opacity: 0;
}

@keyframes line-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes area-in {
  from {
    opacity: 0;
  }
}
</style>
