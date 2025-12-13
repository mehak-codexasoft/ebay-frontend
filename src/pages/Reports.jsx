import { Download, FileText, DollarSign, Users, TrendingUp } from 'lucide-react';

const reports = [
  { title: 'Sales Report', description: 'Monthly sales performance', icon: DollarSign, date: 'Jan 15, 2024', size: '2.4 MB' },
  { title: 'User Analytics', description: 'User engagement metrics', icon: Users, date: 'Jan 14, 2024', size: '1.8 MB' },
  { title: 'Traffic Report', description: 'Website traffic analysis', icon: TrendingUp, date: 'Jan 13, 2024', size: '3.2 MB' },
  { title: 'Inventory Report', description: 'Stock levels overview', icon: FileText, date: 'Jan 12, 2024', size: '1.5 MB' },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Reports</h1>
          <p className="text-slate-500 mt-1">Generate and download reports.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/30">
          <FileText size={20} />
          <span>Generate Report</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Total Reports</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">156</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">This Month</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">24</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Scheduled</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">8</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">Downloads</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">1,234</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Recent Reports</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {reports.map((report) => (
            <div key={report.title} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <report.icon size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{report.title}</h3>
                  <p className="text-sm text-slate-500">{report.description}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-slate-400">{report.date}</span>
                    <span className="text-xs text-slate-400">{report.size}</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-colors">
                <Download size={16} />Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
