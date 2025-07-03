
import React from 'react';
import DashboardStats from '@/components/dashboard/shared/DashboardStats';
import FinancialDashboard from '@/components/dashboard/shared/FinancialDashboard';
import { Calendar, Users, Star, DollarSign, TrendingUp, Clock } from 'lucide-react';

export const ProviderOverviewTab = () => {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: "Total Bookings",
      value: 247,
      description: "All time bookings",
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Active Clients",
      value: 89,
      description: "Clients this month",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Average Rating",
      value: "4.8",
      description: "Based on 156 reviews",
      icon: <Star className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 2, isPositive: true }
    },
    {
      title: "Response Time",
      value: "2.3h",
      description: "Average response time",
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 15, isPositive: false }
    }
  ];

  const chartData = [
    { name: 'Jan', value: 12 },
    { name: 'Feb', value: 19 },
    { name: 'Mar', value: 24 },
    { name: 'Apr', value: 18 },
    { name: 'May', value: 28 },
    { name: 'Jun', value: 32 },
  ];

  return (
    <div className="space-y-8">
      <DashboardStats
        title="Provider Dashboard"
        description="Welcome back! Here's an overview of your service business."
        stats={stats}
        chartData={chartData}
        chartTitle="Monthly Bookings Trend"
        chartDescription="Your booking activity over the last 6 months"
      />
      
      <FinancialDashboard userRole="provider" />
    </div>
  );
};
