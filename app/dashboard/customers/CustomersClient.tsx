"use client";

import { useState, useMemo } from "react";
import { Search, Users, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

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

const typeColors: Record<string, string> = {
  retail: "bg-blue-100 text-blue-700 border-blue-200",
  dealer: "bg-purple-100 text-purple-700 border-purple-200",
  wholesaler: "bg-orange-100 text-orange-700 border-orange-200",
};

interface CustomersClientProps {
  initialCustomers: Customer[];
}

export function CustomersClient({ initialCustomers }: CustomersClientProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    return initialCustomers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.mobile_number ?? "").includes(search) ||
        (c.city ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesType =
        typeFilter === "all" || c.customer_type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [initialCustomers, search, typeFilter]);

  const handleTypeChange = (val: string) => setTypeFilter(val);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, mobile, city..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); }}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={typeFilter} onValueChange={handleTypeChange}>
        <TabsList>
          <TabsTrigger value="all">
            All{" "}
            <span className="ml-1.5 text-xs bg-muted rounded px-1">
              {initialCustomers.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="retail">
            Retail{" "}
            <span className="ml-1.5 text-xs bg-blue-100 text-blue-700 rounded px-1">
              {initialCustomers.filter((c) => c.customer_type === "retail").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="dealer">
            Dealer{" "}
            <span className="ml-1.5 text-xs bg-purple-100 text-purple-700 rounded px-1">
              {initialCustomers.filter((c) => c.customer_type === "dealer").length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="wholesaler">
            Wholesaler{" "}
            <span className="ml-1.5 text-xs bg-orange-100 text-orange-700 rounded px-1">
              {initialCustomers.filter((c) => c.customer_type === "wholesaler").length}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last Purchase</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Users className="h-8 w-8 opacity-40" />
                      <p className="text-sm">No customers found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <p className="text-sm font-medium">{customer.name}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {customer.email}
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {customer.mobile_number ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {customer.city ?? "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${typeColors[customer.customer_type] ?? ""}`}
                      >
                        {customer.customer_type}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {customer.last_purchase_date
                        ? formatDate(customer.last_purchase_date)
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          customer.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {customer.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
