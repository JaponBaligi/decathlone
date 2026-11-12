<script setup>
import BaseButton from '@/components/atoms/BaseButton.vue'
import PriceTag from '@/components/atoms/PriceTag.vue'

defineProps({
  item: { type: Object, required: true },
})
const emit = defineEmits(['update-qty', 'remove'])
</script>

<template>
  <article class="line">
    <img :src="item.product.imageUrl" :alt="item.product.name" width="96" height="96" />
    <div class="line__info">
      <h3>{{ item.product.name }}</h3>
      <p>{{ item.color }} / {{ item.size }}</p>
      <PriceTag :price-label="item.product.priceLabel" />
      <div class="line__actions">
        <label>
          Adet
          <select :value="item.quantity" @change="emit('update-qty', Number($event.target.value))">
            <option v-for="n in Math.min(item.stock, 10)" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>
        <BaseButton variant="ghost" @click="emit('remove')">Kaldır</BaseButton>
      </div>
    </div>
    <strong class="line__total">{{ item.lineTotalLabel }}</strong>
  </article>
</template>

<style scoped>
.line {
  display: grid;
  grid-template-columns: 96px 1fr auto;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}
.line img {
  border-radius: var(--radius-sm);
  object-fit: cover;
}
.line__info h3 {
  font-family: var(--font-sans);
  font-size: 1rem;
  margin-bottom: var(--space-1);
}
.line__info p {
  color: var(--color-muted);
  margin: 0 0 var(--space-2);
}
.line__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-2);
}
.line__actions select {
  margin-left: var(--space-2);
  min-height: 40px;
}
.line__total {
  white-space: nowrap;
}
@media (max-width: 700px) {
  .line {
    grid-template-columns: 72px 1fr;
  }
  .line__total {
    grid-column: 2;
  }
}
</style>
