<script setup lang="ts">
import { ref, toRef } from 'vue'
import type { Product } from '@/types'
import { homeCopy } from '@/config/home.copy'
import { useStoryScroll } from '@/composables/useStoryScroll'
import SectionHeading from '@/components/common/SectionHeading.vue'
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue'
import StoryPanel from './StoryPanel.vue'

const props = defineProps<{ products: Product[]; loading: boolean }>()
const copy = homeCopy.story
const root = ref<HTMLElement | null>(null)

useStoryScroll(root, toRef(props, 'products'))
</script>

<template>
  <section ref="root" class="story">
    <div class="story__head">
      <SectionHeading :eyebrow="copy.eyebrow" :title="copy.title" align="center" />
    </div>

    <div v-if="loading" class="story__skeleton" aria-hidden="true">
      <div class="story__skeleton-copy">
        <SkeletonBlock dark width="40%" height="0.9rem" />
        <SkeletonBlock dark width="80%" height="4rem" />
        <SkeletonBlock dark width="60%" height="1.2rem" />
        <SkeletonBlock dark width="70%" height="2rem" radius="999px" />
      </div>
      <SkeletonBlock dark class="story__skeleton-art" height="20rem" radius="50%" width="20rem" />
    </div>

    <div v-else class="story__stage">
      <StoryPanel
        v-for="(product, i) in products"
        :key="product._id"
        :product="product"
        :index="i"
        :total="products.length"
      />
      <div class="story__progress" aria-hidden="true">
        <span v-for="product in products" :key="product._id" class="story__dot"></span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.story {
  position: relative;
  background: $paper;

  &__head {
    @include container;
    padding-block: $space-section $space-lg;
  }

  &__skeleton {
    background: $ink;
    min-height: 34rem;
    padding: 4rem 1.25rem;
    @include flex(column, center, center, 2.5rem);

    @include from('lg') {
      flex-direction: row;
      padding-inline: 8%;
    }
  }

  &__skeleton-copy {
    @include flex(column, stretch, flex-start, 1rem);
    width: 100%;
    max-width: 32rem;
  }

  &__stage {
    position: relative;
  }

  &__progress {
    display: none;
  }

  &--pinned &__stage {
    height: 100vh;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.16);
      pointer-events: none;
    }
  }

  &--pinned &__progress {
    position: absolute;
    right: 2rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;
    @include flex(column, center, center, 0.6rem);
  }

  &__dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.45);
  }
}
</style>
