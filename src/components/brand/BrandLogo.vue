<script setup lang="ts">
/**
 * Logo de CadPharm dibujado en SVG: la gota azul con la hoja verde, igual que
 * en los empaques. `tone="light"` es para fondos oscuros (texto claro).
 */
withDefaults(
  defineProps<{
    tone?: 'dark' | 'light'
    compact?: boolean
  }>(),
  { tone: 'dark', compact: false },
)
</script>

<template>
  <span class="logo" :class="[`logo--${tone}`, { 'logo--compact': compact }]">
    <svg class="logo__mark" viewBox="0 0 40 48" aria-hidden="true" focusable="false">
      <path class="logo__drop" d="M19 9C19 9 5 24.5 5 33.5a14 14 0 0 0 28 0C33 24.5 19 9 19 9Z" />
      <ellipse
        class="logo__shine"
        cx="12.5"
        cy="33"
        rx="2.4"
        ry="4.6"
        transform="rotate(18 12.5 33)"
      />
      <path class="logo__leaf" d="M20.5 11.5C21 4.5 27 0.6 36 1.2 35.4 9.4 29.8 13.6 20.5 11.5Z" />
      <path class="logo__vein" d="M21.5 11C25 7.6 28.6 5 32.5 3.6" />
    </svg>
    <span v-if="!compact" class="logo__text">
      <span class="logo__name">Cad<b>Pharm</b></span>
      <span class="logo__sub">Laboratorio</span>
    </span>
  </span>
</template>

<style scoped lang="scss">
.logo {
  @include flex(row, center, flex-start, 0.55rem);
  line-height: 1;

  &__mark {
    width: 2rem;
    height: 2.4rem;
    flex-shrink: 0;
    overflow: visible;
  }

  &__drop {
    fill: $brand-blue;
  }

  &__shine {
    fill: rgba(255, 255, 255, 0.35);
  }

  &__leaf {
    fill: $accent;
    transform-origin: 20px 11px;
    transition: transform 0.6s $ease;
  }

  &__vein {
    fill: none;
    stroke: rgba(255, 255, 255, 0.55);
    stroke-width: 1;
    stroke-linecap: round;
  }

  &:hover &__leaf {
    transform: rotate(-8deg);
  }

  &__text {
    @include flex(column, flex-start, center, 0.28rem);
  }

  &__name {
    font-family: $font-display;
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: $ink;

    b {
      font-weight: 800;
      color: $brand-blue;
    }
  }

  &__sub {
    font-size: 0.56rem;
    font-weight: 700;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: $ink-soft;
    padding-left: 0.05em;
  }

  &--light {
    .logo__name {
      color: $surface;

      b {
        color: #8fb4ff;
      }
    }

    .logo__sub {
      color: rgba(255, 255, 255, 0.6);
    }

    .logo__drop {
      fill: #3b6fd0;
    }
  }
}
</style>
