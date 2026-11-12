/** Prices are stored as integer minor units (kuruş). */
export function kurusToLira(kurus) {
  return Number((kurus / 100).toFixed(2))
}

export function formatTry(kurus) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(kurusToLira(kurus))
}

export function mapProduct(row) {
  if (!row) return null
  return {
    id: row.id,
    sku: row.sku,
    slug: row.slug,
    name: row.name,
    brand: row.brand_name,
    brandSlug: row.brand_slug,
    categoryId: row.category_id,
    categorySlug: row.category_slug,
    categoryName: row.category_name,
    sportId: row.sport_id,
    sportSlug: row.sport_slug,
    sportName: row.sport_name,
    description: row.description,
    priceKurus: row.price_kurus,
    compareAtKurus: row.compare_at_kurus,
    priceLabel: formatTry(row.price_kurus),
    compareAtLabel: row.compare_at_kurus ? formatTry(row.compare_at_kurus) : null,
    discountPercent:
      row.compare_at_kurus && row.compare_at_kurus > row.price_kurus
        ? Math.floor((1 - row.price_kurus / row.compare_at_kurus) * 100 + 1e-9)
        : null,
    rating: row.rating,
    reviewCount: row.review_count,
    gender: row.gender,
    isNew: Boolean(row.is_new),
    isDeal: Boolean(row.is_deal),
    freeStorePickup: Boolean(row.free_store_pickup),
    imageUrl: row.image_url,
  }
}
