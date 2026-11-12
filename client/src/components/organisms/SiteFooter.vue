<script setup>
import { RouterLink } from 'vue-router'
import BaseLogo from '@/components/atoms/BaseLogo.vue'

const reassurances = [
  {
    to: '/sayfa/garanti-kosullari',
    label: '2 Yıl Garanti',
    description:
      "Decathlon'dan aldığınız ürünlerin standart garantisi 2 yıl olup, bazı ürünler ek garantiden faydalanabilir.",
  },
  {
    to: '/sayfa/teslimat-bilgileri',
    label: 'Ücretsiz Mağazadan Teslimat',
    description:
      'Kargo ücreti ödemeden siparişini Mağazaya Teslimat seçeneğiyle tamamlayabilir, ürünlerini seçtiğin mağazadan 14 gün içinde teslim alabilirsin.',
  },
  {
    to: '/sayfa/iade-politikasi',
    label: '60 Gün İade',
    description:
      'Decathlon hesabınızla yaptığınız nakit ödemelerde fiş olmadan kolayca iade veya değişim yapabilirsiniz.',
  },
  {
    to: '/sayfa/odeme-secenekleri',
    label: 'Güvenli Ödeme',
    description: 'Tüm işlemleriniz güvenli ödeme sistemleri ile korunmaktadır.',
  },
]

const loyaltyLinks = [
  {
    href: 'https://app.adjust.com/10earbd1',
    label: 'Decathlon Uygulamasını İndirin',
    emoji: '📱',
    external: true,
  },
  {
    to: '/sayfa/member-avantajlari',
    label: 'Decathlon Member',
    external: false,
  },
]

const socials = [
  {
    href: 'https://www.facebook.com/decathlonturkiye',
    label: 'Facebook',
    path: 'M22 12.0607C22 6.504 17.5233 2 12 2C6.47667 2 2 6.504 2 12.0607C2 17.0833 5.656 21.2453 10.4373 22V14.9693H7.89867V12.06H10.4373V9.844C10.4373 7.32267 11.93 5.92933 14.2147 5.92933C15.308 5.92933 16.4533 6.126 16.4533 6.126V8.602H15.1913C13.9493 8.602 13.5627 9.378 13.5627 10.174V12.0607H16.336L15.8927 14.9687H13.5627V22C18.344 21.2453 22 17.0833 22 12.0607Z',
  },
  {
    href: 'https://www.youtube.com/user/DecathlonTurkiye',
    label: 'YouTube',
    path: 'M19.792 5.41483C20.6521 5.64589 21.3325 6.32626 21.5635 7.18633C21.9872 8.75244 22 12.0002 22 12.0002C22 12.0002 22 15.2608 21.5764 16.8141C21.3453 17.6741 20.665 18.3545 19.8049 18.5856C18.2516 19.0092 12 19.0092 12 19.0092C12 19.0092 5.74839 19.0092 4.19512 18.5856C3.33504 18.3545 2.65469 17.6741 2.42362 16.8141C2 15.248 2 12.0002 2 12.0002C2 12.0002 2 8.75244 2.41078 7.19917C2.64185 6.33909 3.32221 5.65873 4.18229 5.42767C5.73556 5.00404 11.9872 4.99121 11.9872 4.99121C11.9872 4.99121 18.2388 4.99121 19.792 5.41483ZM15.1836 12.0002L9.99743 15.004V8.99635L15.1836 12.0002Z',
    evenodd: true,
  },
  {
    href: 'https://www.instagram.com/decathlonturkey/',
    label: 'Instagram',
    compound: true,
  },
  {
    href: 'https://www.linkedin.com/company/decathlon-group/',
    label: 'LinkedIn',
    path: 'M2 4.66881C2 4.02529 2.22523 3.49441 2.67568 3.07614C3.12612 2.65786 3.71172 2.44873 4.43243 2.44873C5.14029 2.44873 5.71299 2.65464 6.15058 3.06649C6.60102 3.4912 6.82626 4.0446 6.82626 4.72672C6.82626 5.34448 6.60747 5.85927 6.16988 6.27112C5.71944 6.69584 5.12741 6.90819 4.39382 6.90819H4.37452C3.66666 6.90819 3.09396 6.69584 2.65637 6.27112C2.21878 5.84641 2 5.3123 2 4.66881ZM2.25097 21.5607V8.66495H6.53668V21.5607H2.25097ZM8.9112 21.5607H13.1969V14.3599C13.1969 13.9095 13.2484 13.562 13.3514 13.3175C13.5315 12.8799 13.805 12.5099 14.1718 12.2074C14.5386 11.905 14.9987 11.7538 15.5521 11.7538C16.9936 11.7538 17.7143 12.7254 17.7143 14.6688V21.5607H22V14.1669C22 12.2621 21.5496 10.8175 20.6486 9.8329C19.7477 8.84834 18.5573 8.35607 17.0772 8.35607C15.417 8.35607 14.1236 9.07035 13.1969 10.4989V10.5375H13.1776L13.1969 10.4989V8.66495H8.9112C8.93693 9.07678 8.94981 10.3573 8.94981 12.5066C8.94981 14.6559 8.93693 17.6739 8.9112 21.5607Z',
  },
]

const columns = [
  {
    title: 'Hakkımızda',
    links: [
      { to: '/sayfa/biz-kimiz', label: 'Biz Kimiz?' },
      { to: '/magazalar', label: 'Mağazalarımız' },
      { to: '/sayfa/bize-ulasin', label: 'Bize Ulaşın' },
      { to: '/sayfa/uyelik-sozlesmesi', label: 'Üyelik Sözleşmesi' },
      { to: '/sayfa/bilgi-toplumu-hizmetleri', label: 'Bilgi Toplumu Hizmetleri' },
      { to: '/sayfa/degerlerimiz', label: 'Değerlerimiz' },
      { to: '/sayfa/kalite-politikasi', label: 'Entegre Yönetim Sistemi Politikası' },
    ],
  },
  {
    title: 'İşlem Rehberi',
    links: [
      { to: '/sayfa/member-avantajlari', label: 'Decathlon Member Avantajları' },
      { to: '/sayfa/teslimat-bilgileri', label: 'Teslimat Bilgileri' },
      { to: '/sayfa/garanti-kosullari', label: 'Garanti Şartları' },
      { to: '/sayfa/atolye', label: 'Bakım ve Onarım' },
      { to: '/sayfa/sss', label: 'SSS' },
      { to: '/sayfa/urun-geri-cagirma', label: 'Ürün Geri Çağırma' },
      { to: '/sayfa/iade-politikasi', label: 'İade Politikası' },
      { to: '/sayfa/odeme-secenekleri', label: 'Ödeme Seçenekleri' },
      { to: '/sayfa/yasal-bildirimler', label: 'Ürün Sıralama Bilgilendirmesi' },
    ],
  },
  {
    title: 'Popüler Kategoriler',
    links: [
      { to: '/tum-urunler?q=mont', label: 'Montlar' },
      { to: '/tum-urunler?q=%C5%9Femsiye', label: 'Şemsiyeler' },
      { to: '/tum-urunler?q=fitness', label: 'Fitness Aletleri' },
      { to: '/tum-urunler?q=i%C3%A7lik', label: 'İçlikler' },
      { to: '/tum-urunler?q=polar', label: 'Polarlar' },
      { to: '/tum-sporlar', label: 'Outdoor Ürünler' },
      { to: '/tum-urunler?q=kayak', label: 'Kayak Ekipmanları' },
      { to: '/tum-urunler?q=ko%C5%9Fu', label: 'Koşu Ayakkabıları' },
      { to: '/tum-urunler?q=kamp', label: 'Kamp Ürünleri' },
      { to: '/tum-urunler?q=bal%C4%B1k', label: 'Balıkçılık Malzemeleri' },
    ],
  },
]

const legalLinks = [
  { to: '/sayfa/uyelik-sozlesmesi', label: 'Üyelik Sözleşmesi' },
  { to: '/sayfa/kvkk', label: 'Kişisel Verilerin Korunması' },
  { to: '/sayfa/yasal-bildirimler', label: 'Yasal Bildirimler' },
  { to: '/sayfa/cerez-politikasi', label: 'Çerez Politikası' },
  { to: '/sayfa/gizlilik', label: 'Gizlilik ve Güvenlik' },
  { to: '/sayfa/bilgi-toplumu-hizmetleri', label: 'Bilgi Toplumu Hizmetleri' },
]

const etbisSrc =
  'https://contents.mediadecathlon.com/s1466697/k$3cb8aabbc74b22e6aaa2d91bb1568d06/etbis.png?format=auto&f=320x0'
const etbisHref =
  'https://etbis.ticaret.gov.tr/tr/SiteSorgulamaSonuc?siteId=0ef7f90e-06d4-425b-bc0e-31186b851dcc'

function openCookieSettings() {
  window.dispatchEvent(new CustomEvent('decathlon:open-cookie-settings'))
}
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <ul class="footer__reassurances">
        <li v-for="item in reassurances" :key="item.label">
          <RouterLink :to="item.to" class="reassure">
            <span class="reassure__label">{{ item.label }}</span>
            <span class="reassure__desc">{{ item.description }}</span>
          </RouterLink>
        </li>
      </ul>

      <div class="footer__links">
        <div class="footer__loyalty">
          <ul class="loyalty">
            <li v-for="link in loyaltyLinks" :key="link.label">
              <a
                v-if="link.external"
                class="loyalty__link"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="loyalty__label"
                  >{{ link.label }}<template v-if="link.emoji"> {{ link.emoji }}</template></span
                >
                <svg
                  class="loyalty__arrow"
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
              </a>
              <RouterLink v-else class="loyalty__link" :to="link.to">
                <span class="loyalty__label">{{ link.label }}</span>
                <svg
                  class="loyalty__arrow"
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
            </li>
          </ul>

          <div class="socials">
            <a
              v-for="social in socials"
              :key="social.label"
              class="socials__btn"
              :href="social.href"
              :aria-label="`${social.label} bağlantısı`"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg v-if="social.compound" viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 3C9.5556 3 9.2496 3.0102 8.2896 3.054C7.3314 3.0978 6.6768 3.2502 6.1044 3.4728C5.5044 3.6984 4.9602 4.0524 4.5102 4.5108C4.05253 4.96028 3.69831 5.5041 3.4722 6.1044C3.2508 6.6768 3.0978 7.332 3.054 8.2902C3.0108 9.2496 3 9.555 3 12C3 14.445 3.0102 14.7504 3.054 15.7104C3.0978 16.6686 3.2502 17.3232 3.4728 17.8956C3.6984 18.4956 4.0524 19.0398 4.5108 19.4898C4.96029 19.9475 5.50411 20.3017 6.1044 20.5278C6.6768 20.7498 7.3314 20.9022 8.2896 20.946C9.2496 20.9898 9.5556 21 12 21C14.4444 21 14.7504 20.9898 15.7104 20.946C16.6686 20.9022 17.3232 20.7498 17.8956 20.5272C18.4956 20.3016 19.0398 19.9476 19.4898 19.4892C19.9475 19.0397 20.3017 18.4959 20.5278 17.8956C20.7498 17.3232 20.9022 16.6686 20.946 15.7104C20.9898 14.7504 21 14.4444 21 12C21 9.5556 20.9898 9.2496 20.946 8.2896C20.9022 7.3314 20.7498 6.6768 20.5272 6.1044C20.3012 5.50384 19.947 4.95979 19.4892 4.5102C19.0397 4.05253 18.4959 3.69831 17.8956 3.4722C17.3232 3.2508 16.668 3.0978 15.7098 3.054C14.7504 3.0108 14.445 3 12 3ZM12 4.6218C14.403 4.6218 14.688 4.6308 15.6372 4.674C16.5144 4.7142 16.9908 4.86 17.3082 4.9842C17.7282 5.1468 18.0282 5.3424 18.3432 5.6568C18.6582 5.9718 18.8532 6.2718 19.0158 6.6918C19.1394 7.0092 19.2858 7.4856 19.326 8.3628C19.3692 9.312 19.3782 9.597 19.3782 12C19.3782 14.403 19.3692 14.688 19.326 15.6372C19.2858 16.5144 19.14 16.9908 19.0158 17.3082C18.8718 17.6991 18.6419 18.0528 18.3432 18.3432C18.0528 18.642 17.6992 18.8718 17.3082 19.0158C16.9908 19.1394 16.5144 19.2858 15.6372 19.326C14.688 19.3692 14.4036 19.3782 12 19.3782C9.5964 19.3782 9.312 19.3692 8.3628 19.326C7.4856 19.2858 7.0092 19.14 6.6918 19.0158C6.30087 18.8718 5.9472 18.6419 5.6568 18.3432C5.35811 18.0528 5.12828 17.6991 4.9842 17.3082C4.8606 16.9908 4.7142 16.5144 4.674 15.6372C4.6308 14.688 4.6218 14.403 4.6218 12C4.6218 9.597 4.6308 9.312 4.674 8.3628C4.7142 7.4856 4.86 7.0092 4.9842 6.6918C5.1468 6.2718 5.3424 5.9718 5.6568 5.6568C5.94716 5.35803 6.30085 5.12819 6.6918 4.9842C7.0092 4.8606 7.4856 4.7142 8.3628 4.674C9.312 4.6308 9.597 4.6218 12 4.6218Z"
                  fill="currentColor"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 15.003C11.6056 15.003 11.2151 14.9254 10.8508 14.7744C10.4865 14.6235 10.1554 14.4023 9.87656 14.1235C9.5977 13.8446 9.3765 13.5136 9.22559 13.1492C9.07467 12.7849 8.997 12.3944 8.997 12C8.997 11.6057 9.07467 11.2152 9.22559 10.8508C9.3765 10.4865 9.5977 10.1554 9.87656 9.87659C10.1554 9.59774 10.4865 9.37654 10.8508 9.22562C11.2151 9.07471 11.6056 8.99703 12 8.99703C12.7964 8.99703 13.5603 9.31342 14.1234 9.87659C14.6866 10.4398 15.003 11.2036 15.003 12C15.003 12.7965 14.6866 13.5603 14.1234 14.1235C13.5603 14.6866 12.7964 15.003 12 15.003ZM12 7.37403C10.7731 7.37403 9.59647 7.86141 8.72892 8.72896C7.86138 9.5965 7.374 10.7731 7.374 12C7.374 13.2269 7.86138 14.4036 8.72892 15.2711C9.59647 16.1387 10.7731 16.626 12 16.626C13.2269 16.626 14.4035 16.1387 15.2711 15.2711C16.1386 14.4036 16.626 13.2269 16.626 12C16.626 10.7731 16.1386 9.5965 15.2711 8.72896C14.4035 7.86141 13.2269 7.37403 12 7.37403ZM17.9718 7.29003C17.9718 7.58005 17.8566 7.85818 17.6515 8.06325C17.4464 8.26833 17.1683 8.38353 16.8783 8.38353C16.5883 8.38353 16.3101 8.26833 16.1051 8.06325C15.9 7.85818 15.7848 7.58005 15.7848 7.29003C15.7848 7.00002 15.9 6.72188 16.1051 6.51681C16.3101 6.31174 16.5883 6.19653 16.8783 6.19653C17.1683 6.19653 17.4464 6.31174 17.6515 6.51681C17.8566 6.72188 17.9718 7.00002 17.9718 7.29003Z"
                  fill="currentColor"
                />
              </svg>
              <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path
                  :fill-rule="social.evenodd ? 'evenodd' : undefined"
                  :clip-rule="social.evenodd ? 'evenodd' : undefined"
                  :d="social.path"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>

        <nav
          v-for="column in columns"
          :key="column.title"
          class="footer__col"
          :aria-label="column.title"
        >
          <h2 class="footer__col-title">{{ column.title }}</h2>
          <ul class="footer__col-list">
            <li v-for="link in column.links" :key="link.label">
              <RouterLink :to="link.to">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </nav>
      </div>

      <div class="footer__brand">
        <BaseLogo inverted />
      </div>

      <div class="footer__legal">
        <div class="footer__legal-links">
          <RouterLink v-for="link in legalLinks" :key="link.label" :to="link.to">
            {{ link.label }}
          </RouterLink>
          <button type="button" class="footer__cookie-btn" @click="openCookieSettings">
            Çerezlerimi yapılandır
          </button>
        </div>
        <!-- Live wnf-footer__legal-content__disclaimers (empty) keeps a second 24px flex gap -->
        <div class="footer__disclaimers" aria-hidden="true"></div>
        <a class="footer__etbis" :href="etbisHref" target="_blank" rel="noopener noreferrer">
          <img :src="etbisSrc" alt="ETBIS" width="100" height="115" loading="lazy" />
        </a>
      </div>

      <div class="footer__bottom">
        <span class="footer__copyright">
          © Decathlon - Turksport Spor Ürünleri San. ve Tic. Ltd. Şti. Tüm Hakları Saklıdır.
        </span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 0;
  background: var(--color-brand);
  color: #fff;
  /* Live wnf-footer top pad */
  padding-top: 64px;
}

.footer__inner {
  padding-top: 0;
  padding-bottom: 0;
}

.footer__reassurances {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px 24px;
}

.reassure {
  display: flex;
  flex-direction: column;
  color: #fff;
  text-decoration: none;
}

.reassure__label {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.1;
}

.reassure__desc {
  margin-top: 4px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.38;
  color: #fff;
}

.footer__links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0 24px;
  padding: 96px 0;
}

.loyalty {
  list-style: none;
  margin: 0;
  padding: 0;
}

.loyalty li {
  margin-bottom: 16px;
}

.loyalty__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-decoration: none;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.18;
}

.loyalty__arrow {
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-6px);
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.loyalty__link:hover .loyalty__label {
  text-decoration: underline;
}

.loyalty__link:hover .loyalty__arrow {
  opacity: 1;
  transform: translateX(0);
}

.socials {
  display: flex;
  flex-wrap: wrap;
  margin-top: 24px;
}

.socials__btn {
  /* Live vp-icon-button--small: 32×32, 16px glyph, 0.8px ring */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: 0 12px 12px 0;
  border: 0.8px solid #fff;
  border-radius: 999px;
  color: #fff;
  text-decoration: none;
  box-sizing: border-box;
}

.socials__btn svg {
  width: 16px;
  height: 16px;
  display: block;
}

.socials__btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.footer__col-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.29;
  text-transform: uppercase;
  color: #fff;
}

.footer__col-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.footer__col-list li {
  margin-bottom: 4px;
}

.footer__col-list a {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.43;
  text-decoration: none;
}

.footer__col-list a:hover {
  text-decoration: underline;
}

.footer__brand {
  /* Live .wnf-footer__logo */
  height: 32px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.footer__legal {
  display: flex;
  flex-direction: column;
  gap: 24px;
  /* Live .wnf-footer__legal-content */
  padding: 16px 0;
}

.footer__legal-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
}

.footer__legal-links a,
.footer__cookie-btn {
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.33;
  text-decoration: none;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
}

.footer__legal-links a:hover,
.footer__cookie-btn:hover {
  text-decoration: underline;
}

.footer__disclaimers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  min-height: 0;
}

.footer__etbis {
  display: block;
  width: fit-content;
  line-height: 0;
  background: transparent;
}

.footer__etbis img {
  display: block;
  /* Live paints ~115.4×100 from 130×150 asset (alpha = blue shade) */
  width: 100px;
  height: 115px;
  object-fit: fill;
  background: transparent;
}

.footer__bottom {
  display: flex;
  justify-content: flex-end;
  /* Live .wnf-footer__bottom */
  padding: 0 0 40px;
}

.footer__copyright {
  margin: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.33;
  color: rgba(255, 255, 255, 0.75);
}

@media (max-width: 1024px) {
  .footer__reassurances,
  .footer__links {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer__links {
    padding: 64px 0;
  }
}

@media (max-width: 640px) {
  .footer__reassurances,
  .footer__links {
    grid-template-columns: 1fr;
  }

  .footer__links {
    padding: 48px 0;
    gap: 40px 0;
  }

  .reassure__label,
  .loyalty__link {
    font-size: 18px;
  }

  .footer__bottom {
    justify-content: flex-start;
  }
}
</style>
