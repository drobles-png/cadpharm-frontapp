<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { orderDetailCopy as copy, orderStatus } from '@/config/admin.copy'
import type { OrderStatus } from '@/types'

const props = defineProps<{
  status: OrderStatus
  next?: { to: OrderStatus; label: string; hint: string }
  canCancel: boolean
  updating: boolean
}>()

const emit = defineEmits<{ change: [status: OrderStatus, note: string, done: (ok: boolean) => void] }>()

const note = ref('')
const cancelNote = ref('')
const confirmCancel = ref(false)

function advance() {
  if (!props.next) return
  emit('change', props.next.to, note.value, (ok) => ok && (note.value = ''))
}

function cancel() {
  emit('change', 'cancelled', cancelNote.value, (ok) => {
    if (!ok) return
    cancelNote.value = ''
    confirmCancel.value = false
  })
}
</script>

<template>
  <section class="actions">
    <h2 class="actions__title">{{ copy.nextTitle }}</h2>

    <Transition name="rise" mode="out-in">
      <div v-if="next" :key="next.to" class="actions__next">
        <p class="actions__hint">{{ next.hint }}</p>
        <label class="actions__note">
          <span>{{ copy.note }}</span>
          <input v-model="note" type="text" :placeholder="copy.notePlaceholder" />
        </label>
        <button
          type="button"
          class="btn btn--primary btn--lg btn--block actions__go"
          :disabled="updating"
          @click="advance"
        >
          <i :class="orderStatus[next.to].icon"></i>
          {{ next.label }}
        </button>
      </div>
      <p v-else key="done" class="actions__done">
        <i :class="orderStatus[status].icon"></i> {{ copy.done }}
      </p>
    </Transition>

    <button
      v-if="canCancel"
      type="button"
      class="actions__cancel"
      :disabled="updating"
      @click="confirmCancel = true"
    >
      <i class="fa-solid fa-ban"></i> {{ copy.cancel }}
    </button>

    <BaseModal
      :open="confirmCancel"
      :title="copy.cancelTitle"
      :message="copy.cancelMessage"
      :confirm-label="copy.cancelConfirm"
      :cancel-label="copy.cancelKeep"
      danger
      @confirm="cancel"
      @cancel="confirmCancel = false"
    >
      <label class="actions__modal-note">
        <span>{{ copy.note }}</span>
        <textarea v-model="cancelNote" rows="2" :placeholder="copy.notePlaceholder"></textarea>
      </label>
    </BaseModal>
  </section>
</template>

<style scoped lang="scss">
.actions {
  @include flex(column, stretch, flex-start, 0.9rem);
  padding: 1.2rem;
  border-radius: 14px;
  background: linear-gradient(160deg, $ink, $brand-blue-deep);
  color: $surface;

  &__title {
    @include display($text-lg, 700);
  }

  &__next {
    @include flex(column, stretch, flex-start, 0.8rem);
  }

  &__hint {
    color: rgba(255, 255, 255, 0.75);
    font-size: $text-sm;
  }

  &__note {
    margin: 0;

    span {
      display: block;
      margin-bottom: 0.3rem;
      font-size: $text-xs;
      color: rgba(255, 255, 255, 0.6);
    }

    input {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
      color: $surface;

      &::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }
    }
  }

  &__go {
    padding-block: 1.1rem;
    font-size: 1.02rem;
  }

  &__done {
    @include flex(row, center, flex-start, 0.6rem);
    padding: 0.9rem 1rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    font-weight: 600;

    i {
      color: $lime;
    }
  }

  &__cancel {
    @include flex(row, center, center, 0.5rem);
    padding: 0.7rem;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background: rgba($danger, 0.25);
      color: $surface;
    }
  }

  &__modal-note {
    width: 100%;
    margin: 0.3rem 0 0;
    text-align: left;

    span {
      display: block;
      margin-bottom: 0.3rem;
    }

    textarea {
      resize: vertical;
    }
  }
}
</style>
