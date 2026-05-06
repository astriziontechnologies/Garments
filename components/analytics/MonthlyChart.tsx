"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// TODO: Replace with real Supabase query grouping orders by month
const DUMMY_MONTHLY_DATA = [
  { month: "Jul", revenue: 42000 },
  { month: "Aug", revenue: 58000 },
  { month: "Sep", revenue: 51000 },
  { month: "Oct", revenue: 67000 },
  { month: "Nov", revenue: 89000 },
  { month: "Dec", revenue: 112000 },
  { month: "Jan", revenue: 78000 },
  { month: "Feb", revenue: 65000 },
  { month: "Mar", revenue: 93000 },
  { month: "Apr", revenue: 81000 },
  { month: "May", revenue: 74000 },
  { month: "Jun", revenue: 96000 },
];

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export function MonthlyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Monthly Revenue
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {/* TODO: Pull real revenue data from Supabase orders table grouped by month */}
          Showing dummy data — connect Supabase orders to replace
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={DUMMY_MONTHLY_DATA}
            margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip
              formatter={(value: number) => [formatINR(value), "Revenue"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
