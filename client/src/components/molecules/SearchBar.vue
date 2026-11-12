<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const q = ref('')

function submit() {
  const query = q.value.trim()
  if (!query) return
  router.push({ name: 'search', query: { q: query } })
}
</script>

<template>
  <form class="search" role="search" @submit.prevent="submit">
    <button class="search__btn" type="submit" aria-label="Ara">
      <svg
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        stroke-width="1.5"
        aria-hidden="true"
      >
        <path
          d="M21.1667 21.1667L16.7387 16.7387M18.8889 11.0556C18.8889 15.3802 15.3802 18.8889 11.0556 18.8889C6.73092 18.8889 3.22223 15.3802 3.22223 11.0556C3.22223 6.7309 6.73092 3.22223 11.0556 3.22223C15.3802 3.22223 18.8889 6.7309 18.8889 11.0556Z"
          stroke="currentColor"
        />
      </svg>
    </button>
    <label class="sr-only" for="site-search">Ara</label>
    <input
      id="site-search"
      v-model="q"
      class="search__input"
      type="search"
      placeholder="Ara"
      autocomplete="off"
    />
  </form>
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  width: min(100%, 888px);
  height: 48px;
  padding: 0 8px 0 4px;
  border-radius: 24px;
  background: #f5f4f5;
}
.search__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-ink);
  cursor: pointer;
  border-radius: 999px;
  flex-shrink: 0;
}
.search__btn svg {
  width: 24px;
  height: 24px;
}
.search__input {
  flex: 1;
  height: 40px;
  border: 0;
  padding: 8px 0;
  background: transparent;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--color-ink);
  text-align: center;
  outline: none;
}
.search__input::placeholder {
  color: #616161;
  font-weight: 500;
  text-align: center;
}
</style>
