import React, { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import type { Notification } from '../types';
import { Bell, Check, CheckCheck } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifications = async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: Notification[]; unreadCount: number }>('/notifications');
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: 'PUT' });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAll = async () => {
    try {
      await apiRequest('/notifications/read-all', { method: 'PUT' });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between border-b border-[var(--border-fine)] pb-6 mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent-sage)]">
            ACCOUNT ALERTS
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-1 flex items-center gap-2">
            <Bell className="w-6 h-6 text-[var(--accent-sage)]" /> Notifications
          </h1>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="text-xs text-[var(--accent-sage)] hover:underline flex items-center gap-1 font-medium"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-7 w-7 border-b-2 border-[var(--accent-sage)]"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-12 text-center border border-[var(--border-fine)] bg-[var(--card-bg)] rounded-sm">
          <p className="text-xs text-[var(--text-secondary)]">You have no in-app notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-sm border transition flex items-start justify-between gap-4 ${
                n.isRead
                  ? 'bg-[var(--card-bg)] border-[var(--border-fine)] opacity-85'
                  : 'bg-[var(--surface-sage)]/40 border-[var(--accent-sage)]/50'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{n.title}</h4>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-[var(--text-secondary)] font-mono block">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkAsRead(n._id)}
                  title="Mark as read"
                  className="p-1.5 rounded-sm border border-[var(--border-fine)] hover:bg-[var(--surface-sage)] text-[var(--text-secondary)]"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
