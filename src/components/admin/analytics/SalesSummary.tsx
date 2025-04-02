
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList, CartesianGrid } from "recharts";

interface SalesAnalytics {
  total_revenue: number;
  total_orders: number;
  avg_order_value: number;
}

interface SalesSummaryProps {
  data: SalesAnalytics;
}

export default function SalesSummary({ data }: SalesSummaryProps) {
  const chartData = [
    {
      name: "Total Revenue",
      value: data.total_revenue,
      color: "#2563eb",
      formatted: `$${data.total_revenue.toFixed(2)}`
    },
    {
      name: "Avg. Order Value",
      value: data.avg_order_value,
      color: "#10b981",
      formatted: `$${data.avg_order_value.toFixed(2)}`
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
          <CardDescription>Overall platform earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${data.total_revenue.toFixed(2)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
          <CardDescription>Number of completed purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{data.total_orders}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Avg. Order Value</CardTitle>
          <CardDescription>Average revenue per order</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${data.avg_order_value.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Visual representation of platform revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer
              config={{ data: { color: "#2563eb" } }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent 
                        labelFormatter={(label) => `${label}`}
                      />
                    }
                  />
                  <Bar dataKey="value" fill="#2563eb">
                    <LabelList dataKey="formatted" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
