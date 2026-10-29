<script setup lang="ts">
import { productFormCopy as copy } from '@/config/admin.copy'

defineProps<{ dirty: boolean; saving: boolean; isNew: boolean }>()
const emit = defineEmits<{ save: []; remove: [] }>()
</script>

<template>
  <div class="savebar" :class="{ 'savebar--dirty': dirty }">
    <p class="savebar__state">
      <span class="savebar__dot"></span>
      <Transition name="fade" mode="out-in">
        <span :key="String(dirty)">{{ dirty ? copy.dirty : copy.clean }}</span>
      </Transition>
    </p>
    <div class="savebar__actions">
      <button v-if="!isNew" type="button" class="savebar__delete" :aria-label="copy.delete" :title="copy.delete" @click="emit('remove')">
        <i class="fa-solid fa-trash-can"></i>
      </button>
      <button
        type="button"
        class="btn btn--primary savebar__save"
        :class="{ 'savebar__save--busy': saving }"
        :disabled="saving || (!dirty && !isNew)"
        @click="emit('save')"
      >
        <i class="fa-solid fa-check"></i>
        {{ saving ? copy.saving : isNew ? copy.create : copy.save }}
        <span class="savebar__progress" aria-hidden="true"></span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.savebar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  @include flex(row, center, space-between, 0.8rem);
  padding: 0.75rem 1rem;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
  background: rgba($surface, 0.94);
  backdrop-filter: blur(12px);
  border-top: 1px solid $line;
  box-shadow: 0 -10px 30px rgba($ink, 0.06);
  animation: bar-in 0.5s $ease both;

  @include from('lg') {
    left: 264px;
    padding-inline: 2.5rem;
  }

  &__state {
    @include flex(row, center, flex-start, 0.55rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-muted;
  }

  &__dot {
    flex-shrink: 0;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: $accent;
    transition: background-color 0.3s ease;
  }

  &--dirty {
    .savebar__state {
      color: darken($warning, 16%);
    }

    .savebar__dot {
      background: $warning;
      animation: dot-pulse 1.6s ease-in-out infinite;
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.5rem);
  }

  &__delete {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: $ink-muted;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background: $danger-bg;
      color: $danger;
    }
  }

  &__save {
    position: relative;
    overflow: hidden;

    &--busy {
      opacity: 1 !important;
    }
  }

  &__progress {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40%;
    height: 3px;
    background: $lime;
    opacity: 0;
    transform: translateX(-110%);

    .savebar__save--busy & {
      opacity: 1;
      animation: save-run 1s $ease infinite;
    }
  }
}

@keyframes bar-in {
  from {
    transform: translateY(100%);
  }
}

@keyframes dot-pulse {
  50% {
    box-shadow: 0 0 0 6px rgba($warning, 0.2);
  }
}

@keyframes save-run {
  to {
    transform: translateX(260%);
  }
}
</style>
