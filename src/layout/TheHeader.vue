<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { layoutCopy } from '@/config/pages.copy'
import { useCartStore } from '@/stores/cart'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useHeaderScroll } from '@/composables/useHeaderScroll'
import BrandLogo from '@/components/brand/BrandLogo.vue'
import MobileMenu from '@/components/common/MobileMenu.vue'

const route = useRoute()
const cart = useCartStore()
const mobileOpen = ref(false)
const { scrolled, hidden } = useHeaderScroll()

useBodyScroll(mobileOpen)
watch(
  () => route.fullPath,
  () => (mobileOpen.value = false),
)

// El home pone su hero debajo del header; el resto de páginas necesita el espacio.
const overHero = computed(() => route.name === 'Home')
const isHidden = computed(() => hidden.value && !mobileOpen.value)
const copy = layoutCopy.header

// /productos/:slug no es hija de /productos en el router: el activo se calcula a mano.
const isActive = (to: string) =>
  to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(`${to}/`)
</script>

<template>
  <header
    class="header"
    :class="{
      'header--solid': scrolled || mobileOpen,
      'header--hidden': isHidden,
    }"
  >
    <div class="header__inner">
      <RouterLink to="/" class="header__logo" :aria-label="copy.home">
        <BrandLogo />
      </RouterLink>

      <nav class="header__nav" aria-label="Principal">
        <RouterLink
          v-for="link in site.nav"
          :key="link.to"
          :to="link.to"
          class="header__link"
          :class="{ 'header__link--active': isActive(link.to) }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <RouterLink to="/productos" class="btn btn--primary header__shop">
          {{ copy.shop }}
        </RouterLink>
        <button
          type="button"
          class="header__icon header__cart"
          :aria-label="`${copy.cart} (${cart.count})`"
          @click="cart.open()"
        >
          <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>
          <span v-if="cart.count" :key="cart.bump" class="header__badge">{{ cart.count }}</span>
        </button>
        <button
          type="button"
          class="header__icon header__burger"
          :class="{ 'header__burger--open': mobileOpen }"
          :aria-label="mobileOpen ? copy.closeMenu : copy.openMenu"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-menu"
          @click="mobileOpen = !mobileOpen"
        >
          <span></span><span></span>
        </button>
      </div>
    </div>
  </header>
  <div v-if="!overHero" class="header-spacer" aria-hidden="true"></div>
  <MobileMenu :open="mobileOpen" @close="mobileOpen = false" />
</template>

<style scoped lang="scss">
$h: 4.5rem;

.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  transition:
    transform 0.5s $ease,
    background-color 0.4s ease,
    box-shadow 0.4s ease;

  &--solid {
    background: rgba(255, 255, 255, 0.78);
    backdrop-filter: saturate(1.6) blur(16px);
    -webkit-backdrop-filter: saturate(1.6) blur(16px);
    box-shadow: 0 1px 0 rgba($ink, 0.06);
  }

  &--hidden {
    transform: translateY(-100%);
  }

  &__inner {
    @include container(1280px);
    @include flex(row, center, space-between, 1rem);
    height: $h;
  }

  &__logo {
    position: relative;
    z-index: 2;
    @include focus-ring;
    border-radius: $radius-sm;
  }

  &__nav {
    display: none;

    @include from('lg') {
      @include flex(row, center, center, 0.3rem);
      padding: 0.3rem;
      border-radius: $radius-pill;
      background: rgba(255, 255, 255, 0.55);
      border: 1px solid rgba($ink, 0.06);
    }
  }

  &__link {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    padding: 0.5rem 1rem;
    border-radius: $radius-pill;
    transition:
      color 0.25s ease,
      background-color 0.25s ease;

    &:hover {
      color: $ink;
      background: rgba($ink, 0.05);
    }

    &--active {
      color: $surface;
      background: $ink;
    }
  }

  &__actions {
    position: relative;
    z-index: 2;
    @include flex(row, center, flex-end, 0.5rem);
  }

  &__shop {
    display: none;
    padding: 0.7rem 1.3rem;

    @include from('md') {
      display: inline-flex;
    }
  }

  &__icon {
    position: relative;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    @include flex(row, center, center);
    background: $surface;
    color: $ink;
    font-size: 1.05rem;
    box-shadow: $shadow-sm;
    transition: transform 0.3s $ease;
    @include focus-ring;

    &:hover {
      transform: translateY(-2px);
    }
  }

  &__badge {
    position: absolute;
    top: -0.2rem;
    right: -0.25rem;
    min-width: 1.3rem;
    height: 1.3rem;
    padding-inline: 0.3rem;
    border-radius: $radius-pill;
    background: $accent;
    color: $surface;
    font-size: 0.7rem;
    font-weight: 800;
    @include flex(row, center, center);
    border: 2px solid $surface;
    animation: badge-pop 0.6s cubic-bezier(0.34, 1.9, 0.64, 1);
  }

  &__burger {
    @include flex(column, center, center, 5px);

    @include from('lg') {
      display: none;
    }

    span {
      width: 1.1rem;
      height: 2px;
      border-radius: 2px;
      background: currentColor;
      transition: transform 0.4s $ease;
    }

    &--open span:first-child {
      transform: translateY(3.5px) rotate(45deg);
    }

    &--open span:last-child {
      transform: translateY(-3.5px) rotate(-45deg);
    }
  }
}

.header-spacer {
  height: $h;
  flex-shrink: 0;
}

@keyframes badge-pop {
  0% {
    transform: scale(0.3);
  }
  60% {
    transform: scale(1.35);
  }
  100% {
    transform: scale(1);
  }
}
</style>
