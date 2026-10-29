<script setup lang="ts">
/**
 * Cinta infinita. El contenido se duplica y se desplaza el 50 %: el segundo
 * bloque ocupa exactamente el lugar del primero y el salto no se nota.
 */
withDefaults(
  defineProps<{
    items: { label: string; icon?: string }[]
    reverse?: boolean
    tone?: 'ink' | 'lime' | 'green'
    duration?: number
    tilt?: number
  }>(),
  { reverse: false, tone: 'ink', duration: 38, tilt: 0 },
)
</script>

<template>
  <div
    class="marquee"
    :class="[`marquee--${tone}`, { 'marquee--reverse': reverse }]"
    :style="{ '--duration': `${duration}s`, '--tilt': `${tilt}deg` }"
  >
    <div class="marquee__track">
      <ul v-for="copy in 2" :key="copy" class="marquee__group" :aria-hidden="copy === 2">
        <li v-for="item in items" :key="item.label" class="marquee__item">
          <i v-if="item.icon" :class="item.icon" aria-hidden="true"></i>
          <span>{{ item.label }}</span>
          <i class="fa-solid fa-asterisk marquee__sep" aria-hidden="true"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.marquee {
  overflow: hidden;
  transform: rotate(var(--tilt));
  padding-block: 0.95rem;
  width: 104%;
  margin-left: -2%;

  &__track {
    display: flex;
    width: max-content;
    animation: marquee var(--duration) linear infinite;
  }

  &:hover &__track {
    animation-play-state: paused;
  }

  &--reverse &__track {
    animation-direction: reverse;
  }

  &__group {
    display: flex;
    flex-shrink: 0;
    list-style: none;
  }

  &__item {
    @include flex(row, center, flex-start, 0.7rem);
    padding-right: 1.6rem;
    font-family: $font-display;
    font-size: clamp(1.05rem, 0.9rem + 0.8vw, 1.6rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  &__sep {
    font-size: 0.7em;
    margin-left: 0.9rem;
    opacity: 0.6;
  }

  &--ink {
    background: $ink;
    color: $surface;

    i:not(.marquee__sep) {
      color: $lime;
    }
  }

  &--lime {
    background: $lime;
    color: $ink;
  }

  &--green {
    background: $accent;
    color: $surface;
  }
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}
</style>
