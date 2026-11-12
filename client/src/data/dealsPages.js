/**
 * /deals and /deals/:slug listing configs.
 * chips[].to are app routes; filters become catalog query defaults.
 */

const img = (url) => url

/** Shared hub chips shown on /deals (and reused where live repeats them) */
export const dealsHubChips = [
  {
    label: 'İndirimler',
    image: img(
      'https://contents.mediadecathlon.com/s1365639/k$a0a2501ea3cec615f1ad82641ebb5cfb/b25a2cbd-da37-4a1f-90ca-dda379e63fcb.jpg?format=auto&f=320x0',
    ),
    to: '/deals/indirimler',
  },
  {
    label: 'İndirimli Kadın Ürünleri',
    image: img(
      'https://contents.mediadecathlon.com/s1105636/k$5f552d56262f91a0cba7f410f0312b81/d8757454-d795-44e1-bb81-b47562951601.jpg?format=auto&f=320x0',
    ),
    to: '/deals/indirimli-kadin-urunleri',
  },
  {
    label: 'İndirimli Erkek Ürünleri',
    image: img(
      'https://contents.mediadecathlon.com/s1231948/k$1217f0d10ca14be2414af2c2797b5105/0ed2830a-bac8-4ae3-ad67-c55162ddc312.jpg?format=auto&f=320x0',
    ),
    to: '/deals/indirimli-erkek-urunleri',
  },
  {
    label: 'İndirimli Çocuk Ürünleri',
    image: img(
      'https://contents.mediadecathlon.com/s1242878/k$9319b6673e3ef39c23dfa52e5cb00494/f75f0c3c-bf7c-48f8-94c6-a977520cb09e.jpg?format=auto&f=320x0',
    ),
    to: '/deals/indirimli-cocuk-urunleri',
  },
  {
    label: 'Spor İndirimleri',
    image: img(
      'https://contents.mediadecathlon.com/p2939154/k$ae5986153114ccaadfd55511cf1f7dc0/picture.jpg?format=auto&f=640x0',
    ),
    to: '/deals/spor-indirimleri',
  },
  {
    label: 'Yeni Gelenler',
    image: img(
      'https://contents.mediadecathlon.com/s1240797/k$5168be2d91700fcb132e1113064fcd44/c6b9b8f0-a849-4744-a89a-b356c3f40d1b.jpg?format=auto&f=320x0',
    ),
    to: '/deals/yeni-gelenler',
  },
  {
    label: 'Ekipman İndirimleri',
    image: img(
      'https://contents.mediadecathlon.com/p3041589/k$9525a88276046829c48a6c95edc05032/picture.jpg?format=auto&f=640x0',
    ),
    to: '/deals/ekipman-indirimleri',
  },
  {
    label: 'Giyim İndirimleri',
    image: img(
      'https://contents.mediadecathlon.com/p2939154/k$ae5986153114ccaadfd55511cf1f7dc0/picture.jpg?format=auto&f=640x0',
    ),
    to: '/deals/giyim-indirimleri',
  },
  {
    label: 'Aksesuar İndirimleri',
    image: img(
      'https://contents.mediadecathlon.com/p3016717/k$d68bf1012a9adec9b9c0010be0ffdb51/picture.jpg?format=auto&f=320x0',
    ),
    to: '/deals/aksesuar-indirimleri',
  },
  {
    label: 'Ayakkabı İndirimleri',
    image: img(
      'https://contents.mediadecathlon.com/p2617670/k$9920a2027435166f5261dc522c1ea182/picture.jpg?format=auto&f=320x0',
    ),
    to: '/deals/ayakkabi-indirimleri',
  },
]

/** @type {Record<string, { title: string, chips: Array<{label:string,image:string,to:string}>, filters?: Record<string,string>, chipCollapseAt?: number, filtersOpenDefault?: boolean }>} */
export const dealsPages = {
  // Hub: route `/deals` (no slug) — live opens filters by default
  '': {
    title: 'Fırsatlar',
    chips: dealsHubChips,
    chipCollapseAt: 7,
    filtersOpenDefault: true,
    filters: {},
  },
  indirimler: {
    title: 'İndirimler',
    // Live /deals/indirimler has no category tile row (differs from dealsHubChips)
    chips: [],
    filters: {},
  },
  'kasim-indirimleri': {
    title: 'Kasım İndirimleri',
    filters: {},
    chips: [
      {
        label: 'Kasım Ekipman İndirimleri',
        image:
          'https://contents.mediadecathlon.com/p2940138/k$9b91329decd189661fc9274d6c571df7/picture.jpg?format=auto&f=320x0',
        to: '/deals/kasim-ekipman-indirimleri',
      },
      {
        label: 'Kasım Aksesuar İndirimleri',
        image:
          'https://contents.mediadecathlon.com/p2636219/k$c396f7fca935f403115ad8cfdf91fe7a/picture.jpg?format=auto&f=640x0',
        to: '/deals/kasim-aksesuar-indirimleri',
      },
      {
        label: 'Kasım Giyim İndirimleri',
        image:
          'https://contents.mediadecathlon.com/p2875053/k$4e8f06bf8a684d9ac7f74e5ffc48c4b1/picture.jpg?format=auto&f=320x0',
        to: '/deals/kasim-giyim-indirimleri',
      },
      {
        label: 'Kasım Ayakkabı İndirimleri',
        image:
          'https://contents.mediadecathlon.com/p3095437/k$2bf6e09e27e89e3a481526b047eeefa1/picture.jpg?format=auto&f=320x0',
        to: '/deals/kasim-ayakkabi-indirimleri',
      },
    ],
  },
  'kasim-ekipman-indirimleri': {
    title: 'Kasım Ekipman İndirimleri',
    filters: { category: 'ekipman' },
    chips: [],
  },
  'kasim-aksesuar-indirimleri': {
    title: 'Kasım Aksesuar İndirimleri',
    filters: {},
    chips: [],
  },
  'kasim-giyim-indirimleri': {
    title: 'Kasım Giyim İndirimleri',
    filters: {},
    chips: [],
  },
  'kasim-ayakkabi-indirimleri': {
    title: 'Kasım Ayakkabı İndirimleri',
    filters: {},
    chips: [],
  },
  'indirimli-kadin-urunleri': {
    title: 'İndirimli Kadın Ürünleri',
    filters: { gender: 'kadin' },
    chips: [
      {
        label: 'İndirimli Kadın Giyim Ürünleri',
        image:
          'https://contents.mediadecathlon.com/p3166653/k$da257433037eb2aaa1d23f9fb8a32cae/picture.jpg?format=auto&f=320x0',
        to: '/deals/indirimli-kadin-giyim-urunleri',
      },
      {
        label: 'İndirimli Kadın Ayakkabıları',
        image:
          'https://contents.mediadecathlon.com/p2683099/k$cd2b4de147b78584431f8bdde7ffea4e/picture.jpg?format=auto&f=640x0',
        to: '/deals/indirimli-kadin-ayakkabi-urunleri',
      },
      {
        label: 'İndirimli Kadın Aksesuarları',
        image:
          'https://contents.mediadecathlon.com/p3016717/k$d68bf1012a9adec9b9c0010be0ffdb51/picture.jpg?format=auto&f=320x0',
        to: '/deals/indirimli-kadin-aksesuar-urunleri',
      },
    ],
  },
  'indirimli-erkek-urunleri': {
    title: 'İndirimli Erkek Ürünleri',
    filters: { gender: 'erkek' },
    chips: [
      {
        label: 'İndirimli Erkek Giyim Ürünleri',
        image:
          'https://contents.mediadecathlon.com/p2939154/k$ae5986153114ccaadfd55511cf1f7dc0/picture.jpg?format=auto&f=640x0',
        to: '/deals/indirimli-erkek-giyim-urunleri',
      },
      {
        label: 'İndirimli Erkek Ayakkabıları',
        image:
          'https://contents.mediadecathlon.com/p3017101/k$93805943e2c99c1d35e764c266909253/picture.jpg?format=auto&f=640x0',
        to: '/deals/indirimli-erkek-ayakkabi-urunleri',
      },
      {
        label: 'İndirimli Erkek Aksesuarları',
        image:
          'https://contents.mediadecathlon.com/p3016717/k$d68bf1012a9adec9b9c0010be0ffdb51/picture.jpg?format=auto&f=320x0',
        // Live slug typo: aksesuary
        to: '/deals/indirimli-erkek-aksesuary-urunleri',
      },
    ],
  },
  'indirimli-cocuk-urunleri': {
    title: 'İndirimli Çocuk Ürünleri',
    filters: { gender: 'cocuk' },
    chips: [
      {
        label: 'İndirimli Çocuk Giyim Ürünleri',
        image:
          'https://contents.mediadecathlon.com/p2957755/k$e979f028c5abd5ed70e251781983e5b1/picture.jpg?format=auto&f=640x0',
        to: '/deals/indirimli-cocuk-giyim-urunleri',
      },
      {
        label: 'İndirimli Çocuk Ayakkabıları',
        image:
          'https://contents.mediadecathlon.com/p2579133/k$8de426f8324176b6084ba35dcaa4780d/picture.jpg?format=auto&f=640x0',
        to: '/deals/indirimli-cocuk-ayakkabi-urunleri',
      },
      {
        label: 'İndirimli Çocuk Aksesuarları',
        image:
          'https://contents.mediadecathlon.com/p3016717/k$d68bf1012a9adec9b9c0010be0ffdb51/picture.jpg?format=auto&f=640x0',
        to: '/deals/indirimli-cocuk-aksesuar-urunleri',
      },
    ],
  },
  'spor-indirimleri': {
    title: 'Spor İndirimleri',
    filters: {},
    chipCollapseAt: 7,
    chips: [
      {
        label: 'Hiking, Trekking, Outdoor İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1232563/k$0d139b2595a4f68b45bb3aac7cc38e46/56dad6f4-8847-4efb-b2b7-a73c1efeb5b6.jpg?format=auto&f=320x0',
        to: '/deals/hiking-trekking-outdoor-indirimleri',
      },
      {
        label: 'Fitness, Pilates İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1105990/k$7287758f1183a117d73f34d8ee234300/2918eaf5-4110-4647-8d71-fabd0608f8d3.jpg?format=auto&f=320x0',
        to: '/deals/fitness-pilates-indirimleri',
      },
      {
        label: 'Su Sporları İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1236086/k$352f4c4449b2985ec1191eec46b065fb/f2d6ad8e-c5bc-4678-821d-8fa3c22c5f93.jpg?format=auto&f=320x0',
        to: '/deals/yuzme-indirimleri',
      },
      {
        label: 'Koşu ve Yürüyüş İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1206429/k$8eaf1d0dd26cb9acfddc124fa7cfe0e8/1b7a2f75-07ba-4b68-91f6-550a32226f8a.jpg?format=auto&f=320x0',
        to: '/deals/kosu-ve-yuruyus-indirimleri',
      },
      {
        label: 'Mobilite İndirimleri',
        image:
          'https://contents.mediadecathlon.com/p2075811/k$e0786034cb5675c54df89e52ca0f32e6/2e9ca215-39ce-4a14-ae94-11785d866e72.jpg?format=auto&f=320x0',
        to: '/deals/mobilite-firsatlari',
      },
      {
        label: 'Kamp İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1233126/k$b71eebea59a158db2f96f729236d78c2/13d35116-86fa-4815-a918-6c34bb113975.jpg?format=auto&f=320x0',
        to: '/deals/kamp-indirimleri',
      },
      {
        label: 'Yoga İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1235509/k$d3e961ea9b41c3b15189712a79dc52dd/aedd598b-6f28-4dcd-920e-13c8e5306f6c.jpg?format=auto&f=320x0',
        to: '/deals/yoga-indirimleri',
      },
      {
        label: 'Tenis İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1206335/k$74047e7ba667438ee2cfe454b96acb30/74005def-1f0f-434c-a23d-698e31979ea4.jpg?format=auto&f=320x0',
        to: '/deals/tenis-indirimleri',
      },
      {
        label: 'Masa Tenisi İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1243243/k$94541430a9dfabdc0ae315a14c333b44/b85ebefb-81b4-44cb-8c9a-e3b142601a72.jpg?format=auto&f=320x0',
        to: '/deals/masa-tenisi-indirimleri',
      },
      {
        label: 'Binicilik İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1243227/k$c4d94766232209dc6635aeb8a01fa2ca/02deacf6-73f3-44e4-8336-b86184836f6b.jpg?format=auto&f=320x0',
        to: '/deals/binicilik-indirimleri',
      },
      {
        label: 'Balıkçılık İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1140769/k$56f4a6001fee378ca2594a56b4c99374/dd2c3aae-3aa0-40f4-aff4-26e6258a706a.jpg?format=auto&f=320x0',
        to: '/deals/balikcilik-indirimleri',
      },
      {
        label: 'Avcılık ve Doğa Gözlemi İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1232494/k$54c8768e79b8a27c79fb174be83f8280/94a9338b-0b14-4aca-8a56-53cb8bb3dd0f.jpg?format=auto&f=320x0',
        to: '/deals/avcilik-indirimleri',
      },
      {
        label: 'Kayak, Snowboard İndirimleri',
        image:
          'https://contents.mediadecathlon.com/p2658896/k$ae72210eefe765b1224debbcc43f6dde/c40bbb81-12e5-4958-b279-ee2f18771e51.jpg?format=auto&f=320x0',
        to: '/deals/kayak-snowboard-indirimleri',
      },
      {
        label: 'Futbol İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1243273/k$d9564a4ec8ad57181c6085fff1577f74/dc9b380d-c4a3-4183-b793-71bbbc843e29.jpg?format=auto&f=320x0',
        to: '/deals/takim-sporlari-indirimleri',
      },
      {
        label: 'Tırmanış ve Dağcılık İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1236082/k$2176f3fb5fbe2e8a19446ff3b460cb0f/af21bd4c-9c1f-46f4-a3ed-2627e7961e9f.jpg?format=auto&f=320x0',
        to: '/deals/tirmanis-ve-dagcilik-indirimleri',
      },
      {
        label: 'Okçuluk ve Hedef Sporları İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1206061/k$9b9a4e0141a494c4b618f66058ad7897/92df6a0d-cedd-4269-a0f8-b05ef3419f59.jpg?format=auto&f=320x0',
        to: '/deals/okculuk-ve-hedef-sporlari-indirimleri',
      },
      {
        label: 'Basketbol İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1103974/k$c7113fc9718e23ea4dcd78c81ba5f6e8/f6997858-8115-4de8-995a-30c24b0f0a42.jpg?format=auto&f=320x0',
        to: '/deals/basketbol-indirimleri',
      },
      {
        label: 'Voleybol İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1248674/k$977eac1d0125e5fddc86847b8e21e7b4/7c638ae1-17b2-4e23-bcc3-43bad10abfaf.jpg?format=auto&f=320x0',
        to: '/deals/voleybol-indirimleri',
      },
      {
        label: 'Bale İndirimleri',
        image:
          'https://contents.mediadecathlon.com/s1209831/k$e0e1f2e3febc773f57306c95765fe499/3ec2f46d-d3fb-44fe-841d-f1e865a2ca23.jpg?format=auto&f=320x0',
        to: '/deals/bale-indirimleri',
      },
    ],
  },
  'yeni-gelenler': {
    // Live h1 differs from hub chip label “Yeni Gelenler”
    title: 'Yeni Gelen Ürünler',
    filters: { sort: 'newest' },
    chips: [],
  },
  'ekipman-indirimleri': {
    title: 'Ekipman İndirimleri',
    filters: { category: 'ekipman' },
    chips: [],
  },
  'giyim-indirimleri': {
    title: 'Giyim İndirimleri',
    filters: {},
    chips: [
      {
        label: 'Mont İndirimleri',
        image:
          'https://contents.mediadecathlon.com/p2939154/k$ae5986153114ccaadfd55511cf1f7dc0/picture.jpg?format=auto&f=640x0',
        to: '/deals/mont-indirimleri',
      },
      {
        label: 'Pantolon İndirimleri',
        image:
          'https://contents.mediadecathlon.com/p2599126/k$f1a29e270372e352aa3933e9687f9b5b/picture.jpg?format=auto&f=640x0',
        to: '/deals/pantolon-indirimleri',
      },
      {
        label: 'Polar ve Kazak İndirimleri',
        image:
          'https://contents.mediadecathlon.com/p2938992/k$a61166607645b7ea16a60a136ecfd841/picture.jpg?format=auto&f=640x0',
        to: '/deals/polar-ve-kazak-indirimleri',
      },
      {
        label: 'Yağmurluk İndirimleri',
        image:
          'https://contents.mediadecathlon.com/p2907617/k$d182c8f2864401ec0cd5a9861e0ee0d1/picture.jpg?format=auto&f=320x0',
        to: '/deals/yagmurluk-indirimleri',
      },
      {
        label: 'İç Giyim İndirimleri',
        image:
          'https://contents.mediadecathlon.com/p2957755/k$e979f028c5abd5ed70e251781983e5b1/picture.jpg?format=auto&f=640x0',
        to: '/deals/ic-giyim-indirimleri',
      },
      {
        label: 'Sweatshirt İndirimleri',
        image:
          'https://contents.mediadecathlon.com/p2731204/k$26273a21c90c4397e5766b897f8170df/picture.jpg?format=auto&f=640x0',
        to: '/deals/sweatshirt-indirimleri',
      },
    ],
  },
  'aksesuar-indirimleri': {
    title: 'Aksesuar İndirimleri',
    filters: {},
    chips: [],
  },
  'ayakkabi-indirimleri': {
    title: 'Ayakkabı İndirimleri',
    filters: {},
    chips: [],
  },
  // Nested chips from kadın PLP
  'indirimli-kadin-giyim-urunleri': {
    title: 'İndirimli Kadın Giyim Ürünleri',
    filters: { gender: 'kadin' },
    chips: [],
  },
  'indirimli-kadin-ayakkabi-urunleri': {
    title: 'İndirimli Kadın Ayakkabıları',
    filters: { gender: 'kadin' },
    chips: [],
  },
  'indirimli-kadin-aksesuar-urunleri': {
    title: 'İndirimli Kadın Aksesuarları',
    filters: { gender: 'kadin' },
    chips: [],
  },
  // Nested from erkek PLP
  'indirimli-erkek-giyim-urunleri': {
    title: 'İndirimli Erkek Giyim Ürünleri',
    filters: { gender: 'erkek' },
    chips: [],
  },
  'indirimli-erkek-ayakkabi-urunleri': {
    title: 'İndirimli Erkek Ayakkabıları',
    filters: { gender: 'erkek' },
    chips: [],
  },
  'indirimli-erkek-aksesuary-urunleri': {
    title: 'İndirimli Erkek Aksesuarları',
    filters: { gender: 'erkek' },
    chips: [],
  },
  // Nested from çocuk PLP
  'indirimli-cocuk-giyim-urunleri': {
    title: 'İndirimli Çocuk Giyim Ürünleri',
    filters: { gender: 'cocuk' },
    chips: [],
  },
  'indirimli-cocuk-ayakkabi-urunleri': {
    title: 'İndirimli Çocuk Ayakkabıları',
    filters: { gender: 'cocuk' },
    chips: [],
  },
  'indirimli-cocuk-aksesuar-urunleri': {
    title: 'İndirimli Çocuk Aksesuarları',
    filters: { gender: 'cocuk' },
    chips: [],
  },
  // Nested from giyim PLP
  'mont-indirimleri': {
    title: 'Mont İndirimleri',
    chips: [],
  },
  'pantolon-indirimleri': {
    title: 'Pantolon İndirimleri',
    chips: [],
  },
  'polar-ve-kazak-indirimleri': {
    title: 'Polar ve Kazak İndirimleri',
    chips: [],
  },
  'yagmurluk-indirimleri': {
    title: 'Yağmurluk İndirimleri',
    chips: [],
  },
  'ic-giyim-indirimleri': {
    title: 'İç Giyim İndirimleri',
    chips: [],
  },
  'sweatshirt-indirimleri': {
    title: 'Sweatshirt İndirimleri',
    chips: [],
  },
  // Nested from spor PLP
  'hiking-trekking-outdoor-indirimleri': {
    title: 'Hiking, Trekking, Outdoor İndirimleri',
    chips: [],
  },
  'fitness-pilates-indirimleri': {
    title: 'Fitness, Pilates İndirimleri',
    chips: [],
  },
  'yuzme-indirimleri': {
    title: 'Su Sporları İndirimleri',
    chips: [],
  },
  'kosu-ve-yuruyus-indirimleri': {
    title: 'Koşu ve Yürüyüş İndirimleri',
    chips: [],
  },
  'mobilite-firsatlari': {
    title: 'Mobilite İndirimleri',
    chips: [],
  },
  'kamp-indirimleri': {
    title: 'Kamp İndirimleri',
    chips: [],
  },
  'yoga-indirimleri': {
    title: 'Yoga İndirimleri',
    chips: [],
  },
  'tenis-indirimleri': {
    title: 'Tenis İndirimleri',
    chips: [],
  },
  'masa-tenisi-indirimleri': {
    title: 'Masa Tenisi İndirimleri',
    chips: [],
  },
  'binicilik-indirimleri': {
    title: 'Binicilik İndirimleri',
    chips: [],
  },
  'balikcilik-indirimleri': {
    title: 'Balıkçılık İndirimleri',
    chips: [],
  },
  'avcilik-indirimleri': {
    title: 'Avcılık ve Doğa Gözlemi İndirimleri',
    chips: [],
  },
  'kayak-snowboard-indirimleri': {
    title: 'Kayak, Snowboard İndirimleri',
    chips: [],
  },
  'takim-sporlari-indirimleri': {
    title: 'Futbol İndirimleri',
    chips: [],
  },
  'tirmanis-ve-dagcilik-indirimleri': {
    title: 'Tırmanış ve Dağcılık İndirimleri',
    chips: [],
  },
  'okculuk-ve-hedef-sporlari-indirimleri': {
    title: 'Okçuluk ve Hedef Sporları İndirimleri',
    chips: [],
  },
  'basketbol-indirimleri': {
    title: 'Basketbol İndirimleri',
    chips: [],
  },
  'voleybol-indirimleri': {
    title: 'Voleybol İndirimleri',
    chips: [],
  },
  'bale-indirimleri': {
    title: 'Bale İndirimleri',
    chips: [],
  },
}

function titleFromSlug(slug) {
  return String(slug || '')
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Resolve PLP config for /deals or /deals/:slug */
export function getDealsPage(slug) {
  const key = slug ? String(slug) : ''
  const page = dealsPages[key]
  if (page) return { slug: key, ...page }
  return {
    slug: key,
    title: titleFromSlug(key) || 'Fırsatlar',
    chips: [],
    filters: {},
  }
}
