<script setup lang="ts" generic="T extends object">
import { nextTick, ref } from 'vue'
import { productFormCopy as copy } from '@/config/admin.copy'

/**
 * Filas editables de varios campos de texto: principios activos (nombre +
 * cantidad), dosis (para quién + cuánto) y la tabla nutricional.
 */
const props = defineProps<{
  label: string
  fields: { key: keyof T & string; label: string; flex?: string }[]
}>()
const rows = defineModel<T[]>({ required: true })
const root = ref<HTMLElement | null>(null)

async function add() {
  const row = Object.fromEntries(props.fields.map((f) => [f.key, ''])) as unknown as T
  rows.value.push(row)
  await nextTick()
  const items = root.value?.querySelectorAll('.pairs__row')
  items?.[items.length - 1]?.querySelector('input')?.focus()
}

const cell = (row: T, key: string) => (row as unknown as Record<string, string>)[key] ?? ''
function setCell(row: T, key: string, event: Event) {
  ;(row as unknown as Record<string, string>)[key] = (event.target as HTMLInputElement).value
}
</script>

<template>
  <div ref="root" class="pairs">
    <p class="pairs__label">{{ label }}</p>
    <div v-if="rows.length" class="pairs__head" aria-hidden="true">
      <span v-for="f in fields" :key="f.key" :style="{ flex: f.flex || '1 1 0' }">{{ f.label }}</span>
      <span class="pairs__spacer"></span>
    </div>
    <TransitionGroup tag="div" name="pairs" class="pairs__rows">
      <div v-for="(row, i) in rows" :key="i" class="pairs__row">
        <input
          v-for="f in fields"
          :key="f.key"
          :value="cell(row, f.key)"
          @input="setCell(row, f.key, $event)"
          type="text"
          :placeholder="f.label"
          :aria-label="f.label"
          :style="{ flex: f.flex || '1 1 0' }"
        />
        <button type="button" class="pairs__del" :aria-label="copy.remove" @click="rows.splice(i, 1)">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </TransitionGroup>
    <button type="button" class="pairs__add" @click="add">
      <i class="fa-solid fa-plus"></i> {{ copy.addRow }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.pairs {
  flex: 1 1 100%;
  min-width: 0;

  &__label {
    font-size: 0.82rem;
    font-weight: 700;
    margin-bottom: 0.45rem;
  }

  &__head {
    display: none;

    @include from('md') {
      @include flex(row, center, flex-start, 0.5rem);
      padding-inline: 0.2rem;
      margin-bottom: 0.3rem;
      font-size: $text-xs;
      color: $ink-muted;
      font-weight: 600;
    }
  }

  &__spacer {
    flex: 0 0 36px;
  }

  &__rows {
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__row {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    padding: 0.6rem;
    border-radius: 12px;
    background: $paper;

    @include from('md') {
      flex-wrap: nowrap;
      padding: 0;
      background: none;
    }

    input {
      min-width: 0;
      flex-basis: 100% !important;

      @include from('md') {
        flex-basis: 0 !important;
      }
    }
  }

  &__del {
    flex: 0 0 36px;
    height: 36px;
    margin-left: auto;
    border-radius: 9px;
    color: $ink-muted;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background: $danger-bg;
      color: $danger;
    }
  }

  &__add {
    @include flex(row, center, center, 0.45rem);
    margin-top: 0.6rem;
    padding: 0.55rem 1rem;
    border-radius: $radius-pill;
    border: 1px dashed rgba($ink, 0.25);
    font-size: $text-sm;
    font-weight: 700;
    color: $accent-deep;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      background: $accent-soft;
      border-color: $accent;
    }
  }
}

.pairs-enter-active {
  transition:
    opacity 0.25s ease,
    transform 0.3s $ease;
}

.pairs-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
