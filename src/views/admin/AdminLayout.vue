<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import { useAdminBadges } from '@/composables/useAdminBadges'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { adminBrand, navCopy as copy } from '@/config/admin.copy'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()
const { pendingOrders, newLeads, refreshBadges } = useAdminBadges()

const drawer = ref(false)
useBodyScroll(drawer)
watch(() => route.fullPath, () => (drawer.value = false))

const userName = computed(() => userStore.user?.name || '')
const userEmail = computed(() => userStore.user?.email || '')
const greeting = computed(() => copy.greeting(userName.value, new Date().getHours()))
const today = new Intl.DateTimeFormat('es-EC', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date())
const alerts = computed(() => pendingOrders.value + newLeads.value)

function logout() {
  userStore.clear()
  toast.info(copy.loggedOut)
  router.replace({ name: 'Login' })
}

onMounted(refreshBadges)
</script>

<template>
  <div class="admin">
    <aside class="admin__sidebar">
      <AdminSidebar :user-name="userName" :user-email="userEmail" @logout="logout" />
    </aside>

    <header class="admin__topbar">
      <button class="admin__menu" type="button" :aria-label="copy.menu" @click="drawer = true">
        <i class="fa-solid fa-bars"></i>
        <span v-if="alerts > 0" class="admin__dot"></span>
      </button>
      <RouterLink to="/admin" class="admin__brand">
        <strong>{{ adminBrand.name }}</strong> {{ adminBrand.panel }}
      </RouterLink>
      <a href="/" target="_blank" rel="noopener" class="admin__store" :aria-label="copy.store">
        <i class="fa-solid fa-store"></i>
      </a>
    </header>

    <Transition name="fade">
      <div v-if="drawer" class="admin__overlay" @click="drawer = false"></div>
    </Transition>
    <Transition name="drawer">
      <aside v-if="drawer" class="admin__drawer">
        <button class="admin__close" type="button" :aria-label="copy.close" @click="drawer = false">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <AdminSidebar
          :user-name="userName"
          :user-email="userEmail"
          @navigate="drawer = false"
          @logout="logout"
        />
      </aside>
    </Transition>

    <div class="admin__main">
      <div class="admin__hello">
        <p class="admin__greeting">{{ greeting }}</p>
        <p class="admin__date">{{ today }}</p>
      </div>
      <RouterView v-slot="{ Component, route: r }">
        <Transition name="admin-page" mode="out-in">
          <component :is="Component" :key="r.path" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped lang="scss">
$sidebar-w: 264px;

.admin {
  min-height: 100vh;
  background: $paper;

  &__sidebar {
    display: none;

    @include from('lg') {
      display: block;
      position: fixed;
      inset: 0 auto 0 0;
      width: $sidebar-w;
      z-index: 50;
    }
  }

  &__topbar {
    position: sticky;
    top: 0;
    z-index: 60;
    @include flex(row, center, space-between, 0.75rem);
    padding: 0.7rem 1rem;
    padding-top: max(0.7rem, env(safe-area-inset-top));
    background: rgba($ink, 0.96);
    backdrop-filter: blur(10px);
    color: $surface;

    @include from('lg') {
      display: none;
    }
  }

  &__menu,
  &__store,
  &__close {
    position: relative;
    @include flex(row, center, center);
    width: 42px;
    height: 42px;
    border-radius: 12px;
    color: $surface;
    background: rgba(255, 255, 255, 0.08);
  }

  &__dot {
    position: absolute;
    top: 9px;
    right: 9px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: $lime;
    box-shadow: 0 0 0 2px $ink;
  }

  &__brand {
    font-family: $font-display;
    font-size: 1.05rem;

    strong {
      font-weight: 800;
      color: $lime;
    }
  }

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 90;
    background: $overlay;
  }

  &__drawer {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 100;
    width: min(300px, 86vw);
    box-shadow: $shadow-lg;
  }

  &__close {
    position: absolute;
    top: 1.3rem;
    right: 0.8rem;
    z-index: 1;
  }

  &__main {
    padding: 1.25rem 1rem 6rem;

    @include from('md') {
      padding: 1.75rem 2rem 6rem;
    }

    @include from('lg') {
      margin-left: $sidebar-w;
      padding: 2rem 2.5rem 6rem;
    }

    > :deep(*:not(.admin__hello)) {
      max-width: 1240px;
    }
  }

  &__hello {
    @include flex(row, baseline, space-between, 0.6rem);
    flex-wrap: wrap;
    max-width: 1240px;
    margin-bottom: 1.1rem;
    animation: hello-in 0.6s $ease both;
  }

  &__greeting {
    font-weight: 700;
    color: $accent-deep;
    font-size: $text-sm;
  }

  &__date {
    font-size: $text-xs;
    color: $ink-muted;
    text-transform: capitalize;
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.4s $ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}

.admin-page-enter-active {
  transition:
    opacity 0.35s $ease,
    transform 0.35s $ease;
}

.admin-page-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.admin-page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.admin-page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@keyframes hello-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}
</style>
