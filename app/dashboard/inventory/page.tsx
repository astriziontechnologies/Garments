import { Suspense } from "react";
import { Package, AlertTriangle, XCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { createClient } from "@/lib/supabase/server";
import { InventoryClient } from "./InventoryClient";

type InventoryRow = {
  id: string;
  product_variant_id: string;
  stock_quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  barcode: string | null;
  low_stock_threshold: number;
  updated_at: string;
  product_variant: {
    id: string;
    size: string | null;
    color: string | null;
    fabric: string | null;
    sku_suffix: string | null;
    product: {
      id: string;
      name: string;
      sku: string;
      thumbnail_url: string | null;
    } | null;
  } | null;
};

async function fetchInventory(): Promise<InventoryRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("inventory")
      .select(
        `
        *,
        product_variant:product_variants(
          id, size, color, fabric, sku_suffix,
          product:products(id, name, sku, thumbnail_url)
        )
      `
      )
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return (data as InventoryRow[]) ?? [];
  } catch {
    return [];
  }
}

function InventorySkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-16 ml-auto" />
              <Skeleton className="h-6 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function InventoryContent() {
  const inventory = await fetchInventory();

  const totalSKUs = inventory.length;
  const lowStockItems = inventory.filter(
    (i) => i.available_quantity > 0 && i.available_quantity <= i.low_stock_threshold
  ).length;
  const outOfStockItems = inventory.filter(
    (i) => i.available_quantity === 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total SKUs"
          value={totalSKUs}
          icon={<Package className="h-5 w-5" />}
          description="Tracked variants"
          color="blue"
        />
        <StatsCard
          title="Low Stock"
          value={lowStockItems}
          icon={<AlertTriangle className="h-5 w-5" />}
          description="Below threshold"
          color="orange"
        />
        <StatsCard
          title="Out of Stock"
          value={outOfStockItems}
          icon={<XCircle className="h-5 w-5" />}
          description="Zero available"
          color="red"
        />
      </div>

      <InventoryClient initialInventory={inventory} />
    </div>
  );
}

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage stock levels and track inventory movements
          </p>
        </div>
        <Button variant="outline" disabled>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-12" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <InventorySkeleton />
          </div>
        }
      >
        <InventoryContent />
      </Suspense>
    </div>
  );
}
