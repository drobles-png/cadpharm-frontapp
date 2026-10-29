<script setup lang="ts">
import { site, whatsappLink } from '@/config/site'
import { layoutCopy } from '@/config/pages.copy'
import BrandLogo from '@/components/brand/BrandLogo.vue'
import WhatsAppFab from '@/components/common/WhatsAppFab.vue'

const copy = layoutCopy.footer
const telHref = `tel:+${site.whatsapp}`
</script>

<template>
  <footer class="footer">
    <span class="footer__glow" aria-hidden="true"></span>
    <div class="footer__inner">
      <div class="footer__brand">
        <RouterLink to="/" aria-label="CadPharm, ir al inicio">
          <BrandLogo tone="light" />
        </RouterLink>
        <p class="footer__claim">{{ copy.claim }}</p>
        <a
          v-if="site.whatsapp"
          :href="whatsappLink()"
          class="btn btn--primary"
          target="_blank"
          rel="noopener"
        >
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>WhatsApp
        </a>
      </div>

      <nav class="footer__col" :aria-label="copy.navTitle">
        <h2 class="footer__heading">{{ copy.navTitle }}</h2>
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to">{{
          link.label
        }}</RouterLink>
      </nav>

      <div class="footer__col">
        <h2 class="footer__heading">{{ copy.productsTitle }}</h2>
        <RouterLink v-for="p in copy.products" :key="p.slug" :to="`/productos/${p.slug}`">
          {{ p.label }}
        </RouterLink>
      </div>

      <div class="footer__col">
        <h2 class="footer__heading">{{ copy.contactTitle }}</h2>
        <a :href="telHref"
          ><i class="fa-solid fa-phone" aria-hidden="true"></i>{{ site.phoneDisplay }}</a
        >
        <a :href="`mailto:${site.email}`"
          ><i class="fa-solid fa-envelope" aria-hidden="true"></i>{{ site.email }}</a
        >
        <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i>{{ site.city }}</span>
      </div>
    </div>

    <p class="footer__legal">{{ site.legal.disclaimer }}</p>

    <div class="footer__bar">
      <span>{{ site.legal.copyright }}</span>
      <span class="footer__bar-links">
        <RouterLink to="/login" class="footer__admin">{{ copy.admin }}</RouterLink>
        <span
          >{{ copy.credit }}
          <a href="https://bakano.ec" target="_blank" rel="noopener">Bakano</a></span
        >
      </span>
    </div>

    <p class="footer__giant" aria-hidden="true">CadPharm</p>
  </footer>
  <WhatsAppFab />
</template>

<style scoped lang="scss">
.footer {
  position: relative;
  overflow: hidden;
  background: $ink;
  color: rgba(255, 255, 255, 0.78);
  margin-top: auto;

  &__glow {
    position: absolute;
    width: 36rem;
    height: 36rem;
    top: -18rem;
    right: -10rem;
    border-radius: 50%;
    background: radial-gradient(circle, rgba($accent, 0.35), transparent 65%);
    pointer-events: none;
  }

  &__inner {
    position: relative;
    @include container(1280px);
    @include flex-cards(180px, 2.5rem);
    padding-block: $space-section 2.5rem;
  }

  &__brand {
    flex: 2 1 280px !important;
    @include flex(column, flex-start, flex-start, 1.2rem);
  }

  &__claim {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.25;
    color: $surface;
    max-width: 22ch;
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.7rem);
    font-size: $text-sm;

    a,
    span {
      @include flex(row, center, flex-start, 0.6rem);
      color: rgba(255, 255, 255, 0.75);
      transition: color 0.25s ease;
      overflow-wrap: anywhere;
    }

    a:hover {
      color: $lime;
    }

    i {
      color: $lime;
      width: 1rem;
    }
  }

  &__heading {
    @include eyebrow;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 0.4rem;
  }

  &__legal {
    position: relative;
    @include container(1280px);
    font-size: $text-xs;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.5);
    padding-bottom: 1.8rem;
  }

  &__bar {
    position: relative;
    @include container(1280px);
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    padding-block: 1.3rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: $text-xs;
    color: rgba(255, 255, 255, 0.55);

    a {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        color: $lime;
      }
    }
  }

  &__bar-links {
    @include flex(row, center, flex-start, 1.4rem);
    flex-wrap: wrap;
  }

  &__admin {
    color: rgba(255, 255, 255, 0.4) !important;
  }

  &__giant {
    font-family: $font-display;
    font-weight: 800;
    font-size: clamp(4.5rem, 21vw, 19rem);
    letter-spacing: -0.06em;
    line-height: 0.78;
    text-align: center;
    color: rgba(255, 255, 255, 0.05);
    user-select: none;
    margin-bottom: -0.08em;
  }
}
</style>
