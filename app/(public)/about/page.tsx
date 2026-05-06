import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Users, Layers, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Sri Garments — our story, values, and commitment to quality craftsmanship.",
};

const STATS = [
  { label: "Products", value: "500+", icon: <Layers className="h-7 w-7 text-blue-500" /> },
  { label: "Happy Customers", value: "1,000+", icon: <Users className="h-7 w-7 text-blue-500" /> },
  { label: "Years of Experience", value: "10+", icon: <Award className="h-7 w-7 text-blue-500" /> },
];

const VALUES = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
    title: "Uncompromising Quality",
    desc: "Every thread, every stitch — we hold our garments to the highest standard before they reach you.",
  },
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Customer First",
    desc: "Our customers are at the heart of everything we do. Your satisfaction drives our passion.",
  },
  {
    icon: <Layers className="h-8 w-8 text-blue-600" />,
    title: "Inclusive Range",
    desc: "From kids to seniors, casual to formal — we believe everyone deserves great clothing.",
  },
  {
    icon: <Award className="h-8 w-8 text-blue-600" />,
    title: "Trusted Craftsmanship",
    desc: "A decade of expertise in garment manufacturing and retail — built on trust and excellence.",
  },
];

const TEAM = [
  { name: "Ramesh Kumar", role: "Founder & CEO", initials: "RK" },
  { name: "Meena Devi", role: "Head of Design", initials: "MD" },
  { name: "Suresh Babu", role: "Operations Manager", initials: "SB" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-indigo-800 px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            About Sri Garments
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">
            Quality Garments, Trusted Craftsmanship — serving families across
            Tamil Nadu for over a decade.
          </p>
        </div>
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      </section>

      {/* ── Stats ── */}
      <section className="bg-blue-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm"
              >
                {stat.icon}
                <span className="text-4xl font-extrabold text-blue-700">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-gray-600">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-md">
              <Image
                src="/placeholder-store.svg"
                alt="Sri Garments store"
                width={600}
                height={450}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Text */}
            <div className="flex flex-col gap-5">
              <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Our Story
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-snug sm:text-4xl">
                A Legacy of Quality &amp; Care
              </h2>
              <p className="text-base leading-relaxed text-gray-600">
                Founded over a decade ago, Sri Garments began as a small family
                shop with a simple mission — to offer the highest quality
                garments at honest prices. Over the years, we have grown into a
                trusted name for men, women, kids, and institutional uniforms
                across Tamil Nadu.
              </p>
              <p className="text-base leading-relaxed text-gray-600">
                We work directly with skilled artisans and reputed fabric mills
                to ensure every piece reflects the care we put into our craft.
                From everyday casuals to festive sarees and office formals, our
                collection is curated with love and purpose.
              </p>
              <p className="text-base leading-relaxed text-gray-600">
                Today, Sri Garments continues to serve over 1,000 happy
                customers — and that number grows every day. We are proud of
                the relationships we have built and the smiles our garments
                have brought.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-gray-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Our Values
            </h2>
            <p className="mt-2 text-gray-500">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((val) => (
              <div
                key={val.title}
                className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                  {val.icon}
                </div>
                <h3 className="mb-2 text-base font-semibold text-gray-900">
                  {val.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Meet the Team
            </h2>
            <p className="mt-2 text-gray-500">
              The people behind Sri Garments
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                  {member.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
