import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Shirt,
  PersonStanding,
  Baby,
  GraduationCap,
  Gem,
  ShoppingBag,
  Briefcase,
  Wind,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Explore all garment categories at Sri Garments — Men, Women, Kids, Uniforms, Sarees, and more.",
};

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

// TODO: Replace with Supabase server action fetch when DB is ready
interface Category {
  name: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  productCount: number;
  href: string;
  description: string;
}

const CATEGORIES: Category[] = [
  {
    name: "Men",
    icon: Shirt,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    productCount: 120,
    href: "/shop?category=Men",
    description: "Shirts, trousers, t-shirts, and more for the modern man.",
  },
  {
    name: "Women",
    icon: PersonStanding,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
    productCount: 95,
    href: "/shop?category=Women",
    description: "Kurtis, suits, sarees, and elegant women's wear.",
  },
  {
    name: "Kids",
    icon: Baby,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    productCount: 68,
    href: "/shop?category=Kids",
    description: "Comfortable and stylish clothing for boys and girls.",
  },
  {
    name: "Uniforms",
    icon: GraduationCap,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    productCount: 45,
    href: "/shop?category=Uniforms",
    description: "School, corporate, and institutional uniform sets.",
  },
  {
    name: "Sarees",
    icon: Gem,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    productCount: 82,
    href: "/shop?category=Sarees",
    description: "Silk, cotton, and designer sarees for every occasion.",
  },
  {
    name: "Accessories",
    icon: ShoppingBag,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    productCount: 34,
    href: "/shop?category=Accessories",
    description: "Bags, belts, scarves, and garment accessories.",
  },
  {
    name: "Formals",
    icon: Briefcase,
    iconBg: "bg-slate-50",
    iconColor: "text-slate-600",
    productCount: 57,
    href: "/shop?category=Formals",
    description: "Professional formal wear for office and events.",
  },
  {
    name: "Casuals",
    icon: Wind,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    productCount: 76,
    href: "/shop?category=Casuals",
    description: "Everyday casual wear that keeps you comfortable.",
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-14 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          All Categories
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-blue-100 text-base sm:text-lg">
          Find exactly what you&apos;re looking for — browse by category and
          discover quality garments for every occasion.
        </p>
      </div>

      {/* Category Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Icon */}
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${cat.iconBg} transition-opacity group-hover:opacity-80`}>
                  <Icon className={`h-8 w-8 ${cat.iconColor}`} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs font-medium text-gray-400">
                    {cat.productCount}+ Products
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
                    Shop Now <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
