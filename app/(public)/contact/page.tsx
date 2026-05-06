"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, MessageCircle, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WHATSAPP_URL =
  "https://wa.me/91XXXXXXXXXX?text=Hi%2C%20I%27m%20interested%20in%20your%20products";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (data.phone && !/^[6-9]\d{9}$/.test(data.phone.replace(/\s/g, ""))) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }
  if (!data.message.trim()) errors.message = "Message is required.";
  else if (data.message.trim().length < 10)
    errors.message = "Message must be at least 10 characters.";
  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      // TODO: Wire to Supabase server action or email API
      await new Promise((res) => setTimeout(res, 1200)); // Simulated delay
      toast.success("Message sent!", {
        description:
          "Thank you for reaching out. We'll get back to you shortly.",
      });
      setForm({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-14 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          Contact Us
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-blue-100 text-base sm:text-lg">
          Have a question or need assistance? We&apos;re here to help — reach
          out and we&apos;ll respond within 24 hours.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* ── Contact Form ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={cn(errors.name && "border-red-400 focus-visible:ring-red-400")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className={cn(errors.email && "border-red-400 focus-visible:ring-red-400")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className={cn(errors.phone && "border-red-400 focus-visible:ring-red-400")}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="message">
                  Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  className={cn(errors.message && "border-red-400 focus-visible:ring-red-400")}
                />
                {errors.message && (
                  <p className="text-xs text-red-500">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 font-semibold"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* ── Contact Info ── */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Get in touch
              </h2>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Address</p>
                    <p className="mt-0.5 text-sm text-gray-500 leading-relaxed">
                      123, Garment Street, T. Nagar,
                      <br />
                      Chennai, Tamil Nadu — 600 017
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Phone</p>
                    <a
                      href="tel:+91XXXXXXXXXX"
                      className="mt-0.5 block text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      +91-XXXXXXXXXX
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Email</p>
                    <a
                      href="mailto:info@srigarments.com"
                      className="mt-0.5 block text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      info@srigarments.com
                    </a>
                  </div>
                </li>
              </ul>

              {/* WhatsApp CTA */}
              <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-4">
                <p className="text-sm font-semibold text-green-800 mb-2">
                  Prefer chatting?
                </p>
                <p className="text-xs text-green-700 mb-3">
                  Reach us instantly on WhatsApp for quick support and product
                  inquiries.
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-900 uppercase tracking-wide">
                Business Hours
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  ["Monday – Friday", "9:00 AM – 7:00 PM"],
                  ["Saturday", "9:00 AM – 6:00 PM"],
                  ["Sunday", "10:00 AM – 4:00 PM"],
                ].map(([day, time]) => (
                  <li key={day} className="flex justify-between text-gray-600">
                    <span>{day}</span>
                    <span className="font-medium text-gray-800">{time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
