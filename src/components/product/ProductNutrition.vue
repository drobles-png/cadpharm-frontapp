<script setup lang="ts">
import type { Product } from '@/types'
import { productCopy as copy } from '@/config/pages.copy'

defineProps<{ nutrition: Product['nutrition'] }>()
</script>

<template>
  <div class="nutrition">
    <dl class="nutrition__meta">
      <div>
        <dt>{{ copy.serving }}</dt>
        <dd>{{ nutrition.serving }}</dd>
      </div>
      <div v-if="nutrition.servingsPerPack">
        <dt>{{ copy.servings }}</dt>
        <dd>{{ nutrition.servingsPerPack }}</dd>
      </div>
    </dl>
    <div class="nutrition__scroll">
      <table class="nutrition__table">
        <thead>
          <tr>
            <th scope="col">{{ copy.nutrient }}</th>
            <th scope="col">{{ copy.amount }}</th>
            <th scope="col">{{ copy.vdr }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in nutrition.rows" :key="row.name">
            <th scope="row">{{ row.name }}</th>
            <td>{{ row.amount }}</td>
            <td>{{ row.vdr }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.nutrition {
  @include flex(column, stretch, flex-start, 1rem);

  &__meta {
    @include flex(row, stretch, flex-start, 0.75rem);
    flex-wrap: wrap;

    div {
      padding: 0.7rem 1rem;
      border-radius: $radius-sm;
      background: $sand;
    }

    dt {
      font-size: $text-xs;
      color: $ink-muted;
      font-weight: 600;
    }

    dd {
      font-weight: 700;
    }
  }

  &__scroll {
    overflow-x: auto;
    border-radius: $radius-md;
    border: 1px solid $line;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: $text-sm;
    min-width: 22rem;

    th,
    td {
      padding: 0.7rem 1rem;
      text-align: left;
      border-bottom: 1px solid $line;
    }

    thead th {
      background: $ink;
      color: $surface;
      font-size: $text-xs;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    tbody th {
      font-weight: 600;
    }

    td {
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    tbody tr:nth-child(even) {
      background: $paper;
    }

    tbody tr:last-child > * {
      border-bottom: none;
    }
  }
}
</style>
