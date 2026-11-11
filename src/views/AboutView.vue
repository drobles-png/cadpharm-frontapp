<script setup lang="ts">
import { historyCopy as copy } from '@/config/info.copy'
import { useReveal } from '@/composables/useReveal'
import BrandMarquee from '@/components/common/BrandMarquee.vue'

useReveal()
const [primary, secondary, wide] = copy.photos
</script>

<template>
  <div class="about">
    <section class="about__intro">
      <span class="eyebrow-cream">{{ copy.intro.eyebrow }}</span>
      <h1 class="about__title">{{ copy.intro.title }}</h1>
      <p class="about__lead">{{ copy.intro.text }}</p>
    </section>

    <section class="about__photos" :aria-label="copy.photosLabel">
      <figure v-if="primary" class="about__photo about__photo--primary" data-reveal>
        <img :src="primary.image" :alt="primary.alt" width="1400" height="933" />
        <figcaption>{{ primary.caption }}</figcaption>
      </figure>
      <figure v-if="secondary" class="about__photo" data-reveal data-reveal-delay="0.08">
        <img :src="secondary.image" :alt="secondary.alt" width="1400" height="933" loading="lazy" />
        <figcaption>{{ secondary.caption }}</figcaption>
      </figure>
      <figure v-if="wide" class="about__photo about__photo--wide" data-reveal>
        <img :src="wide.image" :alt="wide.alt" width="1400" height="933" loading="lazy" />
        <figcaption>{{ wide.caption }}</figcaption>
      </figure>
    </section>

    <section class="about__timeline">
      <article
        v-for="(stage, i) in copy.stages"
        :key="stage.title"
        class="about__stage"
        data-reveal
        :data-reveal-delay="(i * 0.06).toFixed(2)"
      >
        <span class="about__number">{{ String(i + 1).padStart(2, '0') }}</span>
        <div>
          <span class="about__period">{{ stage.period }}</span>
          <h2>{{ stage.title }}</h2>
          <p>{{ stage.text }}</p>
        </div>
      </article>
    </section>

    <section class="about__commitment">
      <div class="about__commitment-copy" data-reveal>
        <span class="eyebrow-cream">{{ copy.commitment.eyebrow }}</span>
        <h2>{{ copy.commitment.title }}</h2>
        <p>{{ copy.commitment.text }}</p>
      </div>
      <ol class="about__values">
        <li
          v-for="(value, i) in copy.commitment.values"
          :key="value"
          data-reveal
          :data-reveal-delay="(i * 0.06).toFixed(2)"
        >
          <span>{{ String(i + 1).padStart(2, '0') }}</span
          ><strong>{{ value }}</strong>
        </li>
      </ol>
    </section>

    <BrandMarquee />

    <section class="about__quality" data-reveal>
      <i class="fa-solid fa-shield-heart" aria-hidden="true"></i>
      <h2>{{ copy.quality.title }}</h2>
      <p>{{ copy.quality.text }}</p>
      <RouterLink to="/productos" class="btn btn--cream btn--lg">{{ copy.quality.cta }}</RouterLink>
    </section>
  </div>
</template>

<style scoped lang="scss">
.about {
  color: $cream;
  overflow-x: clip;

  &__intro {
    @include container(1280px);
    @include flex(column, flex-start, flex-start, 1.1rem);
    padding-block: 3.5rem 2.5rem;

    @include from('md') {
      padding-block: 5.5rem 3.5rem;
    }
  }

  &__title {
    @include display($display-lg, 700);
    max-width: 16ch;
  }

  &__lead {
    font-size: $text-lg;
    line-height: 1.6;
    color: $cream-soft;
    max-width: 44rem;
  }

  // Collage: dos fotos lado a lado y una ancha debajo (flex, sin grid).
  &__photos {
    @include container(1280px);
    @include flex(row, stretch, flex-start, 1rem);
    flex-wrap: wrap;
  }

  &__photo {
    position: relative;
    flex: 1 1 100%;
    border-radius: $radius-md;
    overflow: hidden;
    background: $forest-deep;

    @include from('md') {
      flex: 1 1 calc(50% - 0.5rem);
    }

    img {
      width: 100%;
      height: 100%;
      aspect-ratio: 3 / 2;
      object-fit: cover;
    }

    figcaption {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 2.5rem 1.1rem 1rem;
      font-size: $text-sm;
      font-weight: 600;
      color: $cream;
      background: linear-gradient(0deg, rgba($forest-deep, 0.85), transparent);
    }

    &--wide {
      @include from('md') {
        flex-basis: 100%;

        img {
          aspect-ratio: 21 / 8;
        }
      }
    }
  }

  &__timeline {
    @include container(1280px);
    @include flex(column, stretch, flex-start, 0);
    padding-block: $space-xl;

    @include from('lg') {
      flex-direction: row;
      gap: 2.5rem;
    }
  }

  &__stage {
    flex: 1;
    @include flex(row, flex-start, flex-start, 1.25rem);
    padding-block: 1.75rem;
    border-top: 1px solid $cream-line;

    h2 {
      font-size: $text-xl;
      font-weight: 800;
      margin-block: 0.35rem 0.6rem;
    }

    p {
      font-size: $text-sm;
      line-height: 1.7;
      color: $cream-soft;
    }
  }

  &__number {
    flex-shrink: 0;
    font-family: $font-display;
    font-size: $display-sm;
    font-weight: 800;
    line-height: 1;
    color: $cream-muted;
  }

  &__period {
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: $cream-muted;
  }

  &__commitment {
    @include container(1280px);
    @include flex(column, stretch, flex-start, 2rem);
    padding-bottom: $space-xl;

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 4rem;
    }
  }

  &__commitment-copy {
    @include flex(column, flex-start, flex-start, 0.9rem);
    max-width: 36rem;

    h2 {
      @include display($display-md, 700);
    }

    p {
      color: $cream-soft;
    }
  }

  &__values {
    list-style: none;
    @include flex(column, stretch, flex-start, 0);
    flex: 0 1 26rem;

    li {
      @include flex(row, baseline, flex-start, 1.25rem);
      padding-block: 1.1rem;
      border-bottom: 1px solid $cream-line;
    }

    span {
      font-size: $text-xs;
      font-weight: 800;
      letter-spacing: 0.14em;
      color: $cream-muted;
    }

    strong {
      font-family: $font-display;
      font-size: $text-xl;
      font-weight: 700;
    }
  }

  &__quality {
    @include container(760px);
    @include flex(column, center, center, 1rem);
    text-align: center;
    padding-block: $space-section;

    > i {
      font-size: 2rem;
      color: $cream-soft;
    }

    h2 {
      @include display($display-sm, 700);
    }

    p {
      color: $cream-soft;
      margin-bottom: 0.75rem;
    }
  }
}
</style>
