import { Suspense } from "react";
import { Eye, Users, ShoppingBag, Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { MonthlyChart } from "@/components/analytics/MonthlyChart";
import { CustomerPieChart } from "@/components/analytics/CustomerPieChart";
import { createClient } from "@/lib/supabase/server";

// TODO: Replace with real top-products query from Supabase
const DUMMY_TOP_PRODUCTS = [
  { name: "Cotton Kurta Set", views: 1240, wishlists: 89 },
  { name: "Silk Saree Blouse", views: 980, wishlists: 64 },
  { name: "Linen Shirt Men", views: 876, wishlists: 52 },
  { name: "Palazzo Pants", views: 732, wishlists: 41 },
  { name: "Denim Jeans Regular", views: 698, wishlists: 38 },
];

async function fetchAnalyticsStats() {
  // TODO: Replace with real Supabase analytics queries
  let totalViews = 0;
  let uniqueCustomers = 0;
  let productViews = 0;
  let wishlistAdds = 0;

  try {
    const supabase = await createClient();
    const [allEvents, uvs, pvs, wa] = await Promise.allSettled([
      supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("analytics_events")
        .select("customer_id", { count: "exact", head: true })
        .not("customer_id", "is", null),
      supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("event_type", "product_view"),
      supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("event_type", "wishlist_add"),
    ]);

    if (allEvents.status === "fulfilled") totalViews = allEvents.value.count ?? 0;
    if (uvs.status === "fulfilled") uniqueCustomers = uvs.value.count ?? 0;
    if (pvs.status === "fulfilled") productViews = pvs.value.count ?? 0;
    if (wa.status === "fulfilled") wishlistAdds = wa.value.count ?? 0;
  } catch {
    // Supabase not configured — zeros are fine
  }

  return { totalViews, uniqueCustomers, productViews, wishlistAdds };
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

async function AnalyticsContent() {
  const { totalViews, uniqueCustomers, productViews, wishlistAdds } =
    await fetchAnalyticsStats();

  return (
    <div className="space-y-6">
      {/* Row 1: Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Views"
          value={totalViews.toLocaleString("en-IN")}
          icon={<Eye className="h-5 w-5" />}
          description="All page visits"
          color="blue"
        />
        <StatsCard
          title="Unique Customers"
          value={uniqueCustomers.toLocaleString("en-IN")}
          icon={<Users className="h-5 w-5" />}
          description="Logged-in sessions"
          color="green"
        />
        <StatsCard
          title="Product Views"
          value={productViews.toLocaleString("en-IN")}
          icon={<ShoppingBag className="h-5 w-5" />}
          description="Product page visits"
          color="purple"
        />
        <StatsCard
          title="Wishlist Adds"
          value={wishlistAdds.toLocaleString("en-IN")}
          icon={<Heart className="h-5 w-5" />}
          description="Items wishlisted"
          color="orange"
        />
      </div>

      {/* Row 2: Monthly Revenue Chart */}
      <MonthlyChart />

      {/* Row 3: Top Products + Customer Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Top Products
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {/* TODO: Replace with real query: SELECT p.name, COUNT(ae) as views, COUNT(w) as wishlists FROM products JOIN analytics_events ... */}
              By views and wishlists — showing dummy data
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Wishlists</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DUMMY_TOP_PRODUCTS.map((product, i) => (
                  <TableRow key={product.name}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-4">
                          {i + 1}.
                        </span>
                        <span className="text-sm font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {product.views.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-right text-sm text-rose-500">
                      {product.wishlists}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Customer Pie Chart */}
        <CustomerPieChart />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track store performance and customer behavior
        </p>
      </div>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}
