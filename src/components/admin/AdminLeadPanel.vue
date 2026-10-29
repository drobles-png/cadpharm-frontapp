<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import AdminLeadStatusPicker from '@/components/admin/AdminLeadStatusPicker.vue'
import { useBodyScroll } from '@/composables/useBodyScroll'
import { leadType, leadsCopy as copy, waLink } from '@/config/admin.copy'
import { formatDateTime } from '@/utils/format'
import type { Lead, LeadStatus } from '@/types'

const props = defineProps<{ lead: Lead | null; saving: boolean }>()
const emit = defineEmits<{ close: []; update: [input: { status?: LeadStatus; note?: string }] }>()

const open = computed(() => Boolean(props.lead))
useBodyScroll(open)

const note = ref('')
watch(toRef(props, 'lead'), (l) => (note.value = l?.note || ''), { immediate: true })
const noteDirty = computed(() => note.value !== (props.lead?.note || ''))

const rows = computed(() => {
  const l = props.lead
  if (!l) return []
  return [
    { label: copy.specialty, value: l.specialty, icon: 'fa-solid fa-stethoscope', href: '' },
    { label: copy.institution, value: l.institution, icon: 'fa-solid fa-hospital', href: '' },
    { label: copy.email, value: l.email, icon: 'fa-solid fa-envelope', href: `mailto:${l.email}` },
    { label: copy.phone, value: l.phone, icon: 'fa-solid fa-phone', href: `tel:${l.phone}` },
    { label: copy.city, value: l.city, icon: 'fa-solid fa-location-dot', href: '' },
    { label: copy.received, value: formatDateTime(l.createdAt), icon: 'fa-solid fa-clock', href: '' },
  ].filter((r) => r.value)
})

const wa = computed(() => (props.lead ? waLink(props.lead.phone, copy.waMessage(props.lead.name)) : '#'))
const mail = computed(() =>
  props.lead ? `mailto:${props.lead.email}?subject=${encodeURIComponent(copy.emailSubject)}` : '#',
)
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="lpanel__overlay" @click="emit('close')"></div>
    </Transition>
    <Transition name="panel">
      <aside v-if="lead" class="lpanel" role="dialog" aria-modal="true" :aria-label="lead.name" @keydown.esc="emit('close')">
        <header class="lpanel__head">
          <span class="lpanel__type"><i :class="leadType[lead.type]?.icon"></i> {{ leadType[lead.type]?.label }}</span>
          <button type="button" class="lpanel__close" :aria-label="copy.close" @click="emit('close')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </header>

        <div class="lpanel__body">
          <h2 class="lpanel__name">{{ lead.name }}</h2>

          <div class="lpanel__cta">
            <a v-if="lead.phone" :href="wa" target="_blank" rel="noopener" class="btn btn--primary">
              <i class="fa-brands fa-whatsapp"></i> {{ copy.whatsapp }}
            </a>
            <a v-if="lead.email" :href="mail" class="btn btn--ghost">
              <i class="fa-solid fa-envelope"></i> {{ copy.email_cta }}
            </a>
          </div>

          <AdminLeadStatusPicker :status="lead.status" :disabled="saving" @change="(s) => emit('update', { status: s })" />

          <dl class="lpanel__rows">
            <div v-for="r in rows" :key="r.label">
              <dt><i :class="r.icon"></i> {{ r.label }}</dt>
              <dd>
                <a v-if="r.href" :href="r.href">{{ r.value }}</a>
                <template v-else>{{ r.value }}</template>
              </dd>
            </div>
          </dl>

          <div v-if="lead.productsOfInterest?.length" class="lpanel__block">
            <p class="lpanel__label">{{ copy.products }}</p>
            <div class="lpanel__tags">
              <span v-for="p in lead.productsOfInterest" :key="p">{{ p }}</span>
            </div>
          </div>

          <div v-if="lead.message" class="lpanel__block">
            <p class="lpanel__label">{{ copy.message }}</p>
            <p class="lpanel__message">{{ lead.message }}</p>
          </div>

          <div class="lpanel__block">
            <label class="lpanel__label" for="lead-note">{{ copy.note }}</label>
            <textarea id="lead-note" v-model="note" rows="3" :placeholder="copy.notePlaceholder"></textarea>
            <Transition name="rise">
              <button
                v-if="noteDirty"
                type="button"
                class="btn btn--dark lpanel__save"
                :disabled="saving"
                @click="emit('update', { note })"
              >
                <i class="fa-solid fa-floppy-disk"></i> {{ copy.saveNote }}
              </button>
            </Transition>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.lpanel {
  position: fixed;
  z-index: 150;
  inset: auto 0 0 0;
  max-height: 92vh;
  @include flex(column, stretch, flex-start);
  background: $surface;
  border-radius: 24px 24px 0 0;
  box-shadow: $shadow-lg;

  @include from('md') {
    inset: 0 0 0 auto;
    width: 440px;
    max-height: none;
    border-radius: 24px 0 0 24px;
  }

  &__overlay {
    position: fixed;
    inset: 0;
    z-index: 140;
    background: $overlay;
    backdrop-filter: blur(2px);
  }

  &__head {
    @include flex(row, center, space-between, 1rem);
    padding: 1rem 1.25rem;
    border-bottom: 1px solid $line;
  }

  &__type {
    @include flex(row, center, flex-start, 0.5rem);
    padding: 0.35rem 0.8rem;
    border-radius: $radius-pill;
    background: $accent-soft;
    color: $accent-deep;
    font-size: $text-sm;
    font-weight: 700;
  }

  &__close {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: background-color 0.2s ease;

    &:hover {
      background: $sand;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 1.2rem);
    padding: 1.25rem 1.25rem 2rem;
    padding-bottom: max(2rem, env(safe-area-inset-bottom));
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  &__name {
    @include display($text-xl, 800);
  }

  &__cta {
    @include flex(row, stretch, flex-start, 0.6rem);
    flex-wrap: wrap;

    .btn {
      flex: 1 1 140px;
    }
  }

  &__rows {
    @include flex(column, stretch, flex-start, 0.75rem);

    dt {
      @include flex(row, center, flex-start, 0.45rem);
      font-size: $text-xs;
      font-weight: 700;
      color: $ink-muted;

      i {
        width: 14px;
        color: $accent;
      }
    }

    dd {
      font-size: $text-sm;
      word-break: break-word;

      a:hover {
        color: $accent-deep;
      }
    }
  }

  &__label {
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: $ink-muted;
    margin-bottom: 0.4rem;
  }

  &__tags {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;

    span {
      padding: 0.25rem 0.7rem;
      border-radius: $radius-pill;
      background: $brand-blue-soft;
      color: $brand-blue;
      font-size: $text-xs;
      font-weight: 700;
    }
  }

  &__message {
    padding: 0.9rem 1rem;
    border-radius: 14px;
    background: $paper;
    font-size: $text-sm;
    white-space: pre-line;
  }

  &__save {
    margin-top: 0.6rem;
  }
}

.panel-enter-active,
.panel-leave-active {
  transition: transform 0.45s $ease;
}

.panel-enter-from,
.panel-leave-to {
  transform: translateY(100%);

  @include from('md') {
    transform: translateX(100%);
  }
}
</style>
