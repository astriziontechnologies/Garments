"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerPieChartProps {
  // TODO: Replace with real data from Supabase customers grouped by customer_type
  retail?: number;
  dealer?: number;
  wholesaler?: number;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

export function CustomerPieChart({
  retail = 68,
  dealer = 22,
  wholesaler = 10,
}: CustomerPieChartProps) {
  // TODO: Pull real counts from Supabase: SELECT customer_type, COUNT(*) FROM customers GROUP BY customer_type
  const data = [
    { name: "Retail", value: retail },
    { name: "Dealer", value: dealer },
    { name: "Wholesaler", value: wholesaler },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Customer Types
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {/* TODO: Replace dummy data with Supabase query */}
          Distribution by customer category
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value}%`,
                name,
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "13px",
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
