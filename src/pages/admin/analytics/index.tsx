
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/layouts/AdminLayout";
import { fetchSalesAnalytics, fetchSalesByCreator } from "@/services/analyticsService";
import SalesSummary from "@/components/admin/analytics/SalesSummary";
import SalesByCreator from "@/components/admin/analytics/SalesByCreator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function AdminAnalyticsPage() {
  const { toast } = useToast();
  
  const { 
    data: summaryData, 
    isLoading: isSummaryLoading,
    error: summaryError
  } = useQuery({
    queryKey: ['salesAnalytics'],
    queryFn: fetchSalesAnalytics,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error loading sales data",
          description: error.message || "Unknown error occurred",
          variant: "destructive"
        });
      }
    }
  });
  
  const { 
    data: creatorData, 
    isLoading: isCreatorLoading,
    error: creatorError
  } = useQuery({
    queryKey: ['salesByCreator'],
    queryFn: fetchSalesByCreator,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error loading creator sales data",
          description: error.message || "Unknown error occurred",
          variant: "destructive"
        });
      }
    }
  });

  const isLoading = isSummaryLoading || isCreatorLoading;
  const hasError = summaryError || creatorError;

  return (
    <AdminLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Sales Analytics</h1>
        
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        )}
        
        {!isLoading && !hasError && (
          <div className="space-y-8">
            {summaryData && <SalesSummary data={summaryData} />}
            {creatorData && <SalesByCreator data={creatorData} />}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
