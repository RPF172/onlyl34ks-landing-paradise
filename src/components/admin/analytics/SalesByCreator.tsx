
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CreatorSales {
  creator_id: string;
  creator_name: string;
  total_sales: number;
  orders_count: number;
}

interface SalesByCreatorProps {
  data: CreatorSales[];
}

export default function SalesByCreator({ data }: SalesByCreatorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Creator</CardTitle>
        <CardDescription>Revenue breakdown for each creator</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Creator</TableHead>
              <TableHead className="text-right">Total Sales</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Average Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No sales data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((creator) => (
                <TableRow key={creator.creator_id}>
                  <TableCell className="font-medium">{creator.creator_name}</TableCell>
                  <TableCell className="text-right">${creator.total_sales.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{creator.orders_count}</TableCell>
                  <TableCell className="text-right">
                    ${creator.orders_count > 0 
                      ? (creator.total_sales / creator.orders_count).toFixed(2) 
                      : '0.00'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
