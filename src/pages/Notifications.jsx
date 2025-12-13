import { Bell, Check, Trash2, CheckCheck, ShoppingCart, Users, AlertTriangle, Info } from 'lucide-react';
import { useState } from 'react';

const notificationsData = [
  { id: 1, type: 'order', title: 'New Order Received', message: 'Order #ORD-2024001 placed by John Doe', time: '5 min ago', read: false },
  { id: 2, type: 'user', title: 'New User Registration', message: 'Sarah Wilson created an account', time: '15 min ago', read: false },
  { id: 3, type: 'alert', title: 'Low Stock Alert', message: 'Magic Keyboard running low (5 remaining)', time: '1 hour ago', read: false },
  { id: 4, type: 'info', title: 'System Update', message: 'Maintenance tonight at 2 AM', time: '2 hours ago', read: true },
  { id: 5, type: 'order', title: 'Order Completed', message: 'Order #ORD-2024000 delivered', time: '3 hours ago', read: true },
];

const typeIcons = { order: ShoppingCart, user: Users, alert: AlertTriangle, info: Info };
const typeColors = { order: 'bg-blue-100 text-blue-600', user: 'bg-green-100 text-green-600', alert: 'bg-red-100 text-red-600', info: 'bg-purple-100 text-purple-600' };

export default function Notifications() {
  const [notifications, setNotifications] = useState(notificationsData);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const deleteNotification = (id) => setNotifications(notifications.filter(n => n.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500 mt-1">You have <span className="font-medium text-blue-600">{unreadCount}</span> unread notifications.</p>
        </div>
        <button onClick={markAllAsRead} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-colors">
          <CheckCheck size={18} />Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.type];
              return (
                <div key={notification.id} className={`p-4 sm:p-6 flex gap-4 hover:bg-slate-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}>
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${typeColors[notification.type]}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`text-sm font-semibold ${!notification.read ? 'text-slate-800' : 'text-slate-600'}`}>{notification.title}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{notification.message}</p>
                        <p className="text-xs text-slate-400 mt-2">{notification.time}</p>
                      </div>
                      {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!notification.read && (
                      <button onClick={() => markAsRead(notification.id)} className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Mark as read">
                        <Check size={16} />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(notification.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
