import bcrypt from 'bcryptjs'
import { readFileSync, readdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { db } from './connection.js'
import { migrate } from './schema.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

function slugify(text) {
  return String(text || 'urun')
    .toLowerCase()
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ı', 'i')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

migrate()

db.exec(`
  DELETE FROM order_items;
  DELETE FROM orders;
  DELETE FROM wishlists;
  DELETE FROM cart_items;
  DELETE FROM carts;
  DELETE FROM addresses;
  DELETE FROM product_images;
  DELETE FROM product_variants;
  DELETE FROM products;
  DELETE FROM cms_pages;
  DELETE FROM stores;
  DELETE FROM categories;
  DELETE FROM sports;
  DELETE FROM brands;
  DELETE FROM users;
`)

const hash = bcrypt.hashSync('demo1234', 10)
const user = db
  .prepare(
    `INSERT INTO users (email, password_hash, first_name, last_name, phone)
     VALUES (?, ?, ?, ?, ?)`
  )
  .run('demo@decathlon.local', hash, 'Demo', 'Kullanıcı', '05321234567')

db.prepare(
  `INSERT INTO addresses (user_id, title, full_name, phone, city, district, line1, is_default)
   VALUES (?, ?, ?, ?, ?, ?, ?, 1)`
).run(user.lastInsertRowid, 'Ev', 'Demo Kullanıcı', '05321234567', 'İstanbul', 'Kadıköy', 'Caferağa Mah. Moda Cad. No:12')

const brandRows = [
  ['decathlon', 'DECATHLON'],
  ['quechua', 'QUECHUA'],
  ['kipsta', 'KIPSTA'],
  ['domyos', 'DOMYOS'],
  ['artengo', 'ARTENGO'],
  ['forclaz', 'FORCLAZ'],
  ['olaiian', 'OLAIAN'],
  ['wedze', 'WEDZE'],
  ['caperlan', 'CAPERLAN'],
  ['solognac', 'SOLOGNAC'],
  ['babolat', 'BABOLAT'],
  ['usr', 'USR'],
  ['proforce', 'PROFORCE'],
  ['oxelo', 'OXELO'],
  ['btwin', 'BTWIN'],
  ['arena', 'ARENA'],
]

const insertBrand = db.prepare('INSERT INTO brands (slug, name) VALUES (?, ?)')
const brands = Object.fromEntries(brandRows.map(([slug, name]) => [slug, insertBrand.run(slug, name).lastInsertRowid]))

const sportRows = [
  ['futbol', 'Futbol'],
  ['kosu', 'Koşu'],
  ['fitness', 'Fitness'],
  ['kamp', 'Kamp'],
  ['yuruyus', 'Yürüyüş'],
  ['kayak', 'Kayak'],
  ['yuzme', 'Yüzme'],
  ['tenis', 'Tenis'],
  ['balikcilik', 'Balıkçılık'],
  ['avcilik', 'Avcılık'],
  ['dagcilik', 'Dağcılık'],
  ['boks', 'Boks'],
]

const insertSport = db.prepare('INSERT INTO sports (slug, name) VALUES (?, ?)')
const sports = Object.fromEntries(sportRows.map(([slug, name]) => [slug, insertSport.run(slug, name).lastInsertRowid]))

const insertCat = db.prepare(
  `INSERT INTO categories (slug, name, parent_id, gender, sort_order) VALUES (?, ?, ?, ?, ?)`
)

const rootCats = {
  erkek: insertCat.run('erkek', 'Erkek', null, 'erkek', 1).lastInsertRowid,
  kadin: insertCat.run('kadin', 'Kadın', null, 'kadin', 2).lastInsertRowid,
  cocuk: insertCat.run('cocuk', 'Çocuk', null, 'cocuk', 3).lastInsertRowid,
  ekipman: insertCat.run('ekipman', 'Ekipman', null, null, 4).lastInsertRowid,
  kampanyalar: insertCat.run('kampanyalar', 'Kampanyalar', null, null, 5).lastInsertRowid,
}

const subCats = {
  erkekGiyim: insertCat.run('erkek-giyim', 'Erkek Giyim', rootCats.erkek, 'erkek', 1).lastInsertRowid,
  erkekAyakkabi: insertCat.run('erkek-ayakkabi', 'Erkek Ayakkabı', rootCats.erkek, 'erkek', 2).lastInsertRowid,
  kadinGiyim: insertCat.run('kadin-giyim', 'Kadın Giyim', rootCats.kadin, 'kadin', 1).lastInsertRowid,
  kadinAyakkabi: insertCat.run('kadin-ayakkabi', 'Kadın Ayakkabı', rootCats.kadin, 'kadin', 2).lastInsertRowid,
  cocukGiyim: insertCat.run('cocuk-giyim', 'Çocuk Giyim', rootCats.cocuk, 'cocuk', 1).lastInsertRowid,
  outdoor: insertCat.run('outdoor', 'Outdoor', rootCats.ekipman, null, 1).lastInsertRowid,
  fitnessEkipman: insertCat.run('fitness-ekipman', 'Fitness Ekipman', rootCats.ekipman, null, 2).lastInsertRowid,
  tenisEkipman: insertCat.run('tenis-ekipman', 'Tenis', rootCats.ekipman, null, 3).lastInsertRowid,
  yuzme: insertCat.run('yuzme-urunleri', 'Yüzme', rootCats.ekipman, null, 4).lastInsertRowid,
  kampMalzeme: insertCat.run('kamp-malzeme', 'Kamp Malzemeleri', rootCats.ekipman, null, 5).lastInsertRowid,
}

const media = (id, key, file = 'picture.jpg', w = 800) =>
  `https://contents.mediadecathlon.com/${id}/k$${key}/${file}?format=auto&f=${w}x0`

const products = [
  {
    sku: 'R-p-330956',
    slug: 'cocuk-futbol-tayt-iclik-siyah-keepcomfort-100',
    name: 'Çocuk Futbol Tayt İçlik - Siyah - Keepcomfort 100',
    brand: 'kipsta',
    category: subCats.cocukGiyim,
    sport: sports.futbol,
    description: 'Çocuk futbol antrenmanları için sıcak tutan tayt içlik.',
    price: 29900,
    compare: null,
    rating: 4.5,
    reviews: 412,
    gender: 'cocuk',
    isNew: 0,
    isDeal: 0,
    colors: ['Füme Siyah'],
    sizes: ['6 yaş', '8 yaş', '10 yaş', '12 yaş'],
    image: media('p3166523', '60061d40b18b3e992ae52de595155986'),
  },
  {
    sku: 'R-p-338961',
    slug: 'erkek-outdoor-kar-botu-su-gecirmez-siyah-nh100-mid',
    name: 'Erkek Outdoor Kar Botu Su Geçirmez - Siyah - NH100 Mid',
    brand: 'quechua',
    category: subCats.erkekAyakkabi,
    sport: sports.yuruyus,
    description: 'Su geçirmez erkek outdoor kar botu. Kış yürüyüşleri için.',
    price: 249900,
    compare: 299900,
    rating: 4.4,
    reviews: 1280,
    gender: 'erkek',
    isNew: 0,
    isDeal: 1,
    colors: ['Füme Siyah'],
    sizes: ['40', '41', '42', '43', '44', '45'],
    image: media('p2779001', 'bd9a4742f9910b8cfa0dfac4c44c3df0'),
  },
  {
    sku: 'R-p-331992',
    slug: 'erkek-outdoor-su-gecirmez-kar-montu-degc',
    name: 'Erkek Outdoor Su Geçirmez Kar Montu - Kışlık Mont',
    brand: 'quechua',
    category: subCats.erkekGiyim,
    sport: sports.yuruyus,
    description: 'Soğuk hava koşulları için su geçirmez erkek kar montu.',
    price: 349900,
    compare: null,
    rating: 4.6,
    reviews: 890,
    gender: 'erkek',
    isNew: 0,
    isDeal: 0,
    colors: ['Füme Siyah', 'Siyah'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: media('p3049272', 'daf1f6d7d2498b2d4a48feb9b3e4cdac'),
  },
  {
    sku: 'R-p-332649',
    slug: 'cocuk-outdoor-kar-botu-su-gecirmez-sh100',
    name: 'Çocuk Outdoor Kar Botu Su Geçirmez - SH100',
    brand: 'quechua',
    category: subCats.cocukGiyim,
    sport: sports.yuruyus,
    description: 'Çocuklar için su geçirmez outdoor kar botu.',
    price: 179900,
    compare: null,
    rating: 4.5,
    reviews: 654,
    gender: 'cocuk',
    isNew: 0,
    isDeal: 0,
    colors: ['Füme Siyah', 'Gri Mor'],
    sizes: ['28', '30', '32', '34', '36'],
    image: media('p2904959', '38de8c09ee2349f2bf0b3d818e0bcf1c'),
  },
  {
    sku: 'R-p-312360',
    slug: 'erkek-outdoor-polar-mh100',
    name: 'Erkek Outdoor Polar - MH100',
    brand: 'quechua',
    category: subCats.erkekGiyim,
    sport: sports.yuruyus,
    description: 'Günlük outdoor kullanım için sıcak tutan polar.',
    price: 99900,
    compare: null,
    rating: 4.7,
    reviews: 3421,
    gender: 'erkek',
    isNew: 0,
    isDeal: 0,
    colors: ['Siyah', 'Lacivert'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image: media('p2718228', 'fe59d82aa8d3e523e9691994b33432a8'),
  },
  {
    sku: 'R-p-336306',
    slug: 'erkek-outdoor-su-gecirmez-kar-montu-nh500',
    name: 'Erkek Outdoor Su Geçirmez Kar Montu/Kışlık Mont - Yeşil - NH500 -10 °C',
    brand: 'quechua',
    category: subCats.erkekGiyim,
    sport: sports.yuruyus,
    description: 'NH500 serisi su geçirmez kış montu.',
    price: 395000,
    compare: 615000,
    rating: 4.7,
    reviews: 1870,
    gender: 'erkek',
    isNew: 1,
    isDeal: 1,
    colors: ['Bronz Haki Yeşil'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: media('p2939154', 'ae5986153114ccaadfd55511cf1f7dc0'),
  },
  {
    sku: 'R-p-330928',
    slug: 'yetiskin-futbol-tayt-iclik-siyah-keepcomfort-100',
    name: 'Yetişkin Futbol Tayt İçlik - Siyah - Keepcomfort 100',
    brand: 'kipsta',
    category: subCats.erkekGiyim,
    sport: sports.futbol,
    description: 'Futbol antrenman ve maç için yetişkin tayt içlik.',
    price: 34900,
    compare: null,
    rating: 4.5,
    reviews: 2103,
    gender: 'erkek',
    isNew: 0,
    isDeal: 0,
    colors: ['Füme Siyah'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: media('p2706008', '6a4accf6393c40e3c22bef29319316c4'),
  },
  {
    sku: 'R-p-6797',
    slug: 'outdoor-paslanmaz-celik-termos-07l',
    name: 'Outdoor Paslanmaz Çelik Termos - 0,7 L - Yeşil',
    brand: 'quechua',
    category: subCats.outdoor,
    sport: sports.kamp,
    description: 'Paslanmaz çelik outdoor termos, 0.7 litre.',
    price: 59500,
    compare: 89500,
    rating: 4.8,
    reviews: 1498,
    gender: null,
    isNew: 0,
    isDeal: 1,
    colors: ['Okaliptüs Yeşili'],
    sizes: ['0,7 L'],
    image: media('p3041589', '9525a88276046829c48a6c95edc05032'),
  },
  {
    sku: 'R-p-324677',
    slug: 'erkek-sicak-tutan-outdoor-pantolon-sh500',
    name: 'Erkek Sıcak Tutan Outdoor Pantolon - SH500',
    brand: 'quechua',
    category: subCats.erkekGiyim,
    sport: sports.yuruyus,
    description: 'Kış yürüyüşleri için sıcak tutan outdoor pantolon.',
    price: 199900,
    compare: null,
    rating: 4.4,
    reviews: 980,
    gender: 'erkek',
    isNew: 0,
    isDeal: 0,
    colors: ['Siyah'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: media('p2294535', '6bad463b746c3d881867ddff9bcd5b79'),
  },
  {
    sku: 'R-p-331819',
    slug: 'cocuk-futbol-termal-iclik-keepdry',
    name: 'Çocuk Futbol Termal İçlik - Siyah - Keepdry',
    brand: 'kipsta',
    category: subCats.cocukGiyim,
    sport: sports.futbol,
    description: 'Çocuk futbol termal içlik, Keepdry teknolojisi.',
    price: 79000,
    compare: 89000,
    rating: 4.8,
    reviews: 4084,
    gender: 'cocuk',
    isNew: 0,
    isDeal: 1,
    colors: ['Füme Siyah'],
    sizes: ['6 yaş', '8 yaş', '10 yaş', '12 yaş'],
    image: media('p2957755', 'e979f028c5abd5ed70e251781983e5b1'),
  },
  {
    sku: 'R-p-302821',
    slug: 'erkek-sicak-tutan-ust-kayak-termal-icligi-bl-100',
    name: 'Erkek Sıcak Tutan Üst Kayak Termal İçliği - Siyah - BL 100',
    brand: 'wedze',
    category: subCats.erkekGiyim,
    sport: sports.kayak,
    description: 'Kayak için temel üst termal içlik.',
    price: 45000,
    compare: null,
    rating: 4.4,
    reviews: 920,
    gender: 'erkek',
    isNew: 0,
    isDeal: 0,
    colors: ['Füme Siyah'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: media('p3014490', 'ccaeb8772db87fa4573b84e4513495d2'),
  },
  {
    sku: 'R-p-308435',
    slug: 'erkek-kayak-snowboard-montu-siyah-100',
    name: 'Erkek Kayak/Snowboard Montu - Siyah - 100',
    brand: 'wedze',
    category: subCats.erkekGiyim,
    sport: sports.kayak,
    description: 'Erkek kayak/snowboard montu 100.',
    price: 275000,
    compare: null,
    rating: 4.6,
    reviews: 412,
    gender: 'erkek',
    isNew: 0,
    isDeal: 0,
    colors: ['Siyah'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: media('p3015541', '3517ede52c83481210954c067a7bcd2d'),
  },
  {
    sku: 'R-p-341167',
    slug: 'erkek-outdoor-polar-bej-mh500',
    name: 'Erkek Outdoor Polar - Bej - MH500',
    brand: 'quechua',
    category: subCats.erkekGiyim,
    sport: sports.yuruyus,
    description: 'Erkek outdoor polar MH500, bej.',
    price: 92000,
    compare: null,
    rating: 4.7,
    reviews: 890,
    gender: 'erkek',
    isNew: 0,
    isDeal: 0,
    colors: ['Bej'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: media('p2939105', 'f2f31d4128b144f82f8dbbfed16f9f2d'),
  },
  {
    sku: 'R-p-122861',
    slug: 'outdoor-baton-mavi-mt100',
    name: 'Outdoor Baton - Mavi - MT100',
    brand: 'forclaz',
    category: subCats.outdoor,
    sport: sports.yuruyus,
    description: 'Trekking ve yürüyüş için outdoor baton.',
    price: 59900,
    compare: null,
    rating: 4.6,
    reviews: 1502,
    gender: null,
    isNew: 0,
    isDeal: 0,
    colors: ['Fırtına Mavisi'],
    sizes: ['Tek Beden'],
    image: media('p2439600', '7c045ba875f008bd2de09cbcd2d67f40'),
  },
  {
    sku: 'R-p-307054',
    slug: 'erkek-outdoor-kar-botu-su-gecirmez-nh500-mid',
    name: 'Erkek Outdoor Kar Botu Su Geçirmez - NH500 Mid',
    brand: 'quechua',
    category: subCats.erkekAyakkabi,
    sport: sports.yuruyus,
    description: 'NH500 mid kesim su geçirmez kar botu.',
    price: 399900,
    compare: null,
    rating: 4.5,
    reviews: 2201,
    gender: 'erkek',
    isNew: 0,
    isDeal: 0,
    colors: ['Füme Siyah'],
    sizes: ['40', '41', '42', '43', '44'],
    image: media('p2289168', '842408da24641529512476dcae24e252'),
  },
  {
    sku: 'R-p-302822',
    slug: 'erkek-termal-alt-kayak-icligi-bl-100',
    name: 'Erkek Termal Alt Kayak İçliği - Siyah - BL 100',
    brand: 'wedze',
    category: subCats.erkekGiyim,
    sport: sports.kayak,
    description: 'Kayak için alt termal içlik.',
    price: 45000,
    compare: null,
    rating: 4.3,
    reviews: 688,
    gender: 'erkek',
    isNew: 0,
    isDeal: 0,
    colors: ['Füme Siyah'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: media('p1691814', 'b4e2a8a1988b66e4cb32ebf9a7270e84'),
  },
  {
    sku: 'R-p-14862',
    slug: 'uv-korumali-semsiye-125cm-profilter',
    name: 'UV Korumalı Şemsiye - 125 Cm - UPF50+ - Siyah - Profilter',
    brand: 'quechua',
    category: subCats.outdoor,
    sport: sports.yuruyus,
    description: 'UV korumalı outdoor şemsiye, 125 cm.',
    price: 64000,
    compare: 76000,
    rating: 4.6,
    reviews: 4233,
    gender: null,
    isNew: 0,
    isDeal: 1,
    colors: ['Siyah'],
    sizes: ['Tek Beden'],
    image: media('p2931532', '7244d0d30e0969a7d46d780af00ab96f'),
  },
  {
    sku: 'R-p-kettlebell-10kg',
    slug: 'proforce-plastik-kettlebell-10kg',
    name: 'Proforce - Plastik Kettlebell - 10Kg',
    brand: 'proforce',
    category: subCats.fitnessEkipman,
    sport: sports.fitness,
    description: '10 kg plastik kettlebell.',
    price: 147813,
    compare: 169900,
    rating: 4.5,
    reviews: 120,
    gender: null,
    isNew: 0,
    isDeal: 1,
    colors: ['Siyah'],
    sizes: ['10 kg'],
    image: media('m38880880', 'e7c5f8b353f9f6b48f4f293f5a65fc48'),
  },
  {
    sku: 'R-p-358741',
    slug: 'erkek-outdoor-polar-mont-mh500',
    name: 'Erkek Outdoor Polar Mont - Siyah - MH500',
    brand: 'quechua',
    category: subCats.erkekGiyim,
    sport: sports.yuruyus,
    description: 'MH500 erkek outdoor polar mont.',
    price: 185000,
    compare: 275000,
    rating: 4.8,
    reviews: 663,
    gender: 'erkek',
    isNew: 0,
    isDeal: 1,
    colors: ['Siyah'],
    sizes: ['S', 'M', 'L', 'XL'],
    image: media('p2938992', 'a61166607645b7ea16a60a136ecfd841'),
  },
  {
    sku: 'R-p-usr-root-201',
    slug: 'usr-root-201-badminton-raket-seti',
    name: 'USR Root 201 Badminton Raket Seti',
    brand: 'usr',
    category: subCats.tenisEkipman,
    sport: sports.tenis,
    description: 'USR Root 201 badminton raket seti.',
    price: 106890,
    compare: 133590,
    rating: 4.8,
    reviews: 4,
    gender: null,
    isNew: 0,
    isDeal: 1,
    colors: ['Çok Renkli'],
    sizes: ['Set'],
    image: media('m26739521', '26880ae8fbe312596facedb61726f75e'),
  },
  {
    sku: 'R-p-373172',
    slug: 'futbol-topu-5-numara-fifa',
    name: 'Futbol Topu - 5 Numara - FIFA Kalitesi',
    brand: 'kipsta',
    category: subCats.outdoor,
    sport: sports.futbol,
    description: 'FIFA kalitesinde 5 numara futbol topu.',
    price: 116100,
    compare: 129000,
    rating: 4.8,
    reviews: 66,
    gender: null,
    isNew: 0,
    isDeal: 1,
    colors: ['Beyaz'],
    sizes: ['5'],
    image: media('p3095416', '89e1fba7472844667e99cc6a9a57be45'),
  },
  {
    sku: 'R-p-yoga-roller-33',
    slug: 'yoga-roller-33cm-siyah',
    name: 'YOGA ROLLER 33 CM SİYAH',
    brand: 'domyos',
    category: subCats.fitnessEkipman,
    sport: sports.fitness,
    description: '33 cm yoga roller.',
    price: 86913,
    compare: 99900,
    rating: 4.4,
    reviews: 88,
    gender: null,
    isNew: 0,
    isDeal: 1,
    colors: ['Siyah'],
    sizes: ['33 cm'],
    image: media('m38190615', 'f1c55610b176105bfe8d60e0e16de705'),
  },
  {
    sku: 'R-p-347721',
    slug: 'yetiskin-tenis-raketi-tr-easy-graph-lite',
    name: 'Yetişkin Tenis Raketi - Mavi - TR Easy Graph Lite',
    brand: 'artengo',
    category: subCats.tenisEkipman,
    sport: sports.tenis,
    description: 'Yetişkin tenis raketi TR Easy Graph Lite.',
    price: 224100,
    compare: 249000,
    rating: 4.8,
    reviews: 103,
    gender: null,
    isNew: 0,
    isDeal: 1,
    colors: ['Mavi'],
    sizes: ['Tek Beden'],
    image: media('p3020028', '89a8a96c76b0dfc382ebccb714818793'),
  },
  {
    sku: 'R-p-2938992',
    slug: 'kadin-fitness-tayti',
    name: 'Kadın Fitness Taytı',
    brand: 'domyos',
    category: subCats.kadinGiyim,
    sport: sports.fitness,
    description: 'Antrenman için esnek kadın fitness taytı.',
    price: 69900,
    compare: 89900,
    rating: 4.6,
    reviews: 1860,
    gender: 'kadin',
    isNew: 0,
    isDeal: 1,
    colors: ['Siyah', 'Füme'],
    sizes: ['XS', 'S', 'M', 'L'],
    image: media('p2718228', 'fe59d82aa8d3e523e9691994b33432a8'),
  },
  // Live homepage "Sizin İçin Seçtiklerimiz" order (decathlon.com.tr)
  {
    sku: 'R-p-12329',
    slug: 'yetiskin-scooter-acik-yesil-t7xl',
    name: 'Yetişkin Scooter - Açık Yeşil - T7XL',
    brand: 'oxelo',
    category: subCats.outdoor,
    sport: sports.fitness,
    description: 'Yetişkin scooter T7XL, açık yeşil.',
    price: 737100,
    compare: 819000,
    rating: 4.7,
    reviews: 1535,
    gender: null,
    isNew: 0,
    isDeal: 1,
    colors: ['Açık Yeşil'],
    sizes: ['Tek Beden'],
    image: media('p2599241', '7a7aaceb4252d8c9f2916878180f8598'),
  },
  {
    sku: 'R-p-351006',
    slug: 'fitness-mati-15mm-bordo',
    name: 'Fitness Matı - 15 Mm - Bordo',
    brand: 'domyos',
    category: subCats.fitnessEkipman,
    sport: sports.fitness,
    description: '15 mm kalınlığında bordo fitness matı.',
    price: 149000,
    compare: 165000,
    rating: 4.8,
    reviews: 2420,
    gender: null,
    isNew: 0,
    isDeal: 1,
    colors: ['Bordo'],
    sizes: ['Tek Beden'],
    image: media('p2940138', '9b91329decd189661fc9274d6c571df7'),
  },
  {
    sku: 'R-p-arena-python-mirror',
    slug: 'arena-yaris-yuzucu-gozlugu-python-mirror',
    name: 'ARENA YARIŞ YÜZÜCÜ GÖZLÜĞÜ PYTHON MIRROR 1E763111',
    brand: 'arena',
    category: subCats.yuzme,
    sport: sports.yuzme,
    description: 'Arena Python Mirror yarış yüzücü gözlüğü.',
    price: 199900,
    compare: 249900,
    rating: 4.6,
    reviews: 48,
    gender: null,
    isNew: 0,
    isDeal: 1,
    colors: ['Ayna'],
    sizes: ['Tek Beden'],
    image: media('m39736338', 'fdc5d856b1a8d6142b971d92a4d6c09e'),
  },
  {
    sku: 'R-p-338528',
    slug: 'teleskopik-surf-kamis-symbios-500',
    name: 'Teleskopik Surf Kamış - Balıkçılık - 420 cm 100/200 g - Symbios 500',
    brand: 'caperlan',
    category: subCats.outdoor,
    sport: sports.balikcilik,
    description: 'Teleskopik surf kamış Symbios 500, 420 cm.',
    price: 245000,
    compare: 265500,
    rating: 4.7,
    reviews: 75,
    gender: null,
    isNew: 0,
    isDeal: 1,
    colors: ['Siyah'],
    sizes: ['420 cm'],
    image: media('p2619238', '8112046359c178f570994d5a6d94d51d'),
  },
  {
    sku: 'R-p-351455',
    slug: 'cocuk-scooteri-3-tekerlekli-mavi-btwin-b100',
    name: 'Çocuk Scooterı - 3 Tekerlekli - Mavi - Btwin B100',
    brand: 'btwin',
    category: subCats.outdoor,
    sport: sports.fitness,
    description: '3 tekerlekli çocuk scooterı Btwin B100.',
    price: 161100,
    compare: 179000,
    rating: 4.8,
    reviews: 1232,
    gender: 'cocuk',
    isNew: 0,
    isDeal: 1,
    colors: ['Mavi'],
    sizes: ['Tek Beden'],
    image: media('p2871430', '086f265561366c7f4d33fcec9b447d21'),
  },
  {
    sku: 'R-p-325854',
    slug: 'tenis-topu-3-adet-turuncu-tb110',
    name: 'Tenis Topu - 3 adet - Turuncu - TB110',
    brand: 'artengo',
    category: subCats.tenisEkipman,
    sport: sports.tenis,
    description: 'Başlangıç tenis topu TB110, 3 adet.',
    price: 22500,
    compare: 25000,
    rating: 4.8,
    reviews: 628,
    gender: null,
    isNew: 0,
    isDeal: 1,
    colors: ['Turuncu'],
    sizes: ['3 adet'],
    image: media('p3251444', '8be036afda30982682d01206d4d505c4'),
  },
  {
    sku: 'R-p-arena-print2-bone',
    slug: 'arena-baskili-silikon-yuzucu-bonesi-print-2',
    name: 'ARENA BASKILI SİLİKON YÜZÜCÜ BONESİ PRİNT 2 1E368120',
    brand: 'arena',
    category: subCats.yuzme,
    sport: sports.yuzme,
    description: 'Arena baskılı silikon yüzücü bonesi Print 2.',
    price: 71900,
    compare: 89900,
    rating: 4.5,
    reviews: 32,
    gender: null,
    isNew: 0,
    isDeal: 1,
    colors: ['Çok Renkli'],
    sizes: ['Tek Beden'],
    image: media('m36074469', '984e025c3549d428749307694b3edb44'),
  },
  {
    sku: 'R-p-362235',
    slug: 'mini-futbol-topu-sampiyonlar-ligi-finali-2526',
    name: 'Mini Futbol Topu - Şampiyonlar Ligi Finali 25/26',
    brand: 'kipsta',
    category: subCats.outdoor,
    sport: sports.futbol,
    description: 'Şampiyonlar Ligi Finali 25/26 mini futbol topu.',
    price: 76000,
    compare: null,
    rating: 4.8,
    reviews: 70,
    gender: null,
    isNew: 1,
    isDeal: 0,
    colors: ['Çok Renkli'],
    sizes: ['Mini'],
    image: media('p3117618', 'd2362e7698de0d9de2470f492732021a'),
  },
  {
    sku: 'R-p-350455',
    slug: 'cocuk-boks-eldiveni-kirmizi',
    name: 'Çocuk Boks Eldiveni - Kırmızı',
    brand: 'domyos',
    category: subCats.fitnessEkipman,
    sport: sports.boks,
    description: 'Çocuk boks eldiveni, kırmızı.',
    price: 75000,
    compare: 79500,
    rating: 4.8,
    reviews: 440,
    gender: 'cocuk',
    isNew: 0,
    isDeal: 1,
    colors: ['Kırmızı'],
    sizes: ['Çocuk'],
    image: media('p2636219', 'c396f7fca935f403115ad8cfdf91fe7a'),
  },
  {
    sku: 'R-p-usr-blast-ittf',
    slug: 'usr-blast-ittf-onayli-masa-tenisi-raketi',
    name: 'USR Blast ITTF Onaylı Masa Tenisi Raketi',
    brand: 'usr',
    category: subCats.tenisEkipman,
    sport: sports.tenis,
    description: 'USR Blast ITTF onaylı masa tenisi raketi.',
    price: 81490,
    compare: 116390,
    rating: 4.6,
    reviews: 28,
    gender: null,
    isNew: 0,
    isDeal: 1,
    colors: ['Siyah'],
    sizes: ['Tek Beden'],
    image: media('m33080164', 'd55eca3ac959da61a6defab8a4616297'),
  },
]

// Live catalog dumps from decathlon.com.tr __DKT (deals + tum-urunler batches)
function loadCatalogDumps() {
  const bySku = Object.create(null)
  const files = readdirSync(__dirname)
    .filter(
      (f) =>
        f === 'deals-products.json' ||
        f === 'tum-urunler-checkpoint.json' ||
        /^scrape-batch-.*\.json$/.test(f)
    )
    .sort()
  for (const f of files) {
    let arr
    try {
      arr = JSON.parse(readFileSync(join(__dirname, f), 'utf8'))
    } catch {
      continue
    }
    if (!Array.isArray(arr)) continue
    for (const p of arr) {
      if (!p?.sku || !p?.slug || !p?.price) continue
      const prev = bySku[p.sku]
      if (!prev) {
        bySku[p.sku] = p
        continue
      }
      if (p.isDeal && !prev.isDeal) prev.isDeal = 1
      if (p.compare && !prev.compare) prev.compare = p.compare
    }
  }
  return Object.values(bySku)
}

const liveCatalog = loadCatalogDumps()
const existingSlugs = new Set(products.map((p) => p.slug))
const existingSkus = new Set(products.map((p) => p.sku))
const natureCats = new Map()
const sportBySlug = { ...sports }

function ensureBrand(slug) {
  const key = slugify(slug) || 'decathlon'
  if (!brands[key]) {
    brands[key] = insertBrand.run(key, key.toUpperCase()).lastInsertRowid
  }
  return brands[key]
}

function ensureSport(name) {
  if (!name) return sports.yuruyus
  const key = slugify(name)
  if (!sportBySlug[key]) {
    sportBySlug[key] = insertSport.run(key, name).lastInsertRowid
  }
  return sportBySlug[key]
}

function ensureNatureCategory(nature) {
  const name = nature || 'Ürün'
  const key = slugify(name)
  if (!natureCats.has(key)) {
    natureCats.set(
      key,
      insertCat.run(key, name, rootCats.ekipman, null, 50 + natureCats.size).lastInsertRowid
    )
  }
  return natureCats.get(key)
}

for (const p of liveCatalog) {
  if (existingSlugs.has(p.slug) || existingSkus.has(p.sku)) continue
  existingSlugs.add(p.slug)
  existingSkus.add(p.sku)
  ensureBrand(p.brand)
  products.push({
    sku: p.sku,
    slug: p.slug,
    name: p.name,
    brand: slugify(p.brand) || 'decathlon',
    category: ensureNatureCategory(p.nature),
    sport: ensureSport(p.sportName),
    description: p.description || p.name,
    price: p.price,
    compare: p.compare,
    rating: p.rating || 0,
    reviews: p.reviews || 0,
    gender: p.gender || null,
    isNew: p.isNew || 0,
    isDeal: p.isDeal ? 1 : 0,
    colors: p.colors?.length ? p.colors : ['Çok Renkli'],
    sizes: p.sizes?.length ? p.sizes : ['Tek Beden'],
    image: p.image,
  })
}

const insertProduct = db.prepare(`
  INSERT INTO products (
    sku, slug, name, brand_id, category_id, sport_id, description,
    price_kurus, compare_at_kurus, rating, review_count, gender,
    is_new, is_deal, free_store_pickup, image_url
  ) VALUES (
    @sku, @slug, @name, @brand_id, @category_id, @sport_id, @description,
    @price_kurus, @compare_at_kurus, @rating, @review_count, @gender,
    @is_new, @is_deal, 1, @image_url
  )
`)

const insertVariant = db.prepare(
  `INSERT INTO product_variants (product_id, color, size, stock) VALUES (?, ?, ?, ?)`
)
const insertImage = db.prepare(
  `INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)`
)

const seedProducts = db.transaction(() => {
  products.forEach((p, index) => {
    const result = insertProduct.run({
      sku: p.sku,
      slug: p.slug,
      name: p.name,
      brand_id: brands[p.brand],
      category_id: p.category,
      sport_id: p.sport,
      description: p.description,
      price_kurus: p.price,
      compare_at_kurus: p.compare,
      rating: p.rating,
      review_count: p.reviews,
      gender: p.gender,
      is_new: p.isNew,
      is_deal: p.isDeal,
      image_url: p.image,
    })
    const productId = result.lastInsertRowid
    insertImage.run(productId, p.image, 0)
    insertImage.run(productId, p.image.replace('f=800x0', 'f=1200x0'), 1)
    insertImage.run(productId, p.image.replace('f=800x0', 'f=1600x0'), 2)
    const colors = [...new Set((p.colors || ['Çok Renkli']).filter(Boolean))]
    const sizes = [...new Set((p.sizes || ['Tek Beden']).filter(Boolean))]
    for (const color of colors) {
      for (const size of sizes) {
        insertVariant.run(productId, color, size, 5 + ((index + size.length) % 12))
      }
    }
  })
})

seedProducts()

const stores = [
  ['istanbul-kadikoy', 'Decathlon Kadıköy', 'İstanbul', 'Kadıköy', 'Caferağa Mah. Moda Cad. No:45', '0216 000 00 01', 40.988, 29.025, '09:00-21:00', '["click_collect","atolye","iade"]'],
  ['istanbul-umsaniye', 'Decathlon Ümraniye', 'İstanbul', 'Ümraniye', 'Atatürk Mah. Alemdağ Cad. No:120', '0216 000 00 02', 41.025, 29.12, '10:00-22:00', '["click_collect","iade"]'],
  ['ankara-cankaya', 'Decathlon Çankaya', 'Ankara', 'Çankaya', 'Çukurambar Mah. 1480. Cad. No:8', '0312 000 00 01', 39.9, 32.81, '10:00-21:00', '["click_collect","atolye","iade"]'],
  ['izmir-bornova', 'Decathlon Bornova', 'İzmir', 'Bornova', 'Erzene Mah. Ankara Cad. No:55', '0232 000 00 01', 38.46, 27.22, '10:00-21:00', '["click_collect","iade"]'],
  ['bursa-nilufer', 'Decathlon Nilüfer', 'Bursa', 'Nilüfer', 'Özlüce Mah. Ahmet Taner Kışlalı Cad. No:3', '0224 000 00 01', 40.21, 28.94, '10:00-21:00', '["click_collect"]'],
]

const insertStore = db.prepare(`
  INSERT INTO stores (slug, name, city, district, address, phone, lat, lng, hours, services)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)
for (const s of stores) insertStore.run(...s)

const cmsPages = [
  ['biz-kimiz', 'Biz Kimiz?', 'Decathlon, herkes için spor malzemeleri sunan bir markadır. Bu sayfa ödev klonu için hazırlanmış içerik stubudur.', 'hakkimizda'],
  ['bize-ulasin', 'Bize Ulaşın', 'Müşteri hizmetleri: destek@decathlon.local — Hafta içi 09:00-18:00', 'hakkimizda'],
  ['uyelik-sozlesmesi', 'Üyelik Sözleşmesi', 'Üyelik sözleşmesi metni (stub). Kişisel verilerin korunması ve üyelik koşulları burada yer alır.', 'hakkimizda'],
  ['bilgi-toplumu-hizmetleri', 'Bilgi Toplumu Hizmetleri', 'Bilgi toplumu hizmetleri bilgilendirme sayfası (stub).', 'hakkimizda'],
  ['insan-kaynaklari', 'İnsan Kaynakları', 'Kariyer fırsatları için IK stub sayfası.', 'hakkimizda'],
  ['degerlerimiz', 'Değerlerimiz', 'Decathlon değerleri: sorumluluk, canlılık, cömertlik (stub).', 'hakkimizda'],
  ['kalite-politikasi', 'Kalite Politikamız', 'Kalite politikası stub içeriği.', 'hakkimizda'],
  ['bilgi-guvenligi', 'Bilgi Güvenliği Politikamız', 'Bilgi güvenliği politikası stub içeriği.', 'hakkimizda'],
  ['member-avantajlari', 'Decathlon Member Avantajları', 'Member puanları, özel indirimler ve erken erişim avantajları (stub).', 'hizmetler'],
  ['magazadan-teslim', 'Mağazadan Teslim', 'Siparişinizi ücretsiz mağazadan teslim alabilirsiniz (stub).', 'hizmetler'],
  ['garanti-kosullari', 'Garanti Koşulları', 'Çoğu üründe 2 yıl garanti (stub).', 'hizmetler'],
  ['atolye', 'Atölye', 'Bisiklet ve kayak bakımı için atölye hizmetleri (stub).', 'hizmetler'],
  ['sss', 'SSS', 'Sıkça sorulan sorular stub sayfası.', 'hizmetler'],
  ['urun-geri-cagirma', 'Ürün Geri Çağırma', 'Güncel ürün geri çağırma duyuruları (stub).', 'hizmetler'],
  ['magazadan-eve-teslimat', 'Mağazadan Eve Teslimat', 'Mağazadan eve teslimat bilgilendirme (stub).', 'hizmetler'],
  ['ertesi-gun-teslim', 'Ertesi Gün Mağazadan Teslim Al', 'Ertesi gün mağazadan teslim bilgilendirme (stub).', 'hizmetler'],
  ['iade-politikasi', 'İade Politikası', '60 gün içinde iade ve değişim (stub).', 'siparis'],
  ['teslimat-bilgileri', 'Teslimat Bilgileri', 'Kargo ve mağazadan teslim seçenekleri (stub).', 'siparis'],
  ['odeme-secenekleri', 'Ödeme Seçenekleri', 'Kredi kartı, kapıda ödeme (mock) seçenekleri (stub).', 'siparis'],
  ['gizlilik', 'Gizlilik & Güvenlik', 'Gizlilik politikası stub.', 'yasal'],
  ['cerez-politikasi', 'Çerez Politikası', 'Çerez politikası stub.', 'yasal'],
  ['kvkk', 'Kişisel Verilerin Korunması', 'KVKK aydınlatma metni stub.', 'yasal'],
  ['yasal-bildirimler', 'Yasal Bildirimler', 'Yasal bildirimler stub.', 'yasal'],
]

const insertCms = db.prepare(
  `INSERT INTO cms_pages (slug, title, body, section) VALUES (?, ?, ?, ?)`
)
for (const p of cmsPages) insertCms.run(...p)

const count = db.prepare('SELECT COUNT(*) AS c FROM products').get().c
console.log(`Seed complete: ${count} products, DB ready.`)
console.log('Demo user: demo@decathlon.local / demo1234')
