<script setup lang="ts">
import { whatsappLink } from '@/config/site'
import { homeCopy } from '@/config/home.copy'
import MagneticButton from '@/components/common/MagneticButton.vue'

const copy = homeCopy.finalCta
</script>

<template>
  <section class="final">
    <div class="final__box">
      <span class="final__orb final__orb--a" aria-hidden="true"></span>
      <span class="final__orb final__orb--b" aria-hidden="true"></span>
      <h2 class="final__title" data-reveal>{{ copy.title }}</h2>
      <p class="final__text" data-reveal data-reveal-delay="0.1">{{ copy.text }}</p>
      <div class="final__actions" data-reveal data-reveal-delay="0.2">
        <MagneticButton>
          <a :href="whatsappLink()" class="btn btn--lg final__wa" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>{{ copy.whatsapp }}
          </a>
        </MagneticButton>
        <MagneticButton :strength="0.2">
          <RouterLink to="/productos" class="btn btn--light btn--lg">
            {{ copy.shop }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
        </MagneticButton>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.final {
  @include container(1280px);
  padding-block: 0 $space-section;

  &__box {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    @include flex(column, center, center, 1.3rem);
    text-align: center;
    padding: clamp(3.5rem, 8vw, 7rem) 1.5rem;
    border-radius: 36px;
    color: $surface;
    background: linear-gradient(125deg, $accent 0%, #0f8a6a 40%, $brand-blue 100%);
    background-size: 200% 200%;
    animation: shift 14s ease-in-out infinite alternate;
  }

  &__orb {
    position: absolute;
    z-index: -1;
    border-radius: 50%;
    filter: blur(50px);

    &--a {
      width: 22rem;
      height: 22rem;
      background: rgba($lime, 0.55);
      top: -8rem;
      left: -6rem;
      animation: orb 10s ease-in-out infinite alternate;
    }

    &--b {
      width: 26rem;
      height: 26rem;
      background: rgba($brand-blue-deep, 0.7);
      bottom: -12rem;
      right: -8rem;
      animation: orb 13s ease-in-out infinite alternate-reverse;
    }
  }

  &__title {
    font-size: clamp(2.3rem, 1.4rem + 4.5vw, 4.8rem);
    font-weight: 800;
    letter-spacing: -0.05em;
    line-height: 0.98;
    max-width: 16ch;
  }

  &__text {
    font-size: $text-lg;
    color: rgba(255, 255, 255, 0.88);
    max-width: 38rem;
  }

  &__actions {
    @include flex(row, center, center, 0.8rem);
    flex-wrap: wrap;
    margin-top: 0.8rem;
  }

  &__wa {
    white-space: nowrap;
    padding-inline: 1.5rem;
    background: #25d366;
    color: $ink;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
    }
  }
}

@keyframes shift {
  to {
    background-position: 100% 100%;
  }
}

@keyframes orb {
  to {
    transform: translate(6rem, 4rem) scale(1.2);
  }
}
</style>
