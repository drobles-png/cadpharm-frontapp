<script setup lang="ts">
import { professionalsCopy } from '@/config/pages.copy'
import SectionHeading from '@/components/common/SectionHeading.vue'

const copy = professionalsCopy.benefits
</script>

<template>
  <section class="benefits">
    <SectionHeading :title="copy.title" />
    <ul class="benefits__grid">
      <li
        v-for="(item, i) in copy.items"
        :key="item.title"
        class="benefits__cell"
        data-reveal
        :data-reveal-delay="(i * 0.08).toFixed(2)"
      >
        <article class="benefit">
          <span class="benefit__icon"><i :class="item.icon" aria-hidden="true"></i></span>
          <h3 class="benefit__title">{{ item.title }}</h3>
          <p class="benefit__text">{{ item.text }}</p>
        </article>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.benefits {
  @include container(1280px);
  @include flex(column, stretch, flex-start, $space-lg);
  padding-block: $space-xl;

  &__grid {
    list-style: none;
    @include flex-cards(100%, 1rem);

    > * {
      @include from('sm') {
        flex: 0 0 calc(50% - 0.5rem);
      }

      @include from('lg') {
        flex: 0 0 calc(25% - 0.75rem);
      }
    }
  }

  &__cell {
    display: flex;
  }
}

.benefit {
  position: relative;
  flex: 1;
  padding: 1.6rem;
  border-radius: $radius-md;
  background: $forest-raised;
  border: 1px solid $cream-line;
  color: $cream;
  overflow: hidden;
  transition: border-color 0.2s ease-out;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: $cream-soft;
    }

    &:hover .benefit__icon {
      transform: translateY(-2px);
    }
  }

  &__icon {
    position: relative;
    width: 3.2rem;
    height: 3.2rem;
    border-radius: $radius-sm;
    @include flex(row, center, center);
    background: $cream;
    color: $forest;
    font-size: 1.3rem;
    margin-bottom: 1.2rem;
    transition: transform 0.2s ease-out;
  }

  &__title {
    font-size: $text-lg;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 0.4rem;
  }

  &__text {
    font-size: $text-sm;
    line-height: 1.6;
    color: $cream-soft;
  }
}
</style>
