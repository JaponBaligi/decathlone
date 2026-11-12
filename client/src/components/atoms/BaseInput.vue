<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  id: String,
  placeholder: String,
  disabled: Boolean,
  required: Boolean,
  min: [String, Number],
  max: [String, Number],
})
defineEmits(['update:modelValue'])
</script>

<template>
  <input
    class="input"
    :id="id"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :min="min"
    :max="max"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<style scoped>
.input {
  width: 100%;
  min-height: 44px;
  padding: 0.6rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: #fff;
}
.input:focus {
  outline: 2px solid var(--color-brand-soft);
  border-color: var(--color-brand);
}
</style>
