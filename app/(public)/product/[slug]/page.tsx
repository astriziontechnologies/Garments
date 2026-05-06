import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, MessageCircle, Star, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ProductCard, { ProductCardProps } from "@/components/products/ProductCard";

// TODO: Replace with Supabase server action fetch when DB is ready
interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  discount_price?: number;
  offer_status: boolean;
  description: string;
  sizes: string[];
  colors: string[];
  rating: number;
  review_count: number;
}

const DUMMY_PRODUCT: Product = {
  id: 1,
  name: "Classic White Formal Shirt",
  slug: "classic-white-formal-shirt",
  base_price: 1299,
  discount_price: 999,
  offer_status: true,
  description:
    "A timeless classic white formal shirt crafted from premium 100% cotton fabric. Features a regular fit, full sleeves, and a spread collar. Machine washable and wrinkle-resistant for everyday convenience.",
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: ["White", "Light Blue", "Off White"],
  rating: 4.5,
  review_count: 128,
};

const RELATED_PRODUCTS: ProductCardProps[] = [
  { id: 5, name: "Men Slim Chinos",    slug: "mens-slim-chinos",    base_price: 1499, discount_price: 1199, offer_status: true  },
  { id: 8, name: "Men Polo T-Shirt",   slug: "mens-polo-tshirt",    base_price: 699,                        offer_status: false },
  { id: 2, name: "Casual Cotton Kurti",slug: "casual-cotton-kurti", base_price: 899,                        offer_status: false },
  { id: 6, name: "School Uniform Set", slug: "school-uniform-set",  base_price: 799,                        offer_status: false },
];

const WHATSAPP_BASE =
  "https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%27m%20interested%20in%20";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const productName = slug
    .split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: productName,
    description: `Buy ${productName} at Sri Garments.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  const product = DUMMY_PRODUCT;
  const whatsappUrl = WHATSAPP_BASE + encodeURIComponent(product.name);
  const thumbnails = [
    "/placeholder-product.svg",
    "/placeholder-product.svg",
    "/placeholder-product.svg",
    "/placeholder-product.svg",
  ];
  const fullStars = Math.floor(product.rating);
  const hasHalf = product.rating % 1 >= 0.5;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <Link href="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
        </nav>

        {/* Product Main */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <Image
                src="/placeholder-product.svg"
                alt={product.name}
                width={600}
                height={600}
                className="h-full w-full object-cover"
                priority
              />
              {product.offer_status && (
                <Badge className="absolute left-3 top-3 bg-red-500 text-white font-bold">
                  OFFER
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {thumbnails.map((src, idx) => (
                <button
                  key={idx}
                  className="relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50 hover:border-blue-400 transition-colors"
                >
                  <Image src={src} alt={`Thumbnail ${idx + 1}`} width={100} height={100} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-snug sm:text-3xl">{product.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < fullStars ? "fill-yellow-400 text-yellow-400" : i === fullStars && hasHalf ? "fill-yellow-200 text-yellow-400" : "fill-gray-200 text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{product.rating} ({product.review_count} reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              {product.discount_price ? (
                <>
                  <span className="text-3xl font-extrabold text-blue-700">&#8377;{product.discount_price.toLocaleString("en-IN")}</span>
                  <span className="text-lg text-gray-400 line-through">&#8377;{product.base_price.toLocaleString("en-IN")}</span>
                  <Badge className="bg-red-100 text-red-600 text-xs font-bold">
                    {Math.round(((product.base_price - product.discount_price) / product.base_price) * 100)}% OFF
                  </Badge>
                </>
              ) : (
                <span className="text-3xl font-extrabold text-blue-700">&#8377;{product.base_price.toLocaleString("en-IN")}</span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>

            <Separator />

            <div>
              <p className="mb-2 text-sm font-semibold text-gray-700">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-gray-700">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button key={color} className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors">
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-gray-700">Quantity</p>
              <div className="flex items-center">
                <button className="flex h-9 w-9 items-center justify-center rounded-l-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-9 w-12 items-center justify-center border-y border-gray-300 text-sm font-medium">1</span>
                <button className="flex h-9 w-9 items-center justify-center rounded-r-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                Inquire on WhatsApp
              </a>
              <Button variant="outline" className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Wishlist
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-14">
          <Tabs defaultValue="description">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.review_count})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6 prose prose-sm max-w-none text-gray-700">
              <p>{product.description}</p>
              <ul className="mt-4 list-disc pl-5 space-y-1 text-sm">
                <li>100% premium cotton fabric</li>
                <li>Regular fit, full sleeves</li>
                <li>Spread collar design</li>
                <li>Machine washable and wrinkle-resistant</li>
                <li>Available in multiple sizes and colors</li>
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              {/* TODO: Fetch reviews from Supabase */}
              <div className="space-y-4">
                {[
                  { name: "Rajesh K.", comment: "Excellent quality! Very comfortable to wear.", stars: 5 },
                  { name: "Priya S.",  comment: "Good fit and nice fabric. Highly recommend.",  stars: 4 },
                  { name: "Anbu M.",  comment: "Great product for the price.",                  stars: 4 },
                ].map((review, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-800">{review.name}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s < review.stars ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-300"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-14">
          <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">Related Products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
            {RELATED_PRODUCTS.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}