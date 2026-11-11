<script setup lang="ts">
import { notFoundCopy as copy } from '@/config/pages.copy'
</script>

<template>
  <section class="not-found">
    <span class="not-found__blob" aria-hidden="true"></span>
    <p class="not-found__code" aria-hidden="true">
      <span>4</span>
      <img src="/img/cutouts/somnycad.png" alt="" class="not-found__zero" />
      <span>4</span>
    </p>
    <h1 class="not-found__title">{{ copy.title }}</h1>
    <p class="not-found__text">{{ copy.text }}</p>
    <div class="not-found__actions">
      <RouterLink to="/" class="btn btn--cream btn--lg">
        <i class="fa-solid fa-house" aria-hidden="true"></i>{{ copy.home }}
      </RouterLink>
      <RouterLink to="/productos" class="btn btn--line btn--lg">
        <i class="fa-solid fa-box-open" aria-hidden="true"></i>{{ copy.shop }}
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  @include container(720px);
  @include flex(column, center, center, 1rem);
  flex: 1;
  text-align: center;
  padding-block: $space-xl $space-section;
  color: $cream;

  &__blob {
    position: absolute;
    z-index: -1;
    width: 24rem;
    height: 24rem;
    border-radius: 50%;
    background: radial-gradient(circle, rgba($cream, 0.1), transparent 70%);
    top: 0;
  }

  &__code {
    @include flex(row, center, center, 0.5rem);
    font-family: $font-display;
    font-size: clamp(6rem, 25vw, 11rem);
    font-weight: 800;
    letter-spacing: -0.06em;
    line-height: 1;
    color: $cream;
  }

  &__zero {
    width: clamp(6rem, 22vw, 10rem);
    filter: drop-shadow(0 18px 18px rgba($forest-deep, 0.5));
    transform: rotate(-8deg);
  }

  &__title {
    @include display($display-md, 800);
  }

  &__text {
    color: $cream-soft;
    max-width: 44ch;
  }

  &__actions {
    @include flex(row, center, center, 0.7rem);
    flex-wrap: wrap;
    margin-top: 0.8rem;
  }
}
</style>
