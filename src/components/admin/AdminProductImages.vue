<script setup lang="ts">
import { ref } from 'vue'
import AdminFormSection from '@/components/admin/AdminFormSection.vue'
import AdminField from '@/components/admin/AdminField.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import { useAdminUpload } from '@/composables/useAdminUpload'
import { productFormCopy as copy } from '@/config/admin.copy'
import { imageUrl } from '@/utils/format'
import type { ProductForm } from '@/composables/useAdminProductForm'

const form = defineModel<ProductForm>({ required: true })
const section = copy.sections[2]!
const f = copy.fields

const { uploading, unavailable, uploadFiles, addUrl } = useAdminUpload((url) => {
  if (!form.value.images.includes(url)) form.value.images.push(url)
})

const dragging = ref(false)
const manual = ref('')
const picker = ref<HTMLInputElement | null>(null)

function onDrop(event: DragEvent) {
  dragging.value = false
  uploadFiles(event.dataTransfer?.files)
}

function onPick(event: Event) {
  const input = event.target as HTMLInputElement
  uploadFiles(input.files)
  input.value = ''
}

function addManual() {
  if (addUrl(manual.value)) manual.value = ''
}

function move(i: number, dir: -1 | 1) {
  const list = [...form.value.images]
  const j = i + dir
  if (j < 0 || j >= list.length) return
  ;[list[i], list[j]] = [list[j]!, list[i]!]
  form.value.images = list
}
</script>

<template>
  <AdminFormSection :id="section.id" :title="section.label" :icon="section.icon">
    <input ref="picker" type="file" accept="image/*" multiple hidden @change="onPick" />
    <button
      v-if="!unavailable"
      type="button"
      class="imgs__drop"
      :class="{ 'imgs__drop--over': dragging }"
      @click="picker?.click()"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <i class="fa-solid fa-cloud-arrow-up"></i>
      <strong>{{ f.drop }}</strong>
      <small>{{ f.dropHint }}</small>
    </button>
    <p v-else class="imgs__off"><i class="fa-solid fa-circle-info"></i> {{ copy.uploadUnavailable }}</p>

    <div class="imgs__manual">
      <input v-model="manual" type="url" :placeholder="f.manualUrl" :aria-label="f.manualUrl" @keydown.enter.prevent="addManual" />
      <button type="button" class="btn btn--dark" :disabled="!manual.trim()" @click="addManual">{{ f.addUrl }}</button>
    </div>

    <TransitionGroup tag="ul" name="imgs" class="imgs__list">
      <li v-for="(src, i) in form.images" :key="src" class="imgs__item">
        <img :src="imageUrl(src)" alt="" loading="lazy" />
        <span v-if="i === 0" class="imgs__cover">{{ f.cover }}</span>
        <div class="imgs__tools">
          <button type="button" :disabled="i === 0" :aria-label="copy.moveUp" @click="move(i, -1)">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button type="button" :disabled="i === form.images.length - 1" :aria-label="copy.moveDown" @click="move(i, 1)">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button type="button" class="imgs__del" :aria-label="copy.remove" @click="form.images.splice(i, 1)">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </li>
      <li v-for="n in uploading" :key="`up-${n}`" class="imgs__item imgs__item--loading" :aria-label="f.uploading">
        <SkeletonBlock height="100%" radius="12px" />
      </li>
    </TransitionGroup>

    <AdminField :label="f.cutout" :hint="f.cutoutHint" for="p-cutout" wide>
      <div class="imgs__cutout">
        <span class="imgs__cutout-thumb"><img v-if="form.cutout" :src="imageUrl(form.cutout)" alt="" /></span>
        <input id="p-cutout" v-model.trim="form.cutout" type="text" placeholder="https://…" />
      </div>
    </AdminField>
  </AdminFormSection>
</template>

<style scoped lang="scss">
.imgs {
  &__drop {
    @include flex(column, center, center, 0.35rem);
    flex: 1 1 100%;
    padding: 1.8rem 1rem;
    border-radius: 16px;
    border: 2px dashed rgba($ink, 0.18);
    background: $paper;
    text-align: center;
    transition:
      border-color 0.25s ease,
      background-color 0.25s ease,
      transform 0.25s $ease;
    @include focus-ring;

    i {
      font-size: 1.8rem;
      color: $accent;
      transition: transform 0.35s $ease;
    }

    small {
      font-size: $text-xs;
      color: $ink-muted;
    }

    &:hover i,
    &--over i {
      transform: translateY(-4px);
    }

    &--over {
      border-color: $accent;
      background: $accent-soft;
      transform: scale(1.01);
    }
  }

  &__off {
    flex: 1 1 100%;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    background: $info-bg;
    color: darken($info, 10%);
    font-size: $text-sm;
    font-weight: 600;
  }

  &__manual {
    @include flex(row, center, flex-start, 0.5rem);
    flex: 1 1 100%;

    .btn {
      flex-shrink: 0;
      padding: 0.75rem 1.2rem;
    }
  }

  &__list {
    list-style: none;
    @include flex-cards(130px, 0.7rem);
    flex: 1 1 100%;

    > * {
      max-width: 170px;
    }
  }

  &__item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 14px;
    border: 1px solid $line;
    background: $paper;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 0.5rem;
    }

    &:hover .imgs__tools {
      opacity: 1;
    }
  }

  &__cover {
    position: absolute;
    top: 0.4rem;
    left: 0.4rem;
    padding: 0.15rem 0.5rem;
    border-radius: $radius-pill;
    background: $ink;
    color: $lime;
    font-size: 0.65rem;
    font-weight: 800;
  }

  &__tools {
    position: absolute;
    inset: auto 0.35rem 0.35rem;
    @include flex(row, center, center, 0.25rem);
    padding: 0.25rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: $shadow-sm;
    transition: opacity 0.2s ease;

    @media (hover: hover) {
      opacity: 0;
    }

    button {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      font-size: 0.75rem;

      &:hover:not(:disabled) {
        background: $sand;
      }

      &:disabled {
        opacity: 0.3;
      }
    }
  }

  &__del:hover {
    background: $danger-bg !important;
    color: $danger;
  }

  &__cutout {
    @include flex(row, center, flex-start, 0.6rem);
  }

  &__cutout-thumb {
    flex-shrink: 0;
    width: 46px;
    height: 46px;
    border-radius: 10px;
    background: repeating-conic-gradient($sand 0 25%, $surface 0 50%) 0 0 / 12px 12px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

.imgs-enter-active,
.imgs-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.35s $ease;
}

.imgs-enter-from,
.imgs-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

.imgs-move {
  transition: transform 0.4s $ease;
}

.imgs-leave-active {
  position: absolute;
}
</style>
