"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

function extractErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

export async function getProducts() {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("products")
      .select(
        `
        *,
        main_category:categories!products_main_category_id_fkey(id, name),
        subcategory:categories!products_subcategory_id_fkey(id, name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data: (data ?? []) as unknown[] };
  } catch (error) {
    console.error("getProducts error:", error);
    return { success: false, data: [], error: extractErrorMessage(error) };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("products")
      .select(
        `
        *,
        main_category:categories!products_main_category_id_fkey(id, name),
        subcategory:categories!products_subcategory_id_fkey(id, name),
        product_variants(*),
        product_images(*)
      `
      )
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("getProductBySlug error:", error);
    return { success: false, data: null, error: extractErrorMessage(error) };
  }
}

export async function createProduct(formData: FormData) {
  try {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const shortDescription = formData.get("short_description") as string;
    const description = formData.get("description") as string;
    const mainCategoryId = formData.get("main_category_id") as string;
    const subcategoryId = formData.get("subcategory_id") as string;
    const tagsRaw = formData.get("tags") as string;
    const basePrice = parseFloat(formData.get("base_price") as string) || 0;
    const discountPriceRaw = formData.get("discount_price") as string;
    const discountPrice = discountPriceRaw ? parseFloat(discountPriceRaw) : null;
    const offerStatus = formData.get("offer_status") === "true";
    const status = (formData.get("status") as string) || "draft";
    const metaTitle = formData.get("meta_title") as string;
    const metaDescription = formData.get("meta_description") as string;
    const seoSlug =
      (formData.get("seo_slug") as string) || slugify(name);

    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const slug = slugify(name);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("products")
      .insert({
        name,
        sku,
        slug,
        short_description: shortDescription || null,
        description: description || null,
        main_category_id: mainCategoryId || null,
        subcategory_id: subcategoryId || null,
        tags,
        base_price: basePrice,
        discount_price: discountPrice,
        offer_status: offerStatus,
        status,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        seo_slug: seoSlug || null,
      })
      .select()
      .single();

    if (error) throw error;

    // Handle variants
    const variantsRaw = formData.get("variants") as string;
    if (variantsRaw && data) {
      try {
        const variants = JSON.parse(variantsRaw);
        if (Array.isArray(variants) && variants.length > 0) {
          const variantInserts = variants.map((v) => ({
            product_id: data.id,
            size: v.size || null,
            color: v.color || null,
            fabric: v.fabric || null,
            price_adjustment: parseFloat(v.price_adjustment) || 0,
            is_active: true,
          }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from("product_variants").insert(variantInserts);
        }
      } catch {
        // ignore variant parse errors
      }
    }

    revalidatePath("/dashboard/products");
    return { success: true, data };
  } catch (error) {
    console.error("createProduct error:", error);
    return { success: false, data: null, error: extractErrorMessage(error) };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const sku = formData.get("sku") as string;
    const shortDescription = formData.get("short_description") as string;
    const description = formData.get("description") as string;
    const mainCategoryId = formData.get("main_category_id") as string;
    const subcategoryId = formData.get("subcategory_id") as string;
    const tagsRaw = formData.get("tags") as string;
    const basePrice = parseFloat(formData.get("base_price") as string) || 0;
    const discountPriceRaw = formData.get("discount_price") as string;
    const discountPrice = discountPriceRaw ? parseFloat(discountPriceRaw) : null;
    const offerStatus = formData.get("offer_status") === "true";
    const status = formData.get("status") as string;
    const metaTitle = formData.get("meta_title") as string;
    const metaDescription = formData.get("meta_description") as string;
    const seoSlug = formData.get("seo_slug") as string;

    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("products")
      .update({
        name,
        sku,
        slug: slugify(name),
        short_description: shortDescription || null,
        description: description || null,
        main_category_id: mainCategoryId || null,
        subcategory_id: subcategoryId || null,
        tags,
        base_price: basePrice,
        discount_price: discountPrice,
        offer_status: offerStatus,
        status,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        seo_slug: seoSlug || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/products");
    return { success: true, data };
  } catch (error) {
    console.error("updateProduct error:", error);
    return { success: false, data: null, error: extractErrorMessage(error) };
  }
}

export async function deleteProduct(id: string) {
  try {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("products").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("deleteProduct error:", error);
    return { success: false, error: extractErrorMessage(error) };
  }
}
