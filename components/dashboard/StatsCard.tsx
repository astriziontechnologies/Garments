import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: string;
  trendUp?: boolean;
  color?: "blue" | "green" | "orange" | "purple" | "red" | "gray";
}

const colorMap = {
  blue: {
    bg: "bg-blue-100",
    icon: "text-blue-600",
    trend: "text-blue-600",
  },
  green: {
    bg: "bg-green-100",
    icon: "text-green-600",
    trend: "text-green-600",
  },
  orange: {
    bg: "bg-orange-100",
    icon: "text-orange-600",
    trend: "text-orange-600",
  },
  purple: {
    bg: "bg-purple-100",
    icon: "text-purple-600",
    trend: "text-purple-600",
  },
  red: {
    bg: "bg-red-100",
    icon: "text-red-600",
    trend: "text-red-600",
  },
  gray: {
    bg: "bg-gray-100",
    icon: "text-gray-600",
    trend: "text-gray-600",
  },
};

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  trendUp,
  color = "blue",
}: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", colors.bg)}>
          <div className={cn("h-5 w-5", colors.icon)}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {(trend || description) && (
          <div className="flex items-center gap-1 mt-1">
            {trend && (
              <>
                {trendUp !== undefined && (
                  trendUp ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    trendUp === true && "text-green-600",
                    trendUp === false && "text-red-600",
                    trendUp === undefined && "text-muted-foreground"
                  )}
                >
                  {trend}
                </span>
              </>
            )}
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
