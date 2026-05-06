-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE user_role AS ENUM ('super_admin', 'owner', 'inventory_manager', 'staff');
CREATE TYPE product_status AS ENUM ('active', 'draft', 'out_of_stock', 'archived');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE customer_type AS ENUM ('retail', 'dealer', 'wholesaler');

-- PROFILES (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'staff',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  main_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  base_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_price NUMERIC(10,2),
  offer_status BOOLEAN NOT NULL DEFAULT false,
  status product_status NOT NULL DEFAULT 'draft',
  thumbnail_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  seo_slug TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PRODUCT VARIANTS
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  fabric TEXT,
  custom_variant TEXT,
  sku_suffix TEXT,
  price_adjustment NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PRODUCT IMAGES
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INVENTORY
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  stock_quantity INT NOT NULL DEFAULT 0,
  available_quantity INT NOT NULL DEFAULT 0,
  reserved_quantity INT NOT NULL DEFAULT 0,
  barcode TEXT UNIQUE,
  qr_code_url TEXT,
  low_stock_threshold INT NOT NULL DEFAULT 10,
  last_updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT positive_stock CHECK (stock_quantity >= 0),
  CONSTRAINT positive_available CHECK (available_quantity >= 0),
  CONSTRAINT positive_reserved CHECK (reserved_quantity >= 0)
);

-- CUSTOMERS
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mobile_number TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  customer_type customer_type NOT NULL DEFAULT 'retail',
  last_purchase_date DATE,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CUSTOMER ADDRESSES
CREATE TABLE customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- WISHLISTS
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- REVIEWS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message TEXT,
  status review_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- COUPONS
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type discount_type NOT NULL,
  discount_value NUMERIC(10,2) NOT NULL,
  expiry_date DATE,
  usage_limit INT,
  used_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ANALYTICS EVENTS
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ACTIVITY LOGS
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AUDIT LOGS
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_main_category ON products(main_category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_inventory_variant ON inventory(product_variant_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_type ON customers(customer_type);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);

-- UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_categories BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_product_variants BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_inventory BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_customers BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_reviews BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_coupons BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- HELPER FUNCTION: get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'staff'::public.user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES RLS
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_admin_all" ON profiles USING (get_user_role() IN ('super_admin', 'owner'));

-- CATEGORIES RLS (public read, admin write)
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_write" ON categories FOR ALL USING (get_user_role() IN ('super_admin', 'owner', 'inventory_manager'));

-- PRODUCTS RLS (public read active, admin write)
CREATE POLICY "products_public_read" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "products_staff_read" ON products FOR SELECT USING (get_user_role() IS NOT NULL);
CREATE POLICY "products_admin_write" ON products FOR ALL USING (get_user_role() IN ('super_admin', 'owner', 'inventory_manager'));

-- PRODUCT VARIANTS RLS
CREATE POLICY "variants_public_read" ON product_variants FOR SELECT USING (true);
CREATE POLICY "variants_admin_write" ON product_variants FOR ALL USING (get_user_role() IN ('super_admin', 'owner', 'inventory_manager'));

-- PRODUCT IMAGES RLS
CREATE POLICY "images_public_read" ON product_images FOR SELECT USING (true);
CREATE POLICY "images_admin_write" ON product_images FOR ALL USING (get_user_role() IN ('super_admin', 'owner', 'inventory_manager'));

-- INVENTORY RLS
CREATE POLICY "inventory_staff_read" ON inventory FOR SELECT USING (get_user_role() IS NOT NULL);
CREATE POLICY "inventory_manager_write" ON inventory FOR ALL USING (get_user_role() IN ('super_admin', 'owner', 'inventory_manager'));

-- CUSTOMERS RLS
CREATE POLICY "customers_staff_read" ON customers FOR SELECT USING (get_user_role() IS NOT NULL);
CREATE POLICY "customers_owner_write" ON customers FOR ALL USING (get_user_role() IN ('super_admin', 'owner'));

-- CUSTOMER ADDRESSES RLS
CREATE POLICY "addresses_staff_read" ON customer_addresses FOR SELECT USING (get_user_role() IS NOT NULL);
CREATE POLICY "addresses_owner_write" ON customer_addresses FOR ALL USING (get_user_role() IN ('super_admin', 'owner'));

-- WISHLISTS RLS (public insert/select for authenticated)
CREATE POLICY "wishlists_public_read" ON wishlists FOR SELECT USING (true);
CREATE POLICY "wishlists_public_insert" ON wishlists FOR INSERT WITH CHECK (true);
CREATE POLICY "wishlists_admin_delete" ON wishlists FOR DELETE USING (get_user_role() IN ('super_admin', 'owner'));

-- REVIEWS RLS
CREATE POLICY "reviews_public_read_approved" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "reviews_staff_read_all" ON reviews FOR SELECT USING (get_user_role() IS NOT NULL);
CREATE POLICY "reviews_public_insert" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "reviews_admin_write" ON reviews FOR ALL USING (get_user_role() IN ('super_admin', 'owner'));

-- COUPONS RLS
CREATE POLICY "coupons_admin_all" ON coupons FOR ALL USING (get_user_role() IN ('super_admin', 'owner'));

-- ANALYTICS RLS
CREATE POLICY "analytics_owner_read" ON analytics_events FOR SELECT USING (get_user_role() IN ('super_admin', 'owner'));
CREATE POLICY "analytics_public_insert" ON analytics_events FOR INSERT WITH CHECK (true);

-- ACTIVITY LOGS RLS
CREATE POLICY "activity_logs_own" ON activity_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "activity_logs_admin" ON activity_logs FOR SELECT USING (get_user_role() IN ('super_admin', 'owner'));
CREATE POLICY "activity_logs_insert" ON activity_logs FOR INSERT WITH CHECK (user_id = auth.uid());

-- AUDIT LOGS RLS
CREATE POLICY "audit_logs_admin" ON audit_logs FOR ALL USING (get_user_role() IN ('super_admin', 'owner'));

-- STORAGE BUCKETS (run via Supabase dashboard or CLI)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);
