<script setup lang="ts">
import { adminBrand, loginCopy as copy } from '@/config/admin.copy'
</script>

<template>
  <aside class="brand">
    <span class="brand__blob brand__blob--a" aria-hidden="true"></span>
    <span class="brand__blob brand__blob--b" aria-hidden="true"></span>
    <span class="brand__blob brand__blob--c" aria-hidden="true"></span>

    <RouterLink to="/" class="brand__logo">
      <span class="brand__mark"><i class="fa-solid fa-leaf"></i></span>
      <span>
        <strong>{{ adminBrand.name }}</strong> {{ adminBrand.accent }}
        <em>· {{ adminBrand.panel }}</em>
      </span>
    </RouterLink>

    <div class="brand__body">
      <h2 class="brand__title">{{ copy.brandTitle }}</h2>
      <p class="brand__text">{{ copy.brandText }}</p>
      <ul class="brand__points">
        <li v-for="(p, i) in copy.brandPoints" :key="p.label" :style="{ '--i': i }">
          <i :class="p.icon"></i> {{ p.label }}
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.brand {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  @include flex(column, flex-start, space-between, $space-lg);
  padding: 1.6rem 1.25rem 2.2rem;
  color: $surface;
  background: linear-gradient(150deg, $ink 0%, $brand-blue-deep 48%, $accent-deep 100%);

  @include from('lg') {
    padding: 2.6rem 3rem;
    min-height: 100vh;
  }

  &__blob {
    position: absolute;
    z-index: -1;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.55;
    animation: blob-drift 16s ease-in-out infinite alternate;

    &--a {
      width: 340px;
      height: 340px;
      background: $accent;
      top: -90px;
      right: -80px;
    }

    &--b {
      width: 280px;
      height: 280px;
      background: $brand-blue;
      bottom: -60px;
      left: -70px;
      animation-duration: 20s;
      animation-delay: -6s;
    }

    &--c {
      width: 180px;
      height: 180px;
      background: $lime;
      opacity: 0.3;
      top: 45%;
      left: 55%;
      animation-duration: 13s;
      animation-delay: -3s;
    }
  }

  &__logo {
    @include flex(row, center, flex-start, 0.65rem);
    font-family: $font-display;
    font-size: 1.05rem;

    strong {
      font-weight: 800;
    }

    em {
      font-style: normal;
      color: $lime;
      font-weight: 600;
    }
  }

  &__mark {
    @include flex(row, center, center);
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.14);
    color: $lime;
    backdrop-filter: blur(6px);
  }

  &__body {
    max-width: 30rem;
    animation: brand-in 0.9s $ease both;
  }

  &__title {
    @include display($display-sm, 700);

    @include from('lg') {
      font-size: $display-md;
    }
  }

  &__text {
    margin-top: 0.9rem;
    color: rgba(255, 255, 255, 0.78);
    font-size: $text-base;
  }

  &__points {
    display: none;
    list-style: none;
    margin-top: $space-md;

    @include from('lg') {
      @include flex(column, flex-start, flex-start, 0.75rem);
    }

    li {
      @include flex(row, center, flex-start, 0.7rem);
      font-weight: 600;
      animation: brand-in 0.7s $ease both;
      animation-delay: calc(0.3s + var(--i) * 0.12s);

      i {
        @include flex(row, center, center);
        width: 34px;
        height: 34px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.12);
        color: $lime;
        font-size: 0.85rem;
      }
    }
  }
}

@keyframes blob-drift {
  to {
    transform: translate(-40px, 50px) scale(1.15);
  }
}

@keyframes brand-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}
</style>
