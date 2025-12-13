import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function AdminLayout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      {/* Fixed Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onLogout={onLogout} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col h-screen">
        {/* Fixed Header */}
        <Header setIsOpen={setSidebarOpen} />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
