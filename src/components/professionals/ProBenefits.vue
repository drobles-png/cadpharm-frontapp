<script setup lang="ts">
import { professionalsCopy } from '@/config/pages.copy'
import SectionHeading from '@/components/common/SectionHeading.vue'

const copy = professionalsCopy.benefits
</script>

<template>
  <section class="benefits">
    <SectionHeading :eyebrow="copy.eyebrow" :title="copy.title" />
    <ul class="benefits__grid">
      <li
        v-for="(item, i) in copy.items"
        :key="item.title"
        class="benefits__cell"
        data-reveal
        :data-reveal-delay="(i * 0.08).toFixed(2)"
      >
        <article class="benefit">
          <span class="benefit__num" aria-hidden="true">0{{ i + 1 }}</span>
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
  border-radius: $radius-lg;
  background: $surface;
  border: 1px solid $line;
  overflow: hidden;
  transition:
    transform 0.5s $ease,
    box-shadow 0.5s $ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: $shadow-md;
  }

  &__num {
    position: absolute;
    right: 1rem;
    top: 0.4rem;
    font-family: $font-display;
    font-size: 3.5rem;
    font-weight: 800;
    letter-spacing: -0.05em;
    color: $sand;
  }

  &__icon {
    position: relative;
    width: 3.2rem;
    height: 3.2rem;
    border-radius: $radius-sm;
    @include flex(row, center, center);
    background: $brand-blue-soft;
    color: $brand-blue;
    font-size: 1.3rem;
    margin-bottom: 1.2rem;
    transition: transform 0.5s cubic-bezier(0.34, 1.6, 0.64, 1);
  }

  &:hover &__icon {
    transform: rotate(-10deg) scale(1.1);
  }

  &__title {
    font-size: $text-lg;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 0.4rem;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
