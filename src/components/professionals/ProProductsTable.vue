<script setup lang="ts">
import type { Product } from '@/types'
import { professionalsCopy } from '@/config/pages.copy'
import SectionHeading from '@/components/common/SectionHeading.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'

defineProps<{ products: Product[]; loading: boolean }>()
const copy = professionalsCopy.table
</script>

<template>
  <section id="fichas" class="pro-table">
    <SectionHeading :eyebrow="copy.eyebrow" :title="copy.title" />
    <div class="pro-table__scroll" data-reveal>
      <table class="pro-table__table">
        <thead>
          <tr>
            <th scope="col">{{ copy.product }}</th>
            <th scope="col">{{ copy.actives }}</th>
            <th scope="col">{{ copy.presentation }}</th>
            <th scope="col">{{ copy.registry }}</th>
            <th scope="col">
              <span class="visually-hidden">{{ copy.view }}</span>
            </th>
          </tr>
        </thead>
        <tbody v-if="loading">
          <tr v-for="n in 4" :key="n">
            <td v-for="c in 5" :key="c">
              <SkeletonBlock :width="c === 2 ? '90%' : '70%'" height="1rem" />
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="p in products" :key="p._id" :style="{ '--p': p.theme.primary }">
            <th scope="row">
              <span class="pro-table__name"
                ><span class="pro-table__dot"></span>{{ p.name }} {{ p.nameAccent }}</span
              >
              <small>{{ p.categoryLabel }}</small>
            </th>
            <td>
              <ul class="pro-table__actives">
                <li v-for="a in p.activeIngredients" :key="a.name">
                  {{ a.name }} <b>{{ a.amount }}</b>
                </li>
              </ul>
            </td>
            <td>{{ p.presentation }}</td>
            <td class="pro-table__ns">{{ p.sanitaryRegistry || '—' }}</td>
            <td>
              <RouterLink
                :to="`/productos/${p.slug}`"
                class="pro-table__link"
                :aria-label="`${copy.view}: ${p.name} ${p.nameAccent}`"
              >
                {{ copy.view }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pro-table {
  @include container(1280px);
  @include flex(column, stretch, flex-start, $space-lg);
  padding-block: $space-xl;

  &__scroll {
    // relative: contiene al th .visually-hidden (absoluto) dentro del scroll.
    position: relative;
    overflow-x: auto;
    border-radius: $radius-lg;
    background: $surface;
    box-shadow: $shadow-md;
  }

  &__table {
    width: 100%;
    min-width: 52rem;
    border-collapse: collapse;
    font-size: $text-sm;

    th,
    td {
      padding: 1.1rem 1.2rem;
      text-align: left;
      vertical-align: top;
      border-bottom: 1px solid $line;
    }

    thead th {
      background: $ink;
      color: $surface;
      font-size: $text-xs;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    tbody tr {
      transition: background-color 0.25s ease;

      &:hover {
        background: color-mix(in srgb, var(--p, #{$accent}) 6%, #fff);
      }

      &:last-child > * {
        border-bottom: none;
      }
    }

    small {
      display: block;
      color: $ink-muted;
      font-weight: 500;
      margin-top: 0.2rem;
    }
  }

  &__name {
    @include flex(row, center, flex-start, 0.5rem);
    font-family: $font-display;
    font-size: 1.05rem;
    font-weight: 800;
    white-space: nowrap;
  }

  &__dot {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 50%;
    background: var(--p);
  }

  &__actives {
    list-style: none;
    @include flex(column, flex-start, flex-start, 0.2rem);

    b {
      color: $ink-soft;
      font-weight: 700;
    }
  }

  &__ns {
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    white-space: nowrap;
  }

  &__link {
    @include flex(row, center, flex-start, 0.4rem);
    font-weight: 700;
    color: $accent-deep;
    white-space: nowrap;

    i {
      transition: transform 0.3s $ease;
    }

    &:hover i {
      transform: translateX(4px);
    }
  }
}
</style>
