"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createProduct } from "@/lib/actions/products";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type Category = { id: string; name: string; parent_id: string | null };

type Variant = {
  size: string;
  color: string;
  fabric: string;
  price_adjustment: string;
};

const emptyVariant = (): Variant => ({
  size: "",
  color: "",
  fabric: "",
  price_adjustment: "0",
});

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [variants, setVariants] = useState<Variant[]>([emptyVariant()]);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategoryId, setMainCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [offerStatus, setOfferStatus] = useState(false);
  const [status, setStatus] = useState("draft");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [seoSlug, setSeoSlug] = useState("");

  // Auto-generate slug from name
  useEffect(() => {
    if (name) {
      const generated = slugify(name);
      setSlug(generated);
      setSeoSlug(generated);
    }
  }, [name]);

  // Fetch categories from Supabase client-side
  useEffect(() => {
    async function loadCategories() {
      try {
        const client = createClient();
        const { data } = await client
          .from("categories")
          .select("id, name, parent_id")
          .eq("is_active", true)
          .order("name");
        if (data) setCategories(data as Category[]);
      } catch {
        // ignore
      }
    }
    loadCategories();
  }, []);

  const mainCategories = categories.filter((c) => c.parent_id === null);
  const subcategories = categories.filter(
    (c) => c.parent_id === mainCategoryId
  );

  const addVariant = () => setVariants((v) => [...v, emptyVariant()]);
  const removeVariant = (i: number) =>
    setVariants((v) => v.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, field: keyof Variant, val: string) =>
    setVariants((v) =>
      v.map((variant, idx) => (idx === i ? { ...variant, [field]: val } : variant))
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !basePrice) {
      toast.error("Name, SKU, and Base Price are required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("sku", sku);
      formData.set("short_description", shortDescription);
      formData.set("description", description);
      formData.set("main_category_id", mainCategoryId);
      formData.set("subcategory_id", subcategoryId);
      formData.set("tags", tags);
      formData.set("base_price", basePrice);
      formData.set("discount_price", discountPrice);
      formData.set("offer_status", String(offerStatus));
      formData.set("status", status);
      formData.set("meta_title", metaTitle);
      formData.set("meta_description", metaDescription);
      formData.set("seo_slug", seoSlug);
      formData.set(
        "variants",
        JSON.stringify(variants.filter((v) => v.size || v.color || v.fabric))
      );

      const result = await createProduct(formData);
      if (result.success) {
        toast.success("Product created successfully!");
        router.push("/dashboard/products");
      } else {
        toast.error(result.error ?? "Failed to create product");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Product</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the details to add a new product to your catalog
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="name">
              Product Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Cotton Kurta Set"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">URL Slug (auto-generated)</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sku">
              SKU <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sku"
              placeholder="e.g. CKS-001"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="short_description">Short Description</Label>
            <Input
              id="short_description"
              placeholder="Brief product summary (shown in listings)"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed product description, materials, care instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category & Tags</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Main Category</Label>
            <Select value={mainCategoryId} onValueChange={(v) => { setMainCategoryId(v); setSubcategoryId(""); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select main category" />
              </SelectTrigger>
              <SelectContent>
                {mainCategories.length === 0 && (
                  <SelectItem value="_none" disabled>No categories found</SelectItem>
                )}
                {mainCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Subcategory</Label>
            <Select
              value={subcategoryId}
              onValueChange={setSubcategoryId}
              disabled={!mainCategoryId || subcategories.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={!mainCategoryId ? "Select main category first" : "Select subcategory"} />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="e.g. cotton, summer, festive, women"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pricing</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="base_price">
              Base Price (₹) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="base_price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="discount_price">Discount Price (₹)</Label>
            <Input
              id="discount_price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Offer Active</Label>
            <div className="flex items-center gap-2 pt-2">
              <Switch
                id="offer_status"
                checked={offerStatus}
                onCheckedChange={setOfferStatus}
              />
              <Label htmlFor="offer_status" className="cursor-pointer text-sm text-muted-foreground">
                {offerStatus ? "Offer is active" : "No active offer"}
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Publication Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5 max-w-xs">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              placeholder="SEO title for search engines"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              placeholder="SEO description (150-160 characters recommended)"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seo_slug">SEO Slug</Label>
            <Input
              id="seo_slug"
              placeholder="seo-friendly-url-slug"
              value={seoSlug}
              onChange={(e) => setSeoSlug(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Product Variants</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            <Plus className="h-4 w-4" />
            Add Variant
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {variants.map((variant, i) => (
            <div key={i}>
              {i > 0 && <Separator className="mb-4" />}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <div className="space-y-1.5">
                  <Label className="text-xs">Size</Label>
                  <Input
                    placeholder="S / M / L / XL"
                    value={variant.size}
                    onChange={(e) => updateVariant(i, "size", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Color</Label>
                  <Input
                    placeholder="Red, Blue..."
                    value={variant.color}
                    onChange={(e) => updateVariant(i, "color", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Fabric</Label>
                  <Input
                    placeholder="Cotton, Silk..."
                    value={variant.fabric}
                    onChange={(e) => updateVariant(i, "fabric", e.target.value)}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="space-y-1.5 flex-1">
                    <Label className="text-xs">Price Adj. (₹)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      value={variant.price_adjustment}
                      onChange={(e) => updateVariant(i, "price_adjustment", e.target.value)}
                    />
                  </div>
                  {variants.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariant(i)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 mb-0.5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center gap-3 pb-8">
        <Button type="submit" disabled={loading} className="min-w-32">
          {loading ? "Creating..." : "Create Product"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/products">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
