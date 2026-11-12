<script setup>
defineProps({
  tone: { type: String, default: 'neutral' },
})
</script>

<template>
  <span class="badge" :class="`badge--${tone}`"><slot /></span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.45rem;
  border-radius: 2px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.badge--deal {
  background: var(--color-deal);
  color: #fff;
}
.badge--new {
  background: var(--color-brand);
  color: #fff;
}
.badge--neutral {
  background: var(--color-canvas-soft);
  color: var(--color-muted);
}
.badge--success {
  background: #e7fbf4;
  color: #027a58;
}
</style>
