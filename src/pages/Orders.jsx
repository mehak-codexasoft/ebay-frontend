import { Search, Download, Eye, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

const ordersData = [
  { id: '#ORD-2024001', customer: 'John Doe', email: 'john@example.com', products: 3, total: '$2,499.00', status: 'Completed', date: '2024-01-15' },
  { id: '#ORD-2024002', customer: 'Jane Smith', email: 'jane@example.com', products: 1, total: '$1,199.00', status: 'Processing', date: '2024-01-15' },
  { id: '#ORD-2024003', customer: 'Mike Johnson', email: 'mike@example.com', products: 2, total: '$549.00', status: 'Pending', date: '2024-01-14' },
  { id: '#ORD-2024004', customer: 'Sarah Wilson', email: 'sarah@example.com', products: 5, total: '$3,299.00', status: 'Completed', date: '2024-01-14' },
  { id: '#ORD-2024005', customer: 'Tom Brown', email: 'tom@example.com', products: 1, total: '$399.00', status: 'Shipped', date: '2024-01-13' },
];

const statusColors = {
  Completed: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Shipped: 'bg-purple-100 text-purple-700',
};

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredOrders = ordersData.filter((order) =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Orders</h1>
          <p className="text-slate-500 mt-1">Track and manage customer orders.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors font-medium">
          <Download size={20} />
          <span>Export</span>
        </button>
      </div>

      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm max-w-md">
        <Search size={18} className="text-slate-400" />
        <input type="text" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400 w-full" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-700">{order.customer}</p>
                    <p className="text-xs text-slate-500">{order.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-blue-600"><Eye size={16} /></button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
