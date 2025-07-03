
import React from 'react';
import DashboardStats from '@/components/dashboard/shared/DashboardStats';
import FinancialDashboard from '@/components/dashboard/shared/FinancialDashboard';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, Star } from 'lucide-react';

export default function SellerOverviewTab() {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: "Total Products",
      value: 45,
      description: "Active listings",
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Total Orders",
      value: 156,
      description: "All time orders",
      icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Active Customers",
      value: 105,
      description: "Customers this month",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 6, isPositive: true }
    },
    {
      title: "Avg. Rating",
      value: "4.7",
      description: "Product ratings",
      icon: <Star className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 3, isPositive: true }
    }
  ];

  const chartData = [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 1900 },
    { name: 'Mar', value: 2400 },
    { name: 'Apr', value: 1800 },
    { name: 'May', value: 2800 },
    { name: 'Jun', value: 3200 },
  ];

  return (
    <div className="space-y-8">
      <DashboardStats
        title="Seller Dashboard"
        description="Welcome back! Here's an overview of your e-commerce business."
        stats={stats}
        chartData={chartData}
        chartTitle="Monthly Revenue Trend"
        chartDescription="Your sales performance over the last 6 months"
      />
      
      <FinancialDashboard userRole="seller" />
    </div>
  );
}
