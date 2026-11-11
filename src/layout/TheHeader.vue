<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { layoutCopy } from '@/config/pages.copy'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { useHeaderScroll } from '@/composables/useHeaderScroll'
import BrandLogo from '@/components/brand/BrandLogo.vue'
import MobileMenu from '@/components/common/MobileMenu.vue'

const route = useRoute()
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
        <BrandLogo tone="light" />
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
        <RouterLink to="/profesionales#contacto" class="btn btn--cream header__shop">
          {{ copy.contact }}
        </RouterLink>
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
    background: rgba($forest, 0.88);
    backdrop-filter: saturate(1.4) blur(16px);
    -webkit-backdrop-filter: saturate(1.4) blur(16px);
    box-shadow: 0 1px 0 $cream-line;
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
      background: rgba($forest-deep, 0.35);
      border: 1px solid $cream-line;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
  }

  &__link {
    font-size: $text-sm;
    font-weight: 600;
    color: $cream-soft;
    padding: 0.5rem 1rem;
    border-radius: $radius-pill;
    transition:
      color 0.25s ease,
      background-color 0.25s ease;

    &:hover {
      color: $cream;
      background: rgba($cream, 0.08);
    }

    &--active,
    &--active:hover {
      color: $forest;
      background: $cream;
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
    background: $forest;
    border: 1px solid rgba($cream, 0.3);
    box-shadow: 0 4px 14px rgba($forest-deep, 0.35);
    color: $cream;
    font-size: 1.05rem;
    transition: transform 0.3s $ease;
    @include focus-ring;

    &:hover {
      transform: translateY(-2px);
    }
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
</style>
