<script setup lang="ts">
import { site, whatsappLink } from '@/config/site'
import { layoutCopy } from '@/config/pages.copy'

/** Menú móvil a pantalla completa; los links entran escalonados. */
defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()
</script>

<template>
  <Transition name="menu">
    <div v-if="open" id="mobile-menu" class="menu" role="dialog" aria-modal="true">
      <span class="menu__blob menu__blob--a" aria-hidden="true"></span>
      <span class="menu__blob menu__blob--b" aria-hidden="true"></span>
      <nav class="menu__nav">
        <RouterLink
          v-for="(link, i) in site.nav"
          :key="link.to"
          :to="link.to"
          class="menu__link"
          :style="{ '--i': i }"
          @click="$emit('close')"
        >
          <span class="menu__index">0{{ i + 1 }}</span
          >{{ link.label }}
        </RouterLink>
      </nav>
      <div class="menu__foot" :style="{ '--i': site.nav.length }">
        <RouterLink
          to="/productos"
          class="btn btn--primary btn--lg btn--block"
          @click="$emit('close')"
        >
          <i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>{{ layoutCopy.header.shop }}
        </RouterLink>
        <a :href="whatsappLink()" class="menu__wa" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>{{ layoutCopy.header.menuNote }}
        </a>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.menu {
  position: fixed;
  inset: 0;
  z-index: 95;
  background: $paper;
  padding: 6.5rem 1.5rem calc(2rem + env(safe-area-inset-bottom));
  @include flex(column, stretch, space-between, 2rem);
  overflow: hidden;

  &__blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.45;
    pointer-events: none;

    &--a {
      width: 18rem;
      height: 18rem;
      background: $lime;
      top: -4rem;
      right: -6rem;
    }

    &--b {
      width: 16rem;
      height: 16rem;
      background: $brand-blue;
      bottom: 4rem;
      left: -8rem;
      opacity: 0.25;
    }
  }

  &__nav {
    position: relative;
    @include flex(column, stretch, flex-start, 0.2rem);
  }

  &__link,
  &__foot {
    opacity: 0;
    transform: translateY(30px);
    transition:
      opacity 0.5s ease,
      transform 0.6s $ease;
    transition-delay: calc(0.08s + var(--i) * 0.07s);
  }

  &__link {
    @include flex(row, baseline, flex-start, 0.9rem);
    font-family: $font-display;
    font-size: clamp(2.2rem, 10vw, 3.2rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    color: $ink;
    padding-block: 0.35rem;
    border-bottom: 1px solid $line;

    &.router-link-exact-active {
      color: $accent;
    }
  }

  &__index {
    font-family: $font-principal;
    font-size: $text-xs;
    font-weight: 700;
    color: $ink-muted;
    letter-spacing: 0.1em;
  }

  &__foot {
    position: relative;
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__wa {
    @include flex(row, center, center, 0.5rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;

    i {
      color: #25d366;
      font-size: 1.2rem;
    }
  }
}

.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.35s ease,
    clip-path 0.55s $ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  clip-path: circle(0% at calc(100% - 2.5rem) 2.2rem);
}

.menu-enter-to,
.menu-leave-from {
  clip-path: circle(150% at calc(100% - 2.5rem) 2.2rem);
}

// Los hijos arrancan ocultos (estilo base) y entran cuando el panel deja enter-from.
.menu:not(.menu-enter-from) .menu__link,
.menu:not(.menu-enter-from) .menu__foot {
  opacity: 1;
  transform: none;
}

.menu-leave-active .menu__link,
.menu-leave-active .menu__foot {
  transition-delay: 0s;
}
</style>
