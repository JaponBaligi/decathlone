<script setup>
import { RouterLink } from 'vue-router'
defineProps({
  inverted: Boolean,
})
</script>

<template>
  <RouterLink to="/" class="logo" aria-label="Ana sayfaya git">
    <img
      class="logo__img"
      :class="{ 'logo__img--inv': inverted }"
      src="/brand/decathlon-logo.svg"
      width="188"
      height="28"
      alt="Decathlon logosu"
    />
  </RouterLink>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  line-height: 0;
}
.logo__img {
  width: 188px;
  height: 28px;
}
.logo__img--inv {
  filter: brightness(0) invert(1);
}
@media (max-width: 760px) {
  .logo__img {
    width: 140px;
    height: 21px;
  }
}
</style>
