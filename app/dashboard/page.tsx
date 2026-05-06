import { Suspense } from "react";
import { Package, Users, AlertTriangle, Tag, ShoppingBag } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";

// ─── Dummy fallback data ──────────────────────────────────────────────────────
const DUMMY_PRODUCTS = [
  { id: "1", name: "Cotton Kurta Set", sku: "CKS-001", status: "active", base_price: 1299, created_at: "2025-01-10" },
  { id: "2", name: "Silk Saree Blouse", sku: "SSB-002", status: "active", base_price: 2499, created_at: "2025-01-08" },
  { id: "3", name: "Denim Jeans Regular", sku: "DJR-003", status: "draft", base_price: 899, created_at: "2025-01-06" },
  { id: "4", name: "Linen Shirt Men", sku: "LSM-004", status: "active", base_price: 749, created_at: "2025-01-05" },
  { id: "5", name: "Palazzo Pants", sku: "PLP-005", status: "out_of_stock", base_price: 599, created_at: "2025-01-03" },
];

const DUMMY_CUSTOMERS = [
  { id: "1", name: "Priya Sharma", email: "priya@example.com", city: "Chennai", customer_type: "retail", created_at: "2025-01-09" },
  { id: "2", name: "Ravi Textiles", email: "ravi@textiles.com", city: "Coimbatore", customer_type: "dealer", created_at: "2025-01-07" },
  { id: "3", name: "Meena Reddy", email: "meena@gmail.com", city: "Hyderabad", customer_type: "retail", created_at: "2025-01-05" },
  { id: "4", name: "Kumar Wholesale", email: "kumar@wholesale.in", city: "Erode", customer_type: "wholesaler", created_at: "2025-01-04" },
  { id: "5", name: "Anitha Krishnan", email: "anitha@gmail.com", city: "Madurai", customer_type: "retail", created_at: "2025-01-02" },
];

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
  out_of_stock: "bg-red-100 text-red-700",
  archived: "bg-gray-100 text-gray-600",
};

const typeColors: Record<string, string> = {
  retail: "bg-blue-100 text-blue-700",
  dealer: "bg-purple-100 text-purple-700",
  wholesaler: "bg-orange-100 text-orange-700",
};

async function DashboardStats() {
  let productsCount = 0;
  let customersCount = 0;
  let lowStockCount = 0;
  let activeCouponsCount = 0;

  try {
    const supabase = await createClient();

    const [products, customers, lowStock, coupons] = await Promise.allSettled([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase
        .from("inventory")
        .select("id", { count: "exact", head: true })
        .lt("available_quantity", 10),
      supabase
        .from("coupons")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
    ]);

    if (products.status === "fulfilled" && products.value.count !== null) {
      productsCount = products.value.count;
    }
    if (customers.status === "fulfilled" && customers.value.count !== null) {
      customersCount = customers.value.count;
    }
    if (lowStock.status === "fulfilled" && lowStock.value.count !== null) {
      lowStockCount = lowStock.value.count;
    }
    if (coupons.status === "fulfilled" && coupons.value.count !== null) {
      activeCouponsCount = coupons.value.count;
    }
  } catch {
    // Supabase not configured — use zeros
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatsCard
        title="Total Products"
        value={productsCount}
        icon={<Package className="h-5 w-5" />}
        trend="Across all categories"
        color="blue"
      />
      <StatsCard
        title="Total Customers"
        value={customersCount}
        icon={<Users className="h-5 w-5" />}
        trend="Retail, Dealer & Wholesale"
        color="green"
      />
      <StatsCard
        title="Low Stock Items"
        value={lowStockCount}
        icon={<AlertTriangle className="h-5 w-5" />}
        trend={lowStockCount > 0 ? "Needs restocking" : "Stock levels OK"}
        trendUp={lowStockCount === 0}
        color="orange"
      />
      <StatsCard
        title="Active Coupons"
        value={activeCouponsCount}
        icon={<Tag className="h-5 w-5" />}
        trend="Currently active"
        color="purple"
      />
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back! Here&apos;s what&apos;s happening at Sri Garments.
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-blue-500" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
              <div className="text-center">
                <p className="text-muted-foreground text-sm font-medium">
                  Chart coming soon
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect Supabase orders table to display revenue trends
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "This Month Sales", value: "₹1,24,500", up: true },
              { label: "Avg Order Value", value: "₹1,850", up: true },
              { label: "Return Rate", value: "2.4%", up: false },
              { label: "New Customers", value: "34", up: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span
                  className={`text-sm font-semibold ${
                    item.up ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Recent Products
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DUMMY_PRODUCTS.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-sm">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {product.sku}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatCurrency(product.base_price)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[product.status]}`}
                      >
                        {product.status.replace("_", " ")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Recent Customers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DUMMY_CUSTOMERS.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {customer.city}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${typeColors[customer.customer_type]}`}
                      >
                        {customer.customer_type}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(customer.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
