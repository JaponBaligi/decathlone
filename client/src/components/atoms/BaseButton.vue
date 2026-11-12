<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  type: { type: String, default: 'button' },
  block: Boolean,
  disabled: Boolean,
})
</script>

<template>
  <button
    class="btn"
    :class="[`btn--${variant}`, { 'btn--block': block }]"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 44px;
  padding: 0.65rem 1.25rem;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.btn--block {
  width: 100%;
}
.btn--primary {
  background: var(--color-ink);
  color: #fff;
}
.btn--primary:hover:not(:disabled) {
  background: #000;
}
.btn--brand {
  background: var(--color-brand);
  color: #fff;
}
.btn--brand:hover:not(:disabled) {
  background: var(--color-brand-dark);
}
.btn--secondary {
  background: #fff;
  border-color: var(--color-border);
  color: var(--color-ink);
}
.btn--secondary:hover:not(:disabled) {
  border-color: var(--color-ink);
}
.btn--ghost {
  background: transparent;
  color: var(--color-brand);
}
.btn--pill-light {
  background: #fff;
  color: var(--color-ink);
  border: none;
  box-sizing: border-box;
  height: 33px;
  min-height: 33px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  line-height: 17px;
  box-shadow: none;
}
.btn--pill-light:hover:not(:disabled) {
  background: #f5f4f5;
}
.btn--danger {
  background: var(--color-deal);
  color: #fff;
}
</style>
