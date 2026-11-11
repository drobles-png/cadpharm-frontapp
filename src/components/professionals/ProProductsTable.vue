<script setup lang="ts">
import type { Product } from '@/types'
import { professionalsCopy } from '@/config/pages.copy'
import { productPhotos } from '@/config/info.copy'
import SectionHeading from '@/components/common/SectionHeading.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'

defineProps<{ products: Product[]; loading: boolean }>()
const copy = professionalsCopy.table

function photoOf(p: Product) {
  return productPhotos[p.slug] ?? p.images[0] ?? '/img/placeholder.svg'
}
</script>

<template>
  <section id="fichas" class="pro-table">
    <SectionHeading :title="copy.title" />
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
          <tr v-for="p in products" :key="p._id">
            <th scope="row">
              <span class="pro-table__product">
                <span class="pro-table__photo">
                  <img
                    :src="photoOf(p)"
                    :alt="`${copy.photoAlt} ${p.name} ${p.nameAccent}`"
                    loading="lazy"
                    decoding="async"
                    width="96"
                    height="96"
                  />
                </span>
                <span>
                  <span class="pro-table__name">{{ p.name }} {{ p.nameAccent }}</span>
                  <small>{{ p.categoryLabel }}</small>
                </span>
              </span>
            </th>
            <td :data-label="copy.actives">
              <ul class="pro-table__actives">
                <li v-for="a in p.activeIngredients" :key="a.name">
                  {{ a.name }} <b>{{ a.amount }}</b>
                </li>
              </ul>
            </td>
            <td :data-label="copy.presentation">{{ p.presentation }}</td>
            <td class="pro-table__ns" :data-label="copy.registry">
              {{ p.sanitaryRegistry || '—' }}
            </td>
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
    border-radius: $radius-md;
    border: 1px solid $cream-line;
    background: $forest-raised;
  }

  // Móvil: cada producto es una tarjeta apilada (una tabla de 5 columnas no
  // cabe en 360px). Desde md vuelve a ser tabla.
  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: $text-sm;
    color: $cream;

    thead {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }

    tbody tr {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1.25rem;
      border-bottom: 1px solid $cream-line;

      &:last-child {
        border-bottom: none;
      }
    }

    th,
    td {
      display: block;
      text-align: left;
      vertical-align: top;
    }

    td[data-label]::before {
      content: attr(data-label);
      display: block;
      margin-bottom: 0.2rem;
      font-size: $text-xs;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: $cream-muted;
    }

    small {
      display: block;
      font-size: 0.8rem;
      color: $cream-muted;
      font-weight: 500;
      margin-top: 0.15rem;
    }

    @include from('md') {
      min-width: 52rem;

      thead {
        position: static;
        width: auto;
        height: auto;
        overflow: visible;
        clip-path: none;
      }

      tbody tr {
        display: table-row;
        padding: 0;
        transition: background-color 0.2s ease-out;

        &:last-child > * {
          border-bottom: none;
        }
      }

      @media (hover: hover) and (pointer: fine) {
        tbody tr:hover {
          background: rgba($cream, 0.04);
        }
      }

      th,
      td {
        display: table-cell;
        padding: 1.1rem 1.2rem;
        border-bottom: 1px solid $cream-line;
        vertical-align: middle;
      }

      td[data-label]::before {
        content: none;
      }

      thead th {
        background: $forest-deep;
        color: $cream-soft;
        font-size: $text-xs;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }
    }
  }

  &__product {
    @include flex(row, center, flex-start, 0.9rem);
  }

  // Las fotos vienen con fondo blanco: el recuadro crema las integra.
  &__photo {
    flex-shrink: 0;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: $radius-sm;
    background: $cream;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 0.25rem;
      mix-blend-mode: multiply;
    }
  }

  &__name {
    display: block;
    font-family: $font-display;
    font-size: 1.05rem;
    font-weight: 800;
    white-space: nowrap;
  }

  &__actives {
    list-style: none;
    @include flex(column, flex-start, flex-start, 0.2rem);
    color: $cream-soft;

    b {
      color: $cream;
      font-weight: 700;
    }
  }

  &__ns {
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    white-space: nowrap;
  }

  &__link {
    min-height: 2.75rem;
    @include flex(row, center, flex-start, 0.45rem);
    font-weight: 700;
    color: $cream;
    white-space: nowrap;
    text-decoration: underline;
    text-decoration-color: $cream-line;
    text-underline-offset: 0.3em;

    i {
      font-size: 0.85em;
      transition: transform 0.2s ease-out;
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        text-decoration-color: $cream;
      }

      &:hover i {
        transform: translateX(4px);
      }
    }
  }
}
</style>
