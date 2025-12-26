import { Users, ShoppingCart, DollarSign, TrendingUp, MoreHorizontal } from 'lucide-react';
import StatCard from '../components/StatCard';

const stats = [
  { title: 'Total Users', value: '24,512', change: 12.5, changeType: 'increase', icon: Users, color: 'green' },
  { title: 'Total Orders', value: '8,234', change: 8.2, changeType: 'increase', icon: ShoppingCart, color: 'emerald' },
  { title: 'Revenue', value: '$124,500', change: 3.1, changeType: 'decrease', icon: DollarSign, color: 'teal' },
  { title: 'Growth', value: '23.5%', change: 5.4, changeType: 'increase', icon: TrendingUp, color: 'gray' },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'John Doe', product: 'Startpass', amount: '€0', status: 'Completed', date: '2024-01-15' },
  { id: '#ORD-002', customer: 'Jane Smith', product: 'Real Explorer', amount: '€79', status: 'Processing', date: '2024-01-15' },
  { id: '#ORD-003', customer: 'Mike Johnson', product: 'Borderless Travel', amount: '€69', status: 'Pending', date: '2024-01-14' },
  { id: '#ORD-004', customer: 'Sarah Wilson', product: 'Real Explorer', amount: '€79', status: 'Completed', date: '2024-01-14' },
  { id: '#ORD-005', customer: 'Tom Brown', product: 'Borderless Travel', amount: '€69', status: 'Completed', date: '2024-01-13' },
];

const topProducts = [
  { name: 'Startpass', sales: 1234, revenue: '$2.4M', growth: '+12%', price: '€0' },
  { name: 'Real Explorer', sales: 2341, revenue: '$3.2M', growth: '+18%', price: '€79' },
  { name: 'Borderless Travel', sales: 892, revenue: '$890K', growth: '+5%', price: '€69' },
];

const statusColors = {
  Completed: 'bg-green-100 text-green-700',
  Processing: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Shipped: 'bg-teal-100 text-teal-700',
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal size={20} className="text-gray-400" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Product</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-green-600">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{order.product}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100">
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">View all orders →</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Top Products</h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal size={20} className="text-gray-400" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-sm font-bold text-green-700">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sales.toLocaleString()} sales</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">{product.revenue}</p>
                  <p className="text-xs text-green-500 font-medium">{product.growth}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100">
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">View all products →</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Revenue Overview</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg">Monthly</button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Weekly</button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Daily</button>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
          <div className="text-center">
            <div className="flex justify-center gap-1 mb-2">
              {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((height, i) => (
                <div key={i} className="w-6 bg-gradient-to-t from-green-600 to-green-400 rounded-t" style={{ height: `${height}%` }} />
              ))}
            </div>
            <p className="text-sm text-gray-500">Revenue chart visualization</p>
          </div>
        </div>
      </div>
    </div>
  );
}
