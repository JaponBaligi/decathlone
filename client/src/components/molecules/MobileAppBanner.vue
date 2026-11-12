<script setup>
const bigImg =
  'https://contents.mediadecathlon.com/s1487410/k$b9187169de80dc03adbbff596c294057/defaut.jpg?format=auto&f=800x0'
const smallImg =
  'https://contents.mediadecathlon.com/p2864049/k$b731865289627860cbe4b147fd8831a0/defaut.jpg?format=auto&f=400x0'
const href = 'https://app.adjust.com/10earbd1'
</script>

<template>
  <!-- Live promo-banner--services-brand-identity after Katmanlı Giyim -->
  <section class="app-banner-wrap" aria-label="Decathlon Mobil Uygulama">
    <div class="app-banner">
      <div class="app-banner__head">
        <p class="app-banner__title">Decathlon Mobil Uygulama</p>
        <p class="app-banner__subtitle">Uygulamayı indir ayrıcalıklardan faydalan.</p>
        <a class="app-banner__cta" :href="href" rel="noopener" target="_blank">
          İndir!
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path d="M9 18L15 12L9 6" stroke="currentColor" />
          </svg>
        </a>
      </div>

      <div class="app-banner__assets" aria-hidden="true">
        <div class="app-banner__img app-banner__img--big">
          <img :src="bigImg" alt="" loading="lazy" />
        </div>
        <div class="app-banner__img app-banner__img--small">
          <img :src="smallImg" alt="" loading="lazy" />
        </div>
      </div>

      <div class="app-banner__spacer" aria-hidden="true" />
    </div>
  </section>
</template>

<style scoped>
.app-banner-wrap {
  padding-top: 68px;
}
.app-banner {
  display: grid;
  grid-template-columns: 1fr 350px 64px;
  column-gap: 32px;
  min-height: 212px;
  background: var(--color-brand);
  color: #fff;
}
.app-banner__head {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
  padding: 32px 0 32px 64px;
}
.app-banner__title {
  margin: 0 0 12px;
  font-family: var(--font-sans);
  font-size: 48px;
  font-weight: 600;
  line-height: 56px;
  letter-spacing: 0;
  font-variation-settings: 'opsz' 30;
}
.app-banner__subtitle {
  margin: 0 0 16px;
  max-width: 36ch;
  font-family: var(--font-sans);
  font-size: 20px;
  font-weight: 500;
  line-height: 30px;
}
.app-banner__cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: inherit;
  text-decoration: none;
}
.app-banner__cta:hover {
  text-decoration: underline;
}
.app-banner__assets {
  position: relative;
  height: 212px;
}
.app-banner__img {
  position: absolute;
  overflow: hidden;
  background: transparent;
}
.app-banner__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.app-banner__img--big {
  width: 280px;
  height: 280px;
  top: -68px;
  right: 0;
  z-index: 1;
}
.app-banner__img--small {
  width: 140px;
  height: 140px;
  top: 72px;
  right: 210px;
  z-index: 2;
}

@media (max-width: 1100px) {
  .app-banner {
    grid-template-columns: 1fr 280px 24px;
    column-gap: 16px;
  }
  .app-banner__head {
    padding-left: 32px;
  }
  .app-banner__title {
    font-size: 32px;
    line-height: 38px;
  }
  .app-banner__img--big {
    width: 220px;
    height: 220px;
  }
  .app-banner__img--small {
    width: 110px;
    height: 110px;
    right: 160px;
  }
}
@media (max-width: 760px) {
  .app-banner-wrap {
    padding-top: 24px;
  }
  .app-banner {
    grid-template-columns: 1fr;
    min-height: 0;
  }
  .app-banner__spacer {
    display: none;
  }
  .app-banner__assets {
    height: 200px;
    margin: 0 24px 24px;
  }
  .app-banner__head {
    padding: 24px;
  }
  .app-banner__img--big {
    top: 0;
    right: 0;
  }
  .app-banner__img--small {
    top: 100px;
    right: 160px;
  }
}
</style>
