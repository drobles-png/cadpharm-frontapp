<script setup lang="ts">
import { ref } from 'vue'
import { gsap } from 'gsap'
import { aboutCopy as copy } from '@/config/pages.copy'
import { useReveal } from '@/composables/useReveal'
import { useGsap } from '@/composables/useGsap'
import SectionHeading from '@/components/common/SectionHeading.vue'

const root = ref<HTMLElement | null>(null)
useReveal()

const lineup = ['abcvit-kiddi', 'expultox-forte', 'somnycad', 'enzabiox']

useGsap(root, () => {
  gsap.from('.about__title-line', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.1 })
  gsap.from('.about__lineup img', {
    y: 160,
    rotate: (i: number) => (i % 2 ? 12 : -12),
    opacity: 0,
    duration: 1.3,
    ease: 'back.out(1.4)',
    stagger: 0.1,
    delay: 0.3,
  })
  gsap.to('.about__lineup', {
    yPercent: -12,
    ease: 'none',
    scrollTrigger: { trigger: '.about__hero', start: 'top top', end: 'bottom top', scrub: true },
  })
})
</script>

<template>
  <div ref="root" class="about">
    <section class="about__hero">
      <p class="about__eyebrow">{{ copy.hero.eyebrow }}</p>
      <h1 class="about__title">
        <span class="about__mask"
          ><span class="about__title-line">{{ copy.hero.title }}</span></span
        >
      </h1>
      <p class="about__lead" data-reveal>{{ copy.hero.text }}</p>
      <div class="about__lineup" aria-hidden="true">
        <img v-for="slug in lineup" :key="slug" :src="`/img/cutouts/${slug}.png`" alt="" />
      </div>
    </section>

    <section class="about__story">
      <SectionHeading :eyebrow="copy.story.eyebrow" :title="copy.story.title" />
      <div class="about__story-text">
        <p
          v-for="(p, i) in copy.story.paragraphs"
          :key="i"
          data-reveal
          :data-reveal-delay="(i * 0.1).toFixed(1)"
        >
          {{ p }}
        </p>
      </div>
    </section>

    <section class="about__values">
      <SectionHeading :eyebrow="copy.values.eyebrow" :title="copy.values.title" align="center" />
      <blockquote class="about__mission" data-reveal>{{ copy.values.mission }}</blockquote>
      <ul class="about__grid">
        <li
          v-for="(v, i) in copy.values.items"
          :key="v.title"
          class="about__value"
          data-reveal
          :data-reveal-delay="(i * 0.08).toFixed(2)"
        >
          <span class="about__icon"><i :class="v.icon" aria-hidden="true"></i></span>
          <h3>{{ v.title }}</h3>
          <p>{{ v.text }}</p>
        </li>
      </ul>
    </section>

    <section class="about__quality">
      <span class="about__seal" aria-hidden="true"><i class="fa-solid fa-shield-heart"></i></span>
      <SectionHeading
        :eyebrow="copy.quality.eyebrow"
        :title="copy.quality.title"
        :text="copy.quality.text"
        tone="light"
      />
      <RouterLink to="/productos" class="btn btn--primary btn--lg" data-reveal>
        {{ copy.quality.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped lang="scss">
.about {
  overflow-x: clip;
  padding-bottom: $space-section;

  &__hero {
    @include container(1100px);
    @include flex(column, center, flex-start, 1.4rem);
    text-align: center;
    padding-top: 3rem;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    font-size: clamp(2.5rem, 1.4rem + 5vw, 5.4rem);
    font-weight: 800;
    letter-spacing: -0.05em;
    line-height: 0.98;
  }

  &__mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.08em;
  }

  &__title-line {
    display: block;
  }

  &__lead {
    font-size: $text-lg;
    color: $ink-soft;
    max-width: 44rem;
  }

  &__lineup {
    @include flex(row, flex-end, center, clamp(0.5rem, 3vw, 2.5rem));
    width: 100%;
    margin-top: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid $line;

    img {
      width: 22%;
      max-width: 11rem;
      filter: drop-shadow(0 26px 22px rgba($ink, 0.25));
    }

    img:nth-child(n + 3) {
      width: 26%;
      max-width: 14rem;
    }
  }

  &__story {
    @include container(1100px);
    @include flex(column, stretch, flex-start, 2rem);
    padding-block: $space-section 0;

    @include from('lg') {
      flex-direction: row;
      gap: 5rem;

      > * {
        flex: 1 1 0;
      }
    }
  }

  &__story-text {
    @include flex(column, stretch, flex-start, 1.2rem);
    font-size: $text-lg;
    color: $ink-soft;
  }

  &__values {
    @include container(1200px);
    @include flex(column, stretch, flex-start, $space-lg);
    padding-block: $space-section;
  }

  &__mission {
    font-family: $font-display;
    font-size: $display-sm;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.2;
    text-align: center;
    max-width: 30ch;
    margin-inline: auto;
    color: $brand-blue;
  }

  &__grid {
    list-style: none;
    @include flex-cards(220px, 1rem);
  }

  &__value {
    padding: 1.6rem;
    border-radius: $radius-lg;
    background: $surface;
    border: 1px solid $line;

    h3 {
      font-size: $text-lg;
      font-weight: 800;
      margin-bottom: 0.3rem;
    }

    p {
      font-size: $text-sm;
      color: $ink-soft;
    }
  }

  &__icon {
    width: 3rem;
    height: 3rem;
    border-radius: $radius-sm;
    @include flex(row, center, center);
    background: $accent-soft;
    color: $accent-deep;
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  &__quality {
    position: relative;
    overflow: hidden;
    @include flex(column, flex-start, flex-start, 2rem);
    margin-inline: 0.5rem;
    padding: clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 6vw, 5rem);
    border-radius: 36px;
    background: $ink;

    @include from('md') {
      margin-inline: 1rem;
    }
  }

  &__seal {
    position: absolute;
    right: -2rem;
    bottom: -3rem;
    font-size: clamp(10rem, 30vw, 20rem);
    color: rgba($lime, 0.08);
    animation: sway 8s ease-in-out infinite alternate;
  }
}

@keyframes sway {
  to {
    transform: rotate(-10deg) translateY(-1rem);
  }
}
</style>
