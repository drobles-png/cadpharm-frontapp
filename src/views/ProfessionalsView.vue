<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { professionalsCopy } from '@/config/pages.copy'
import { useCatalog } from '@/composables/useCatalog'
import { useReveal } from '@/composables/useReveal'
import ProHero from '@/components/professionals/ProHero.vue'
import ProBenefits from '@/components/professionals/ProBenefits.vue'
import ProProductsTable from '@/components/professionals/ProProductsTable.vue'
import LeadForm from '@/components/professionals/LeadForm.vue'
import SectionHeading from '@/components/common/SectionHeading.vue'

const copy = professionalsCopy.form
const { products, loading, load } = useCatalog()
const { rescan } = useReveal()

onMounted(async () => {
  await load()
  await nextTick()
  rescan()
})
</script>

<template>
  <div class="pros-page">
    <ProHero />
    <ProBenefits />
    <ProProductsTable :products="products" :loading="loading" />

    <section id="contacto" class="contact">
      <div class="contact__side">
        <SectionHeading
          :eyebrow="copy.eyebrow"
          :title="copy.title"
          :text="copy.text"
          tone="light"
        />
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
  padding: clamp(2rem, 5vw, 4.5rem) clamp(1.25rem, 4vw, 4.5rem);
  border-radius: 36px;
  background: $ink;
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

  &::before {
    content: '';
    position: absolute;
    width: 36rem;
    height: 36rem;
    left: -14rem;
    bottom: -18rem;
    border-radius: 50%;
    background: radial-gradient(circle, rgba($accent, 0.4), transparent 65%);
    pointer-events: none;
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
    @include flex(column, flex-start, flex-start, 0.9rem);
    color: rgba(255, 255, 255, 0.85);

    li {
      @include flex(row, center, flex-start, 0.75rem);
    }

    i {
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 50%;
      @include flex(row, center, center);
      background: rgba(255, 255, 255, 0.08);
      color: $lime;
    }

    a:hover {
      color: $lime;
    }
  }

  &__card {
    position: relative;
    padding: clamp(1.4rem, 3vw, 2.4rem);
    border-radius: $radius-lg;
    background: $paper;

    @include from('lg') {
      flex: 1 1 62%;
    }
  }
}
</style>
