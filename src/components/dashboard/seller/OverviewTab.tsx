
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Package, ShoppingCart, DollarSign, Users } from "lucide-react";

// Sample data for charts
const revenueData = [
  { name: 'Jan', revenue: 1200, orders: 14 },
  { name: 'Feb', revenue: 1900, orders: 21 },
  { name: 'Mar', revenue: 2400, orders: 28 },
  { name: 'Apr', revenue: 1800, orders: 22 },
  { name: 'May', revenue: 2800, orders: 32 },
  { name: 'Jun', revenue: 3200, orders: 38 },
  { name: 'Jul', revenue: 3800, orders: 42 },
];

const orderStatusData = [
  { name: 'New', value: 14 },
  { name: 'Processing', value: 8 },
  { name: 'Shipped', value: 12 },
  { name: 'Delivered', value: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const productPerformance = [
  { name: 'Product A', sales: 42, revenue: 3600 },
  { name: 'Product B', sales: 28, revenue: 1900 },
  { name: 'Product C', sales: 15, revenue: 1200 },
  { name: 'Product D', sales: 9, revenue: 850 },
  { name: 'Product E', sales: 6, revenue: 720 },
];

export default function OverviewTab() {
  // Key metrics
  const totalRevenue = 12800;
  const totalOrders = 156;
  const averageOrderValue = Math.round(totalRevenue / totalOrders);
  const totalCustomers = 105;
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Seller Dashboard Overview</h2>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" /> +12.5%
              </span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" /> +8.2%
              </span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Order Value
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 flex items-center">
                <ArrowDownRight className="h-4 w-4 mr-1" /> -2.3%
              </span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" /> +5.7%
              </span> from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Revenue chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Orders</CardTitle>
          <CardDescription>
            Monthly revenue and order count over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  name="Revenue ($)"
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  name="Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>
              Current status of all orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Top products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Best performing products by sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productPerformance}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" name="Units Sold" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Latest orders from your customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium p-2">Order ID</th>
                  <th className="text-left font-medium p-2">Customer</th>
                  <th className="text-left font-medium p-2">Products</th>
                  <th className="text-left font-medium p-2">Total</th>
                  <th className="text-left font-medium p-2">Status</th>
                  <th className="text-left font-medium p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">#3845</td>
                  <td className="p-2">John Smith</td>
                  <td className="p-2">Product A, Product C</td>
                  <td className="p-2">$196</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Processing</span>
                  </td>
                  <td className="p-2">Jul 12, 2023</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">#3844</td>
                  <td className="p-2">Sarah Johnson</td>
                  <td className="p-2">Product B</td>
                  <td className="p-2">$85</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
                  </td>
                  <td className="p-2">Jul 11, 2023</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">#3843</td>
                  <td className="p-2">Michael Brown</td>
                  <td className="p-2">Product D</td>
                  <td className="p-2">$120</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Shipped</span>
                  </td>
                  <td className="p-2">Jul 10, 2023</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">#3842</td>
                  <td className="p-2">Emily Davis</td>
                  <td className="p-2">Product A, Product E</td>
                  <td className="p-2">$210</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
                  </td>
                  <td className="p-2">Jul 9, 2023</td>
                </tr>
                <tr>
                  <td className="p-2">#3841</td>
                  <td className="p-2">Robert Wilson</td>
                  <td className="p-2">Product B, Product C</td>
                  <td className="p-2">$155</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">New</span>
                  </td>
                  <td className="p-2">Jul 9, 2023</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
