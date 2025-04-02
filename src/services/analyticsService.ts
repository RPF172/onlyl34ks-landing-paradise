
import { supabase } from '@/integrations/supabase/client';

interface SalesAnalytics {
  total_revenue: number;
  total_orders: number;
  avg_order_value: number;
}

interface CreatorSales {
  creator_id: string;
  creator_name: string;
  total_sales: number;
  orders_count: number;
}

export const fetchSalesAnalytics = async (): Promise<SalesAnalytics> => {
  // @ts-ignore - Using a custom RPC function that TypeScript doesn't know about yet
  const { data, error } = await supabase
    .rpc('get_sales_analytics')
    .single();

  if (error) {
    console.error('Error fetching sales analytics:', error);
    throw new Error(error.message);
  }

  return data as SalesAnalytics;
};

export const fetchSalesByCreator = async (): Promise<CreatorSales[]> => {
  // @ts-ignore - Using a custom RPC function that TypeScript doesn't know about yet
  const { data, error } = await supabase
    .rpc('get_sales_by_creator');

  if (error) {
    console.error('Error fetching sales by creator:', error);
    throw new Error(error.message);
  }

  return data as CreatorSales[];
};
