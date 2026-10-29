<script setup lang="ts">
import LoginBrandPanel from '@/components/admin/LoginBrandPanel.vue'
import { useAdminLogin } from '@/composables/useAdminLogin'
import { loginCopy as copy } from '@/config/admin.copy'

const { email, password, remember, showPassword, loading, error, shakeKey, submit } =
  useAdminLogin()
</script>

<template>
  <div class="login">
    <LoginBrandPanel class="login__brand" />

    <section class="login__side">
      <form
        :key="shakeKey"
        class="login__form"
        :class="{ 'login__form--shake': shakeKey > 0 }"
        novalidate
        @submit.prevent="submit"
      >
        <p class="login__eyebrow">{{ copy.eyebrow }}</p>
        <h1 class="login__title">{{ copy.title }}</h1>
        <p class="login__subtitle">{{ copy.subtitle }}</p>

        <div class="login__field">
          <label for="login-email">{{ copy.email }}</label>
          <div class="login__input">
            <i class="fa-regular fa-envelope login__icon"></i>
            <input
              id="login-email"
              v-model="email"
              type="email"
              autocomplete="email"
              :placeholder="copy.emailPlaceholder"
              :aria-invalid="Boolean(error)"
              required
            />
          </div>
        </div>

        <div class="login__field">
          <label for="login-password">{{ copy.password }}</label>
          <div class="login__input">
            <i class="fa-solid fa-lock login__icon"></i>
            <input
              id="login-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              :aria-invalid="Boolean(error)"
              required
            />
            <button
              type="button"
              class="login__eye"
              :aria-label="showPassword ? copy.hide : copy.show"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </button>
          </div>
        </div>

        <label class="login__remember">
          <input v-model="remember" type="checkbox" />
          <span>{{ copy.remember }}</span>
        </label>

        <Transition name="rise">
          <p v-if="error" class="login__error" role="alert">
            <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
          </p>
        </Transition>

        <button
          class="btn btn--primary btn--block btn--lg login__submit"
          type="submit"
          :disabled="loading || !email || !password"
          :class="{ 'login__submit--loading': loading }"
        >
          {{ loading ? copy.submitting : copy.submit }}
          <i v-if="!loading" class="fa-solid fa-arrow-right"></i>
          <span class="login__progress" aria-hidden="true"></span>
        </button>

        <RouterLink to="/" class="login__back">
          <i class="fa-solid fa-arrow-left"></i> {{ copy.backToStore }}
        </RouterLink>
      </form>
    </section>
  </div>
</template>

<style scoped lang="scss">
.login {
  @include flex(column, stretch, flex-start);
  min-height: 100vh;
  background: $paper;

  @include from('lg') {
    flex-direction: row;
  }

  &__brand {
    @include from('lg') {
      flex: 0 0 46%;
      position: sticky;
      top: 0;
    }
  }

  &__side {
    flex: 1;
    @include flex(column, center, center);
    padding: $space-lg 1.25rem;
  }

  &__form {
    @include flex(column, stretch, flex-start, 1.1rem);
    width: 100%;
    max-width: 400px;
    animation: form-in 0.7s $ease both;

    &--shake {
      animation: form-shake 0.45s $ease;
    }
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 700);
    margin-top: -0.4rem;
  }

  &__subtitle {
    color: $ink-muted;
    font-size: $text-sm;
    margin-top: -0.5rem;
    margin-bottom: 0.4rem;
  }

  &__input {
    position: relative;

    input {
      padding-left: 2.6rem;
      padding-block: 0.85rem;
      font-size: 1rem;
    }

    input[aria-invalid='true'] {
      border-color: rgba($danger, 0.6);
    }
  }

  &__icon {
    position: absolute;
    left: 0.95rem;
    top: 50%;
    transform: translateY(-50%);
    color: $ink-muted;
    pointer-events: none;
  }

  &__eye {
    position: absolute;
    right: 0.35rem;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: $ink-muted;
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover {
      color: $ink;
      background: rgba($ink, 0.05);
    }
  }

  &__remember {
    @include flex(row, center, flex-start, 0.55rem);
    margin: 0;
    cursor: pointer;
    font-size: $text-sm;

    input {
      width: 18px;
      height: 18px;
      padding: 0;
      accent-color: $accent;
    }
  }

  &__error {
    @include flex(row, center, flex-start, 0.55rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $danger;
    background: $danger-bg;
    padding: 0.75rem 0.95rem;
    border-radius: $radius-sm;
  }

  &__submit {
    position: relative;
    overflow: hidden;
    margin-top: 0.3rem;

    &--loading {
      opacity: 1 !important;
    }
  }

  &__progress {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 3px;
    width: 40%;
    background: $lime;
    transform: translateX(-110%);
    opacity: 0;

    .login__submit--loading & {
      opacity: 1;
      animation: progress-run 1.1s $ease infinite;
    }
  }

  &__back {
    @include flex(row, center, center, 0.45rem);
    font-size: $text-sm;
    color: $ink-muted;
    transition: color 0.2s ease;

    &:hover {
      color: $accent-deep;
    }
  }
}

@keyframes form-in {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
}

@keyframes form-shake {
  20%,
  60% {
    transform: translateX(-9px);
  }
  40%,
  80% {
    transform: translateX(9px);
  }
}

@keyframes progress-run {
  to {
    transform: translateX(260%);
  }
}
</style>
