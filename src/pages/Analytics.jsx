import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye } from 'lucide-react';

const metrics = [
  { label: 'Page Views', value: '2.4M', change: '+12.5%', trend: 'up', icon: Eye },
  { label: 'Unique Visitors', value: '1.2M', change: '+8.2%', trend: 'up', icon: Users },
  { label: 'Conversion Rate', value: '3.24%', change: '-0.4%', trend: 'down', icon: ShoppingCart },
  { label: 'Revenue', value: '$124.5K', change: '+15.3%', trend: 'up', icon: DollarSign },
];

const trafficSources = [
  { source: 'Organic Search', visitors: '45,234', percentage: 42 },
  { source: 'Direct', visitors: '32,456', percentage: 30 },
  { source: 'Social Media', visitors: '15,678', percentage: 15 },
  { source: 'Referral', visitors: '8,901', percentage: 8 },
  { source: 'Email', visitors: '5,432', percentage: 5 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Analytics</h1>
        <p className="text-slate-500 mt-1">Monitor your website performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-slate-100"><metric.icon size={20} className="text-slate-600" /></div>
              <div className={`flex items-center gap-1 text-sm font-medium ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {metric.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {metric.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-800 mt-4">{metric.value}</p>
            <p className="text-sm text-slate-500">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Traffic Overview</h2>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const heights = [60, 75, 45, 90, 70, 85, 55];
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" style={{ height: `${heights[i]}%` }} />
                  <span className="text-xs text-slate-500">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Traffic Sources</h2>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{source.source}</span>
                  <span className="text-sm text-slate-500">{source.visitors}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${source.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
