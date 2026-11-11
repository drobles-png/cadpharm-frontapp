<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { site, whatsappLink } from '@/config/site'
import { professionalsCopy } from '@/config/pages.copy'
import { useCatalog } from '@/composables/useCatalog'
import { useReveal } from '@/composables/useReveal'
import { prefersReducedMotion } from '@/composables/useGsap'
import ProHero from '@/components/professionals/ProHero.vue'
import ProBenefits from '@/components/professionals/ProBenefits.vue'
import ProProductsTable from '@/components/professionals/ProProductsTable.vue'
import LeadForm from '@/components/professionals/LeadForm.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'

const copy = professionalsCopy.form
const route = useRoute()
const { products, loading, load } = useCatalog()
const { rescan } = useReveal()

// Al llegar desde la ficha (/profesionales?producto=x#contacto) el scroll del
// router corre antes de que esta vista exista (transición out-in) y la tabla
// cambia de alto al cargar: se reubica el ancla cuando el contenido ya está.
function scrollToHash() {
  if (!route.hash) return
  const el = document.getElementById(route.hash.slice(1))
  el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

onMounted(async () => {
  await load()
  await nextTick()
  rescan()
  scrollToHash()
})
</script>

<template>
  <div class="pros-page">
    <ProHero />
    <ProBenefits />
    <ProProductsTable :products="products" :loading="loading" />

    <section id="contacto" class="contact">
      <div class="contact__side">
        <SectionHeading :title="copy.title" :text="copy.text" />
        <ul class="contact__list" data-reveal>
          <li>
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
            <a :href="whatsappLink(copy.whatsappMessage)" target="_blank" rel="noopener">
              {{ site.phoneDisplay }}
            </a>
          </li>
          <li>
            <i class="fa-solid fa-envelope" aria-hidden="true"></i>
            <a :href="`mailto:${site.email}`">{{ site.email }}</a>
          </li>
          <li><i class="fa-solid fa-location-dot" aria-hidden="true"></i>{{ site.city }}</li>
        </ul>
      </div>
      <div class="contact__card" data-reveal data-reveal-delay="0.1">
        <LeadForm :products="products" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.pros-page {
  overflow-x: clip;
  padding-bottom: $space-section;
}

#fichas,
#contacto {
  scroll-margin-top: 6rem;
}

.contact {
  position: relative;
  @include flex(column, stretch, flex-start, 2.5rem);
  margin: $space-xl 0.5rem 0;
  padding: clamp(1.75rem, 5vw, 4.5rem) clamp(1rem, 4vw, 4.5rem);
  border-radius: $radius-lg;
  background: $forest-deep;
  border: 1px solid $cream-line;
  // clip y no hidden: hidden rompería el sticky de la columna lateral.
  overflow: clip;

  @include from('md') {
    margin-inline: 1rem;
  }

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;
    gap: 4rem;
  }

  &__side {
    position: relative;
    @include flex(column, flex-start, flex-start, 2rem);

    @include from('lg') {
      flex: 1 1 38%;
      position: sticky;
      top: 6rem;
    }
  }

  &__list {
    list-style: none;
    @include flex(column, flex-start, flex-start, 0.5rem);
    color: $cream-soft;

    li {
      min-height: 2.75rem;
      @include flex(row, center, flex-start, 0.75rem);
    }

    a {
      min-height: 2.75rem;
      @include flex(row, center, flex-start);
      color: $cream;
      text-decoration: underline;
      text-decoration-color: $cream-line;
      text-underline-offset: 0.3em;
      transition: text-decoration-color 0.2s ease-out;

      @media (hover: hover) and (pointer: fine) {
        &:hover {
          text-decoration-color: $cream;
        }
      }
    }

    i {
      flex-shrink: 0;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      @include flex(row, center, center);
      border: 1px solid $cream-line;
      color: $cream;
    }
  }

  // Tarjeta crema: máxima legibilidad para el formulario, que es la conversión.
  &__card {
    position: relative;
    padding: clamp(1.25rem, 3vw, 2.4rem);
    border-radius: $radius-md;
    background: $cream;
    color: $forest;

    @include from('lg') {
      flex: 1 1 62%;
    }

    // El foco global de la web pública es crema: aquí no se vería.
    :deep(:focus-visible) {
      outline-color: $forest;
    }
  }
}
</style>
