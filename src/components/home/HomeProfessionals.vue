<script setup lang="ts">
import { homeCopy } from '@/config/home.copy'
import SectionHeading from '@/components/common/SectionHeading.vue'
import MagneticButton from '@/components/common/MagneticButton.vue'

const copy = homeCopy.professionals
</script>

<template>
  <section class="pros">
    <span class="pros__pattern" aria-hidden="true"></span>
    <span class="pros__glow" aria-hidden="true"></span>
    <div class="pros__inner">
      <div class="pros__intro">
        <SectionHeading
          :eyebrow="copy.eyebrow"
          :title="copy.title"
          :text="copy.text"
          tone="light"
        />
        <div data-reveal data-reveal-delay="0.2">
          <MagneticButton>
            <RouterLink to="/profesionales" class="btn btn--primary btn--lg pros__cta">
              <i class="fa-solid fa-stethoscope" aria-hidden="true"></i>{{ copy.cta }}
            </RouterLink>
          </MagneticButton>
        </div>
      </div>

      <ul class="pros__grid">
        <li
          v-for="(item, i) in copy.items"
          :key="item.title"
          class="pros__cell"
          data-reveal
          :data-reveal-delay="(0.1 + i * 0.08).toFixed(2)"
        >
          <div class="pro">
            <span class="pro__icon"><i :class="item.icon" aria-hidden="true"></i></span>
            <h3 class="pro__title">{{ item.title }}</h3>
            <p class="pro__text">{{ item.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pros {
  position: relative;
  overflow: hidden;
  background: $ink;
  color: $surface;
  padding-block: $space-section;
  border-radius: $radius-lg;
  margin-inline: 0.5rem;

  @include from('md') {
    margin-inline: 1rem;
    border-radius: 40px;
  }

  // Patrón de cruces médicas que se desplaza en diagonal, muy tenue.
  &__pattern {
    position: absolute;
    inset: -60px;
    opacity: 0.07;
    mask-image: radial-gradient(ellipse at 30% 30%, #000 20%, transparent 75%);
    animation: drift 18s linear infinite;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M29 23h2v14h-2zM23 29h14v2H23z' fill='%23fff'/%3E%3C/svg%3E");
    background-size: 60px 60px;
    background-repeat: repeat;
  }

  &__glow {
    position: absolute;
    width: 40rem;
    height: 40rem;
    right: -14rem;
    bottom: -18rem;
    border-radius: 50%;
    background: radial-gradient(circle, rgba($brand-blue, 0.55), transparent 65%);
    animation: glow 12s ease-in-out infinite alternate;
  }

  &__inner {
    position: relative;
    @include container(1200px);
    @include flex(column, stretch, flex-start, $space-lg);

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 4rem;
    }
  }

  &__intro {
    @include flex(column, flex-start, flex-start, 2rem);

    @include from('lg') {
      flex: 1 1 45%;
    }
  }

  &__cta {
    box-shadow: $shadow-glow;
  }

  &__grid {
    list-style: none;
    @include flex-cards(100%, 1rem);

    @include from('lg') {
      flex: 1 1 55%;
    }

    > * {
      @include from('sm') {
        flex: 0 0 calc(50% - 0.5rem);
      }
    }
  }

  &__cell {
    display: flex;
  }
}

.pro {
  flex: 1;
  padding: 1.5rem;
  border-radius: $radius-md;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition:
    background-color 0.4s ease,
    transform 0.5s $ease,
    border-color 0.4s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.09);
    border-color: rgba($lime, 0.5);
    transform: translateY(-4px);
  }

  &__icon {
    width: 3rem;
    height: 3rem;
    border-radius: $radius-sm;
    @include flex(row, center, center);
    background: $lime;
    color: $ink;
    font-size: 1.2rem;
    margin-bottom: 1.1rem;
  }

  &__title {
    font-size: $text-lg;
    font-weight: 700;
    margin-bottom: 0.35rem;
  }

  &__text {
    font-size: $text-sm;
    color: rgba(255, 255, 255, 0.7);
  }
}

@keyframes drift {
  to {
    transform: translate(60px, 60px);
  }
}

@keyframes glow {
  to {
    transform: translate(-8rem, -4rem) scale(1.15);
  }
}
</style>
