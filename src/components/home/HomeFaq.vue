<script setup lang="ts">
import { ref } from 'vue'
import { whatsappLink } from '@/config/site'
import { homeCopy } from '@/config/home.copy'
import SectionHeading from '@/components/common/SectionHeading.vue'

const copy = homeCopy.faq
const open = ref<number | null>(0)

function toggle(i: number) {
  open.value = open.value === i ? null : i
}

// Altura animada sin CSS Grid: se mide el contenido y se transiciona a ese valor.
function onEnter(el: Element) {
  const node = el as HTMLElement
  node.style.height = '0px'
  requestAnimationFrame(() => (node.style.height = `${node.scrollHeight}px`))
}
function onAfterEnter(el: Element) {
  ;(el as HTMLElement).style.height = ''
}
function onLeave(el: Element) {
  const node = el as HTMLElement
  node.style.height = `${node.scrollHeight}px`
  requestAnimationFrame(() => (node.style.height = '0px'))
}
</script>

<template>
  <section class="faq">
    <div class="faq__side">
      <SectionHeading :eyebrow="copy.eyebrow" :title="copy.title" />
      <a :href="whatsappLink()" class="faq__more" target="_blank" rel="noopener" data-reveal>
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>{{ copy.more }}
      </a>
    </div>

    <ul class="faq__list">
      <li
        v-for="(item, i) in copy.items"
        :key="item.q"
        class="faq__item"
        :class="{ 'faq__item--open': open === i }"
        data-reveal
        :data-reveal-delay="(i * 0.06).toFixed(2)"
      >
        <h3>
          <button
            :id="`faq-q-${i}`"
            type="button"
            class="faq__q"
            :aria-expanded="open === i"
            :aria-controls="`faq-a-${i}`"
            @click="toggle(i)"
          >
            <span>{{ item.q }}</span>
            <span class="faq__icon" aria-hidden="true"></span>
          </button>
        </h3>
        <Transition @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
          <div
            v-show="open === i"
            :id="`faq-a-${i}`"
            class="faq__a"
            role="region"
            :aria-labelledby="`faq-q-${i}`"
          >
            <p>{{ item.a }}</p>
          </div>
        </Transition>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.faq {
  @include container(1200px);
  padding-block: $space-section;
  @include flex(column, stretch, flex-start, $space-lg);

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;
    gap: 5rem;
  }

  &__side {
    @include flex(column, flex-start, flex-start, 1.5rem);

    @include from('lg') {
      flex: 0 0 34%;
      position: sticky;
      top: 6rem;
    }
  }

  &__more {
    @include flex(row, center, flex-start, 0.5rem);
    font-weight: 700;
    color: $accent-deep;

    i {
      font-size: 1.3rem;
      color: #25d366;
    }
  }

  &__list {
    list-style: none;
    flex: 1;
    @include flex(column, stretch, flex-start, 0.75rem);
  }

  &__item {
    border-radius: $radius-md;
    background: $surface;
    border: 1px solid $line;
    transition:
      opacity 0.8s $ease var(--reveal-delay, 0s),
      transform 0.8s $ease var(--reveal-delay, 0s),
      border-color 0.3s ease,
      box-shadow 0.3s ease;

    &--open {
      border-color: rgba($accent, 0.4);
      box-shadow: $shadow-md;
    }
  }

  &__q {
    width: 100%;
    @include flex(row, center, space-between, 1rem);
    padding: 1.2rem 1.4rem;
    text-align: left;
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 700;
    letter-spacing: -0.02em;
    border-radius: $radius-md;
    @include focus-ring;
  }

  &__icon {
    position: relative;
    flex-shrink: 0;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background: $sand;
    transition:
      transform 0.45s $ease,
      background-color 0.3s ease;

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 0.8rem;
      height: 2px;
      border-radius: 2px;
      background: $ink;
      transform: translate(-50%, -50%);
      transition: transform 0.45s $ease;
    }

    &::after {
      transform: translate(-50%, -50%) rotate(90deg);
    }
  }

  &__item--open &__icon {
    background: $accent;
    transform: rotate(180deg);

    &::before,
    &::after {
      background: $surface;
    }

    &::after {
      transform: translate(-50%, -50%) rotate(0deg);
    }
  }

  &__a {
    overflow: hidden;
    transition: height 0.45s $ease;

    p {
      padding: 0 1.4rem 1.3rem;
      color: $ink-soft;
      max-width: 60ch;
    }
  }
}
</style>
