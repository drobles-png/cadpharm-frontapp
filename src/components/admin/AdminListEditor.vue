<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { productFormCopy as copy } from '@/config/admin.copy'

/** Lista editable de textos (puntos clave, beneficios, advertencias). */
defineProps<{ label: string; placeholder?: string }>()
const list = defineModel<string[]>({ required: true })
const root = ref<HTMLElement | null>(null)

async function add() {
  list.value.push('')
  await nextTick()
  const inputs = root.value?.querySelectorAll('input')
  inputs?.[inputs.length - 1]?.focus()
}

function move(i: number, dir: -1 | 1) {
  const j = i + dir
  if (j < 0 || j >= list.value.length) return
  const copyList = [...list.value]
  ;[copyList[i], copyList[j]] = [copyList[j]!, copyList[i]!]
  list.value = copyList
}
</script>

<template>
  <div ref="root" class="lst">
    <p class="lst__label">{{ label }}</p>
    <TransitionGroup tag="ol" name="lst" class="lst__items">
      <li v-for="(_, i) in list" :key="i" class="lst__item">
        <span class="lst__num">{{ i + 1 }}</span>
        <input v-model="list[i]" type="text" :placeholder="placeholder" @keydown.enter.prevent="add" />
        <div class="lst__tools">
          <button type="button" :disabled="i === 0" :aria-label="copy.moveUp" @click="move(i, -1)">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
          <button type="button" :disabled="i === list.length - 1" :aria-label="copy.moveDown" @click="move(i, 1)">
            <i class="fa-solid fa-arrow-down"></i>
          </button>
          <button type="button" class="lst__del" :aria-label="copy.remove" @click="list.splice(i, 1)">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </li>
    </TransitionGroup>
    <button type="button" class="lst__add" @click="add">
      <i class="fa-solid fa-plus"></i> {{ copy.addItem }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.lst {
  flex: 1 1 100%;
  min-width: 0;

  &__label {
    font-size: 0.82rem;
    font-weight: 700;
    margin-bottom: 0.45rem;
  }

  &__items {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.5rem);
  }

  &__num {
    flex-shrink: 0;
    width: 22px;
    font-size: $text-xs;
    font-weight: 800;
    color: $ink-muted;
    text-align: center;
  }

  &__tools {
    @include flex(row, center, flex-start, 0.15rem);
    flex-shrink: 0;

    button {
      width: 34px;
      height: 34px;
      border-radius: 9px;
      color: $ink-muted;
      transition:
        background-color 0.2s ease,
        color 0.2s ease;

      &:hover:not(:disabled) {
        background: $sand;
        color: $ink;
      }

      &:disabled {
        opacity: 0.3;
        cursor: default;
      }
    }
  }

  &__del:hover {
    background: $danger-bg !important;
    color: $danger !important;
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

// Las filas usan el índice como key: solo se anima la entrada para no "borrar" la fila equivocada.
.lst-enter-active {
  transition:
    opacity 0.25s ease,
    transform 0.3s $ease;
}

.lst-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
