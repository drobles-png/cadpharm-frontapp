<script setup lang="ts">
import { useRoute } from 'vue-router'
import { adminBrand, navCopy as copy } from '@/config/admin.copy'
import { useAdminBadges } from '@/composables/useAdminBadges'

defineProps<{ userName: string; userEmail: string }>()
const emit = defineEmits<{ navigate: []; logout: [] }>()

const route = useRoute()
const { pendingOrders, newLeads } = useAdminBadges()

function badgeFor(key: string) {
  if (key === 'orders') return pendingOrders.value
  if (key === 'leads') return newLeads.value
  return 0
}

/** "Panel" solo se marca en /admin exacto; el resto, en toda su sección. */
function isActive(to: string) {
  return to === '/admin' ? route.path === '/admin' : route.path.startsWith(to)
}
</script>

<template>
  <nav class="side" aria-label="Panel">
    <RouterLink to="/admin" class="side__logo" @click="emit('navigate')">
      <span class="side__mark"><i class="fa-solid fa-leaf"></i></span>
      <span class="side__name">
        <strong>{{ adminBrand.name }}</strong>
        <small>{{ adminBrand.accent }} · {{ adminBrand.panel }}</small>
      </span>
    </RouterLink>

    <ul class="side__list">
      <li v-for="item in copy.items" :key="item.to">
        <RouterLink
          :to="item.to"
          class="side__link"
          :class="{ 'side__link--active': isActive(item.to) }"
          @click="emit('navigate')"
        >
          <i :class="item.icon" class="side__icon"></i>
          <span>{{ item.label }}</span>
          <Transition name="badge">
            <span v-if="badgeFor(item.badge) > 0" class="side__badge">
              {{ badgeFor(item.badge) }}
            </span>
          </Transition>
        </RouterLink>
      </li>
    </ul>

    <div class="side__bottom">
      <a href="/" target="_blank" rel="noopener" class="side__link side__link--soft">
        <i class="fa-solid fa-arrow-up-right-from-square side__icon"></i>
        <span>{{ copy.store }}</span>
      </a>
      <div class="side__user">
        <span class="side__avatar">{{ (userName || userEmail || 'A').charAt(0).toUpperCase() }}</span>
        <span class="side__who">
          <strong>{{ userName || copy.adminFallback }}</strong>
          <small>{{ userEmail }}</small>
        </span>
        <button class="side__logout" type="button" :aria-label="copy.logout" :title="copy.logout" @click="emit('logout')">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.side {
  @include flex(column, stretch, flex-start, 1.5rem);
  height: 100%;
  padding: 1.4rem 1rem;
  background: $ink;
  color: rgba(255, 255, 255, 0.72);

  &__logo {
    @include flex(row, center, flex-start, 0.7rem);
    padding: 0.2rem 0.5rem 0.6rem;
    color: $surface;
  }

  &__mark {
    @include flex(row, center, center);
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: linear-gradient(140deg, $accent, $brand-blue);
    color: $surface;
  }

  &__name {
    @include flex(column, flex-start, flex-start);
    line-height: 1.2;

    strong {
      font-family: $font-display;
      font-size: 1.1rem;
      font-weight: 800;
    }

    small {
      font-size: 0.72rem;
      color: rgba(255, 255, 255, 0.5);
    }
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.25rem);
  }

  &__link {
    position: relative;
    @include flex(row, center, flex-start, 0.8rem);
    padding: 0.75rem 0.85rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.95rem;
    transition:
      background-color 0.25s ease,
      color 0.25s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: $surface;
    }

    &::before {
      content: '';
      position: absolute;
      left: -1rem;
      top: 50%;
      width: 4px;
      height: 0;
      border-radius: 0 4px 4px 0;
      background: $lime;
      transform: translateY(-50%);
      transition: height 0.35s $ease;
    }

    &--active {
      background: rgba(255, 255, 255, 0.1);
      color: $surface;

      &::before {
        height: 60%;
      }

      .side__icon {
        color: $lime;
      }
    }

    &--soft {
      font-size: $text-sm;
    }
  }

  &__icon {
    width: 20px;
    text-align: center;
    transition: color 0.25s ease;
  }

  &__badge {
    margin-left: auto;
    min-width: 1.5rem;
    padding: 0.1rem 0.45rem;
    border-radius: $radius-pill;
    background: $lime;
    color: $ink;
    font-size: 0.72rem;
    font-weight: 800;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  &__bottom {
    margin-top: auto;
    @include flex(column, stretch, flex-start, 0.6rem);
  }

  &__user {
    @include flex(row, center, flex-start, 0.65rem);
    padding: 0.7rem;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.05);
  }

  &__avatar {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: $accent;
    color: $surface;
    font-weight: 800;
  }

  &__who {
    @include flex(column, flex-start, flex-start);
    min-width: 0;
    line-height: 1.25;

    strong {
      color: $surface;
      font-size: $text-sm;
    }

    small {
      font-size: 0.72rem;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  &__logout {
    margin-left: auto;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.6);
    transition: background-color 0.2s ease, color 0.2s ease;

    &:hover {
      background: rgba($danger, 0.2);
      color: $surface;
    }
  }
}

.badge-enter-active,
.badge-leave-active {
  transition: transform 0.35s $ease, opacity 0.25s ease;
}

.badge-enter-from,
.badge-leave-to {
  transform: scale(0.4);
  opacity: 0;
}
</style>
