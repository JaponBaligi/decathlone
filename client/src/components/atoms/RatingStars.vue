<script setup>
defineProps({
  rating: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
})
</script>

<template>
  <div class="rating" :aria-label="`${rating} / 5, ${count} değerlendirme`">
    <span class="rating__stars" aria-hidden="true">★</span>
    <strong>{{ rating.toFixed(1) }}</strong>
    <span class="rating__count">({{ count }})</span>
  </div>
</template>

<style scoped>
.rating {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--color-muted);
  font-size: 0.875rem;
}
.rating__stars {
  color: var(--color-warning);
}
</style>
