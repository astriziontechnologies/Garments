import { Suspense } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductCard, { ProductCardProps } from "@/components/products/ProductCard";

// TODO: Replace with Supabase server action fetch when DB is ready
const DUMMY_PRODUCTS: ProductCardProps[] = [
  { id: 1,  name: "Classic White Formal Shirt",    slug: "classic-white-formal-shirt",   base_price: 1299, discount_price: 999,  offer_status: true  },
  { id: 2,  name: "Casual Cotton Kurti",            slug: "casual-cotton-kurti",           base_price: 899,                       offer_status: false },
  { id: 3,  name: "Kids Denim Shorts",              slug: "kids-denim-shorts",             base_price: 599,  discount_price: 449,  offer_status: true  },
  { id: 4,  name: "Silk Saree - Rose Gold",         slug: "silk-saree-rose-gold",          base_price: 4999,                      offer_status: false },
  { id: 5,  name: "Men's Slim Chinos",              slug: "mens-slim-chinos",              base_price: 1499, discount_price: 1199, offer_status: true  },
  { id: 6,  name: "School Uniform Set",             slug: "school-uniform-set",            base_price: 799,                       offer_status: false },
  { id: 7,  name: "Women's Anarkali Suit",          slug: "womens-anarkali-suit",          base_price: 2499, discount_price: 1999, offer_status: true  },
  { id: 8,  name: "Men's Polo T-Shirt",             slug: "mens-polo-tshirt",              base_price: 699,                       offer_status: false },
];

const CATEGORIES = ["Men", "Women", "Kids", "Uniforms", "Sarees", "Accessories", "Formals", "Casuals"];
const PRICE_RANGES = [
  { label: "Under ₹500",      value: "0-500" },
  { label: "₹500 – ₹1,000",  value: "500-1000" },
  { label: "₹1,000 – ₹2,500",value: "1000-2500" },
  { label: "Above ₹2,500",   value: "2500-99999" },
];

export const metadata = {
  title: "Shop",
  description: "Browse our complete range of garments at Sri Garments.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Our Shop</h1>
          <p className="mt-1 text-sm text-gray-500">Discover our full collection of premium garments</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search + Sort Bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-9 bg-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{DUMMY_PRODUCTS.length}</span> products
            </span>
            {/* Sort Dropdown — pure HTML select for server component */}
            <select
              className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="newest"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Popular</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* ── Sidebar Filters ── */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Category
                </h3>
                <ul className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <li key={cat} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`cat-${cat}`}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`cat-${cat}`}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {cat}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Price Range
                </h3>
                <ul className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <li key={range.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="price-range"
                        id={`price-${range.value}`}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`price-${range.value}`}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {range.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status Filter */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </h3>
                <ul className="space-y-2">
                  {["On Offer", "In Stock", "New Arrivals"].map((status) => (
                    <li key={status} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`status-${status}`}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`status-${status}`}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {status}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Active Filters (cosmetic) */}
              <div className="pt-2 border-t border-gray-100">
                <button className="w-full rounded-md border border-gray-200 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                  Clear All Filters
                </button>
              </div>
            </div>
          </aside>

          {/* ── Product Grid ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter badge strip */}
            <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 lg:hidden">
              <Badge variant="outline" className="shrink-0 cursor-pointer text-xs">
                <SlidersHorizontal className="mr-1 h-3 w-3" /> Filters
              </Badge>
              {["Men", "Women", "On Offer"].map((tag) => (
                <Badge key={tag} variant="secondary" className="shrink-0 cursor-pointer text-xs">
                  {tag} ×
                </Badge>
              ))}
            </div>

            <Suspense fallback={<ProductGridSkeleton />}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 lg:gap-5">
                {DUMMY_PRODUCTS.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </Suspense>

            {/* Pagination (cosmetic) */}
            <div className="mt-10 flex items-center justify-center gap-2">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    page === 1
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 lg:gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-gray-200 bg-white"
        >
          <div className="aspect-square bg-gray-200 rounded-t-xl" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
