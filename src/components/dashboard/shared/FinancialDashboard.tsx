
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Download, Calendar, FileText } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { financialAPI, EarningsSummary, FinancialTransaction } from "@/services/financialAPI";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from "date-fns";
import { toast } from "sonner";

interface FinancialDashboardProps {
  userRole: 'provider' | 'seller';
}

export default function FinancialDashboard({ userRole }: FinancialDashboardProps) {
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      const [summaryData, transactionsData] = await Promise.all([
        financialAPI.getEarningsSummary(),
        financialAPI.getTransactions(100)
      ]);

      setSummary(summaryData);
      setTransactions(transactionsData);
      
      // Generate chart data for the last 7 days
      generateChartData(transactionsData);
    } catch (error) {
      console.error('Error loading financial data:', error);
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (transactions: FinancialTransaction[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        date: format(date, 'MMM dd'),
        earnings: 0,
        expenses: 0,
      };
    });

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.transaction_date);
      const dayIndex = last7Days.findIndex(day => 
        format(transactionDate, 'MMM dd') === day.date
      );
      
      if (dayIndex !== -1) {
        if (transaction.type === 'earning') {
          last7Days[dayIndex].earnings += Number(transaction.amount);
        } else {
          last7Days[dayIndex].expenses += Number(transaction.amount);
        }
      }
    });

    setChartData(last7Days);
  };

  const exportTransactions = async (format: 'csv' | 'pdf') => {
    try {
      const startDate = format === 'csv' ? startOfMonth(new Date()).toISOString() : startOfWeek(new Date()).toISOString();
      const endDate = format === 'csv' ? endOfMonth(new Date()).toISOString() : endOfWeek(new Date()).toISOString();
      
      const data = await financialAPI.getTransactionsByDateRange(startDate, endDate);
      
      if (format === 'csv') {
        exportToCSV(data);
      } else {
        toast.info('PDF export feature coming soon!');
      }
    } catch (error) {
      console.error('Error exporting transactions:', error);
      toast.error('Failed to export transactions');
    }
  };

  const exportToCSV = (data: FinancialTransaction[]) => {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description', 'Status'];
    const csvContent = [
      headers.join(','),
      ...data.map(transaction => [
        format(new Date(transaction.transaction_date), 'yyyy-MM-dd'),
        transaction.type,
        transaction.category,
        transaction.amount,
        transaction.description || '',
        transaction.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Financial report exported successfully!');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'service_booking': return '🔧';
      case 'product_sale': return '🛍️';
      case 'commission': return '💰';
      case 'refund': return '↩️';
      case 'withdrawal': return '🏦';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Dashboard</h2>
          <p className="text-muted-foreground">
            Track your {userRole === 'provider' ? 'service earnings' : 'product sales'} and expenses
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportTransactions('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => exportTransactions('pdf')}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.total_earnings || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Lifetime total
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.monthly_earnings || 0}</div>
            <p className="text-xs text-muted-foreground">
              This month's earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.weekly_earnings || 0}</div>
            <p className="text-xs text-muted-foreground">
              This week's earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summary?.total_expenses || 0}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Transactions */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Earnings vs Expenses (Last 7 Days)</CardTitle>
              <CardDescription>Daily financial activity breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Legend />
                    <Bar dataKey="earnings" fill="#22c55e" name="Earnings" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No transactions found. Start earning to see your financial activity here!
                  </p>
                ) : (
                  transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getCategoryIcon(transaction.category)}</div>
                        <div>
                          <p className="font-medium capitalize">
                            {transaction.category.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.description || 'No description'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === 'earning' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'earning' ? '+' : '-'}${transaction.amount}
                        </p>
                        <Badge className={getStatusBadgeColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
