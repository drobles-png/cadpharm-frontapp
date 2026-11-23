<script setup lang="ts">
/**
 * Marca de CadPharm solo en texto (sin la gota, pedido del cliente).
 * `tone="light"` es para fondos oscuros: todo en blanco.
 */
withDefaults(
  defineProps<{
    tone?: 'dark' | 'light'
  }>(),
  { tone: 'dark' },
)
</script>

<template>
  <span class="logo" :class="`logo--${tone}`">
    <span class="logo__name">Cad<b>Pharm</b></span>
    <span class="logo__sub">Laboratorio</span>
  </span>
</template>

<style scoped lang="scss">
.logo {
  @include flex(column, flex-start, center, 0.28rem);
  line-height: 1;

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
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: $ink-soft;
    padding-left: 0.05em;
  }

  &--light {
    .logo__name,
    .logo__name b,
    .logo__sub {
      color: #fff;
    }
  }
}
</style>
