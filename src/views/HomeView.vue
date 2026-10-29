<script setup lang="ts">
import { computed, nextTick, onMounted, watch } from 'vue'
import { site } from '@/config/site'
import { homeCopy } from '@/config/home.copy'
import { useCatalog } from '@/composables/useCatalog'
import { useReveal } from '@/composables/useReveal'
import { ensureGsap } from '@/composables/useGsap'
import MarqueeStrip from '@/components/common/MarqueeStrip.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeProducts from '@/components/home/HomeProducts.vue'
import HomeStory from '@/components/home/HomeStory.vue'
import HomeNeeds from '@/components/home/HomeNeeds.vue'
import HomeProfessionals from '@/components/home/HomeProfessionals.vue'
import HomeSteps from '@/components/home/HomeSteps.vue'
import HomeFaq from '@/components/home/HomeFaq.vue'
import HomeFinalCta from '@/components/home/HomeFinalCta.vue'

const { products, loading, load } = useCatalog()
const { rescan } = useReveal()
const { ScrollTrigger } = ensureGsap()

const trustItems = site.trust.map((t) => ({ label: t.label, icon: t.icon }))
const ingredientItems = homeCopy.ingredients.map((label) => ({ label }))
const showStory = computed(() => loading.value || products.value.length > 0)

onMounted(load)

// Cuando llega el catálogo cambia el alto de la página: nuevos reveals y
// recálculo de todos los ScrollTrigger de las secciones de abajo.
watch(
  () => products.value.length,
  async () => {
    await nextTick()
    rescan()
    ScrollTrigger.refresh()
  },
)
</script>

<template>
  <div class="home">
    <HomeHero />

    <div class="home__tapes">
      <MarqueeStrip :items="trustItems" tone="ink" :tilt="-1.5" :duration="30" />
      <MarqueeStrip :items="ingredientItems" tone="lime" :tilt="-1.5" reverse :duration="42" />
    </div>

    <HomeProducts :products="products" :loading="loading" />
    <HomeStory v-if="showStory" :products="products" :loading="loading" />
    <HomeNeeds :products="products" />
    <HomeProfessionals />
    <HomeSteps />
    <HomeFaq />
    <HomeFinalCta />
  </div>
</template>

<style scoped lang="scss">
.home {
  overflow-x: clip;

  &__tapes {
    position: relative;
    z-index: 2;
    margin-top: -2.5rem;
    padding-block: 1.5rem;

    > :last-child {
      margin-top: -0.2rem;
    }
  }
}
</style>
