<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from '@/layout/TheHeader.vue'
import TheFooter from '@/layout/TheFooter.vue'
import ToastList from '@/components/ui/ToastList.vue'

const route = useRoute()
// El panel trae su propio layout; el login va a pantalla completa.
const layout = computed(() => route.meta.layout ?? 'public')
</script>

<template>
  <div class="app" :class="`app--${layout}`">
    <TheHeader v-if="layout === 'public'" />
    <main class="app__main">
      <RouterView v-slot="{ Component, route: r }">
        <Transition name="page" mode="out-in">
          <!-- La key por ruta raíz evita re-animar el layout del admin al cambiar de hija -->
          <component :is="Component" :key="r.matched[0]?.path" />
        </Transition>
      </RouterView>
    </main>
    <TheFooter v-if="layout === 'public'" />
    <ToastList />
  </div>
</template>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
