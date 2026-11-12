<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  menu: { type: Object, required: true },
})

/** Split groups into up to 4 visual columns like live wrapper--columns-4 */
const columns = computed(() => {
  const groups = props.menu?.groups || []
  const colCount = Math.min(4, Math.max(1, groups.length <= 4 ? groups.length : 4))
  const cols = Array.from({ length: colCount }, () => [])
  groups.forEach((g, i) => {
    cols[i % colCount].push(g)
  })
  return cols
})
</script>

<template>
  <div class="mega" role="region" :aria-label="menu.title">
    <div class="mega__inner container">
      <RouterLink :to="menu.titleTo" class="mega__title">
        <span>{{ menu.title }}</span>
        <svg
          class="mega__title-arrow"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path
            d="M14.3846 18.4668L20.849 12.0024L14.3822 5.53559M20.099 12.0024L3.10003 12.0024"
            stroke="currentColor"
            stroke-linecap="square"
          />
        </svg>
      </RouterLink>

      <div class="mega__grid" :class="{ 'mega__grid--featured': !!menu.featured }">
        <div class="mega__sections">
          <div v-for="(col, ci) in columns" :key="ci" class="mega__col">
            <div v-for="group in col" :key="group.title" class="mega__group">
              <RouterLink :to="group.titleTo" class="mega__group-title">
                {{ group.title }}
              </RouterLink>
              <ul v-if="group.links?.length" class="mega__list">
                <li v-for="link in group.links" :key="link.label">
                  <RouterLink :to="link.to" class="mega__link">{{ link.label }}</RouterLink>
                </li>
                <li v-if="group.explore">
                  <RouterLink :to="group.explore.to" class="mega__link mega__link--explore">
                    {{ group.explore.label }}
                    <svg
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      stroke-width="1.5"
                      aria-hidden="true"
                    >
                      <path d="M9 18L15 12L9 6" stroke="currentColor" />
                    </svg>
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <RouterLink v-if="menu.featured" :to="menu.featured.to" class="mega__featured">
          <img
            :src="menu.featured.src"
            :alt="menu.featured.alt"
            width="303"
            height="171"
            loading="lazy"
          />
          <span class="mega__featured-caption">{{ menu.featured.caption }}</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mega {
  z-index: 1030;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  box-shadow: 0 16px 32px rgba(16, 16, 16, 0.12);
  padding: 24px 0 40px;
}
.mega__title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-ink);
  text-decoration: none;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.18;
}
.mega__title-arrow {
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-6px);
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}
.mega__title:hover {
  text-decoration: underline;
}
.mega__title:hover .mega__title-arrow {
  opacity: 1;
  transform: translateX(0);
}
.mega__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-top: 24px;
}
.mega__grid--featured {
  grid-template-columns: minmax(0, 1fr) 303px;
  gap: 24px;
}
.mega__sections {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}
.mega__col {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.mega__group-title {
  display: block;
  padding: 4px 0;
  color: var(--color-ink);
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-decoration: none;
}
.mega__group-title:hover {
  text-decoration: underline;
}
.mega__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.mega__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  color: var(--color-ink);
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  text-decoration: none;
}
.mega__link:hover {
  text-decoration: underline;
}
.mega__link--explore {
  font-weight: 500;
}
.mega__featured {
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--color-ink);
  text-decoration: none;
  align-self: start;
}
.mega__featured img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  background: #f5f4f5;
}
.mega__featured-caption {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
}
.mega__featured:hover .mega__featured-caption {
  text-decoration: underline;
}

@media (max-width: 1100px) {
  .mega__grid--featured {
    grid-template-columns: 1fr;
  }
  .mega__featured {
    max-width: 360px;
  }
  .mega__sections {
    flex-wrap: wrap;
  }
  .mega__col {
    flex: 1 1 calc(50% - 12px);
  }
}
@media (max-width: 700px) {
  .mega {
    max-height: min(70vh, 560px);
    overflow: auto;
    padding-bottom: 24px;
  }
  .mega__col {
    flex: 1 1 100%;
  }
}
</style>
