import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/server";
import { ProductsClient } from "./ProductsClient";

async function fetchProducts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        main_category:categories!products_main_category_id_fkey(id, name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

function ProductsTableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24 ml-auto" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function ProductsContent() {
  const products = await fetchProducts();
  return <ProductsClient initialProducts={products} />;
}

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Suspense fallback={<ProductsTableSkeleton />}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
