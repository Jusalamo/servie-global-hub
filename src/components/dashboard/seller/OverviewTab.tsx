import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSellerStats } from "@/hooks/useSellerStats";
import { CompactStatsGrid } from "@/components/dashboard/CompactStatsGrid";

export default function OverviewTab() {
  const { stats, isLoading } = useSellerStats();

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  // Stats for compact grid
  const statsData = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue}`,
      description: 'Total revenue',
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      description: 'Lifetime orders',
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      title: 'Avg. Order Value',
      value: `$${stats.averageOrderValue}`,
      description: 'Per order',
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      description: 'Unique buyers',
      icon: <Users className="h-4 w-4" />,
    },
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Seller Dashboard Overview</h2>
      
      {/* Compact Stats Grid - optimized for mobile */}
      <CompactStatsGrid stats={statsData} />
      
      {stats.totalOrders === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Start selling to see your analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You haven't made any sales yet. Add products and start selling to see your dashboard analytics!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Your sales performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Detailed analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest orders from your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Order history coming soon</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
