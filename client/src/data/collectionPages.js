/** Collection PLP titles for /tum-urunler/:slug and /ekipmanlar/:slug. */
export const collectionTitles = {
  'kis-urunleri': 'Kış Ürünleri',
  montlar: 'Montlar',
  polarlar: 'Polarlar',
  iclikler: 'İçlikler',
  'ic-giyim': 'İç Giyim',
  'su-gecirmezler': 'Su Geçirmezler',
  yagmurluklar: 'Yağmurluklar',
  'su-gecirmez-ayakkabilar': 'Su Geçirmez Ayakkabılar',
  'evde-spor-aletleri': 'Evde Spor Aletleri',
  'kosu-bantlari-eliptik-bisikletler': 'Koşu Bantları & Eliptik Bisikletler',
  cantalar: 'Çantalar',
  coraplar: 'Çoraplar',
  semsiyeler: 'Şemsiyeler',
  'termos-ve-mataralar': 'Termos ve Mataralar',
}

export function getCollectionTitle(slug) {
  if (!slug) return ''
  return collectionTitles[slug] || slug
}
