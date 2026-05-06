import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Layers,
  Tag,
  Zap,
  Shirt,
  PersonStanding,
  Baby,
  GraduationCap,
  Gem,
  ShoppingBag,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { Button } from "@/components/ui/button";
import ProductCard, { ProductCardProps } from "@/components/products/ProductCard";

// TODO: Replace with Supabase server action fetch when DB is ready
const FEATURED_PRODUCTS: ProductCardProps[] = [
  { id: 1, name: "Classic White Formal Shirt", slug: "classic-white-formal-shirt", base_price: 1299, discount_price: 999, offer_status: true },
  { id: 2, name: "Casual Cotton Kurti", slug: "casual-cotton-kurti", base_price: 899, offer_status: false },
  { id: 3, name: "Kids Denim Shorts", slug: "kids-denim-shorts", base_price: 599, discount_price: 449, offer_status: true },
  { id: 4, name: "Silk Saree - Rose Gold", slug: "silk-saree-rose-gold", base_price: 4999, offer_status: false },
  { id: 5, name: "Men's Slim Chinos", slug: "mens-slim-chinos", base_price: 1499, discount_price: 1199, offer_status: true },
  { id: 6, name: "School Uniform Set", slug: "school-uniform-set", base_price: 799, offer_status: false },
  { id: 7, name: "Women's Anarkali Suit", slug: "womens-anarkali-suit", base_price: 2499, discount_price: 1999, offer_status: true },
  { id: 8, name: "Men's Polo T-Shirt", slug: "mens-polo-tshirt", base_price: 699, offer_status: false },
];

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

const CATEGORIES: { name: string; icon: LucideIcon; href: string }[] = [
  { name: "Men",         icon: Shirt,           href: "/shop?category=Men" },
  { name: "Women",       icon: PersonStanding,  href: "/shop?category=Women" },
  { name: "Kids",        icon: Baby,            href: "/shop?category=Kids" },
  { name: "Uniforms",    icon: GraduationCap,   href: "/shop?category=Uniforms" },
  { name: "Sarees",      icon: Gem,             href: "/shop?category=Sarees" },
  { name: "Accessories", icon: ShoppingBag,     href: "/shop?category=Accessories" },
];

const WHY_CHOOSE_US = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
    title: "Quality Assured",
    desc: "Every product undergoes strict quality checks before reaching you.",
  },
  {
    icon: <Layers className="h-8 w-8 text-blue-600" />,
    title: "Wide Range",
    desc: "500+ styles across men, women, kids, uniforms, and traditional wear.",
  },
  {
    icon: <Tag className="h-8 w-8 text-blue-600" />,
    title: "Best Prices",
    desc: "Competitive pricing with regular offers and seasonal discounts.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "Fast Delivery",
    desc: "Quick and reliable delivery to your doorstep across Tamil Nadu.",
  },
];

const WHATSAPP_URL =
  "https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%27m%20interested%20in%20your%20products";

export default function HomePage() {
  return (
    <>
      {/* ── 1. Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 py-20 sm:py-28 lg:py-36">
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-500/30 px-4 py-1 text-sm font-medium text-blue-100 ring-1 ring-blue-400/40">
            New Collection Available
          </span>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Premium Quality{" "}
            <span className="text-yellow-300">Garments</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 sm:text-xl">
            Discover our exclusive range of men&apos;s, women&apos;s, and
            kids&apos; clothing — crafted for comfort, style, and durability.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-lg"
            >
              <Link href="/shop">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/60 text-white hover:bg-white/10"
            >
              <Link href="/categories">Explore Categories</Link>
            </Button>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
      </section>

      {/* ── 2. Featured Categories ── */}
      <section className="bg-gray-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-2 text-gray-500">
              Browse our curated collections for everyone
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-100">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Featured Products ── */}
      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Featured Products
              </h2>
              <p className="mt-1 text-gray-500">Our most loved picks</p>
            </div>
            <Link
              href="/shop"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Why Choose Us ── */}
      <section className="bg-gray-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Why Choose Sri Garments?
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                  {item.icon}
                </div>
                <h3 className="mb-2 text-base font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. WhatsApp CTA Banner ── */}
      <section className="bg-green-600 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <MessageCircle className="mx-auto mb-4 h-10 w-10 text-white/80" />
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Have a question?
          </h2>
          <p className="mt-2 text-green-100 text-base sm:text-lg">
            Chat with us on WhatsApp — we&apos;re happy to help you find the
            perfect garment.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-base font-semibold text-green-700 shadow-md hover:bg-green-50 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
