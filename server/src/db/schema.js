import { db } from './connection.js'

export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      parent_id INTEGER REFERENCES categories(id),
      gender TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      brand_id INTEGER NOT NULL REFERENCES brands(id),
      category_id INTEGER NOT NULL REFERENCES categories(id),
      sport_id INTEGER REFERENCES sports(id),
      description TEXT NOT NULL,
      price_kurus INTEGER NOT NULL,
      compare_at_kurus INTEGER,
      rating REAL NOT NULL DEFAULT 0,
      review_count INTEGER NOT NULL DEFAULT 0,
      gender TEXT,
      is_new INTEGER NOT NULL DEFAULT 0,
      is_deal INTEGER NOT NULL DEFAULT 0,
      free_store_pickup INTEGER NOT NULL DEFAULT 1,
      image_url TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      color TEXT NOT NULL,
      size TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      UNIQUE(product_id, color, size)
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      district TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT,
      lat REAL,
      lng REAL,
      hours TEXT NOT NULL,
      services TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS cms_pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      section TEXT NOT NULL DEFAULT 'genel'
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      district TEXT NOT NULL,
      line1 TEXT NOT NULL,
      is_default INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      guest_token TEXT UNIQUE,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
      variant_id INTEGER NOT NULL REFERENCES product_variants(id),
      quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
      UNIQUE(cart_id, variant_id)
    );

    CREATE TABLE IF NOT EXISTS wishlists (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id),
      order_number TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'confirmed',
      delivery_type TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      subtotal_kurus INTEGER NOT NULL,
      shipping_kurus INTEGER NOT NULL DEFAULT 0,
      total_kurus INTEGER NOT NULL,
      shipping_address_json TEXT,
      store_id INTEGER REFERENCES stores(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL,
      variant_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      color TEXT NOT NULL,
      size TEXT NOT NULL,
      unit_price_kurus INTEGER NOT NULL,
      quantity INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
    CREATE INDEX IF NOT EXISTS idx_products_sport ON products(sport_id);
    CREATE INDEX IF NOT EXISTS idx_products_deal ON products(is_deal);
    CREATE INDEX IF NOT EXISTS idx_products_price ON products(price_kurus);
  `)
}
