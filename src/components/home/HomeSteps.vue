<script setup lang="ts">
import { ref } from 'vue'
import { gsap } from 'gsap'
import { homeCopy } from '@/config/home.copy'
import { useGsap } from '@/composables/useGsap'
import SectionHeading from '@/components/common/SectionHeading.vue'

const copy = homeCopy.steps
const root = ref<HTMLElement | null>(null)

// La línea se dibuja con el scroll y cada paso "se enciende" cuando la línea llega.
useGsap(root, () => {
  const mm = gsap.matchMedia()
  mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (ctx) => {
    const desktop = ctx.conditions?.desktop
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.steps__track', start: 'top 75%', end: 'bottom 55%', scrub: 0.6 },
    })
    tl.fromTo('.steps__line-fill', desktop ? { scaleX: 0 } : { scaleY: 0 }, {
      scaleX: 1,
      scaleY: 1,
      ease: 'none',
      duration: 1,
    })
    gsap.utils.toArray<HTMLElement>('.step__badge').forEach((badge, i, all) => {
      tl.fromTo(
        badge,
        { scale: 0.6, backgroundColor: '#ffffff', color: '#0b1b2e' },
        {
          scale: 1,
          backgroundColor: '#17a34a',
          color: '#ffffff',
          duration: 0.15,
          ease: 'back.out(3)',
        },
        (i / Math.max(all.length - 1, 1)) * 0.9,
      )
    })
  })
})
</script>

<template>
  <section ref="root" class="steps">
    <SectionHeading :eyebrow="copy.eyebrow" :title="copy.title" align="center" />

    <div class="steps__track">
      <span class="steps__line" aria-hidden="true"><span class="steps__line-fill"></span></span>
      <ol class="steps__list">
        <li
          v-for="(step, i) in copy.items"
          :key="step.title"
          class="step"
          data-reveal
          :data-reveal-delay="(i * 0.1).toFixed(2)"
        >
          <span class="step__badge"><i :class="step.icon" aria-hidden="true"></i></span>
          <span class="step__num">Paso {{ i + 1 }}</span>
          <h3 class="step__title">{{ step.title }}</h3>
          <p class="step__text">{{ step.text }}</p>
        </li>
      </ol>
    </div>

    <div class="steps__cta" data-reveal>
      <RouterLink to="/productos" class="btn btn--dark btn--lg">
        {{ copy.cta }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
$badge: 4.5rem;

.steps {
  @include container(1100px);
  padding-block: $space-section;
  @include flex(column, stretch, flex-start, $space-xl);

  &__track {
    position: relative;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 2.5rem);

    @include from('md') {
      flex-direction: row;
      gap: 2rem;
    }
  }

  &__line {
    position: absolute;
    left: calc($badge / 2 - 1.5px);
    top: calc($badge / 2);
    bottom: 3rem;
    width: 3px;
    border-radius: 3px;
    background: $line;

    @include from('md') {
      left: calc(100% / 6);
      right: calc(100% / 6);
      top: calc($badge / 2 - 1.5px);
      bottom: auto;
      width: auto;
      height: 3px;
    }
  }

  &__line-fill {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: $accent;
    transform-origin: top left;
  }

  &__cta {
    @include flex(row, center, center);
  }
}

.step {
  position: relative;
  @include flex(column, flex-start, flex-start, 0.4rem);
  padding-left: calc($badge + 1.25rem);

  @include from('md') {
    flex: 1 1 0;
    align-items: center;
    text-align: center;
    padding-left: 0;
  }

  &__badge {
    position: absolute;
    left: 0;
    top: 0;
    width: $badge;
    height: $badge;
    border-radius: 50%;
    @include flex(row, center, center);
    font-size: 1.5rem;
    background: $accent;
    color: $surface;
    box-shadow:
      0 0 0 8px $paper,
      $shadow-md;

    @include from('md') {
      position: relative;
      margin-bottom: 1rem;
    }
  }

  &__num {
    @include eyebrow;
  }

  &__title {
    font-size: $text-xl;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  &__text {
    color: $ink-soft;
    font-size: $text-sm;
    max-width: 26ch;
  }
}
</style>
