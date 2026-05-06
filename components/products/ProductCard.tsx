"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ProductCardProps {
  id?: string | number;
  name?: string;
  slug?: string;
  base_price?: number;
  discount_price?: number;
  thumbnail_url?: string;
  offer_status?: boolean;
}

const WHATSAPP_BASE =
  "https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%27m%20interested%20in%20";

export default function ProductCard({
  id = "1",
  name = "Sample Product",
  slug = "sample-product",
  base_price = 999,
  discount_price,
  thumbnail_url,
  offer_status = false,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  const whatsappUrl =
    WHATSAPP_BASE + encodeURIComponent(name);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      {/* Image */}
      <Link href={`/product/${slug}`} className="relative block overflow-hidden aspect-square bg-gray-50">
        <Image
          src={thumbnail_url || "/placeholder-product.svg"}
          alt={name}
          width={400}
          height={400}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {offer_status && (
          <Badge className="absolute left-2 top-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
            OFFER
          </Badge>
        )}
        {/* Wishlist button overlay */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setWishlisted((prev) => !prev);
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow transition-colors",
            wishlisted
              ? "border-red-300 text-red-500"
              : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500"
          )}
        >
          <Heart
            className="h-4 w-4"
            fill={wishlisted ? "currentColor" : "none"}
          />
        </button>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={`/product/${slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-800 leading-snug hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-center gap-2 flex-wrap">
          {discount_price ? (
            <>
              <span className="text-base font-bold text-blue-700">
                ₹{discount_price.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₹{base_price.toLocaleString("en-IN")}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-blue-700">
              ₹{base_price.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* WhatsApp Inquiry */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-1.5 rounded-md bg-green-500 py-1.5 text-xs font-semibold text-white hover:bg-green-600 transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          WhatsApp Inquiry
        </a>
      </div>
    </div>
  );
}
