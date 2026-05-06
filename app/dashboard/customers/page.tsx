import { Suspense } from "react";
import { Users, UserCheck, Handshake, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { createClient } from "@/lib/supabase/server";
import { CustomersClient } from "./CustomersClient";

type Customer = {
  id: string;
  name: string;
  email: string;
  mobile_number: string | null;
  city: string | null;
  customer_type: string;
  last_purchase_date: string | null;
  is_active: boolean;
  created_at: string;
};

async function fetchCustomers(): Promise<Customer[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as Customer[]) ?? [];
  } catch {
    return [];
  }
}

function CustomersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

async function CustomersContent() {
  const customers = await fetchCustomers();

  const total = customers.length;
  const retail = customers.filter((c) => c.customer_type === "retail").length;
  const dealer = customers.filter((c) => c.customer_type === "dealer").length;
  const wholesaler = customers.filter(
    (c) => c.customer_type === "wholesaler"
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Total Customers"
          value={total}
          icon={<Users className="h-5 w-5" />}
          color="blue"
        />
        <StatsCard
          title="Retail"
          value={retail}
          icon={<UserCheck className="h-5 w-5" />}
          color="green"
        />
        <StatsCard
          title="Dealer"
          value={dealer}
          icon={<Handshake className="h-5 w-5" />}
          color="purple"
        />
        <StatsCard
          title="Wholesaler"
          value={wholesaler}
          icon={<Store className="h-5 w-5" />}
          color="orange"
        />
      </div>
      <CustomersClient initialCustomers={customers} />
    </div>
  );
}

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your customer relationships
        </p>
      </div>

      <Suspense fallback={<CustomersSkeleton />}>
        <CustomersContent />
      </Suspense>
    </div>
  );
}
