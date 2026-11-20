import React, { useEffect, useState } from "react";
import { notificationsApi } from "../api/notifications.api";
import type { NotificationItem } from "../types";
import { Link } from "react-router";

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.getMyNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAll = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Bandeja de Notificaciones</h2>
          <p className="text-muted">
            {unreadCount > 0
              ? `Tenés ${unreadCount} notificación(es) sin leer`
              : "Estás al día con tus notificaciones"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAll} className="btn-secondary">
            ✓ Marcar todas como leídas
          </button>
        )}
      </div>

      {loading ? (
        <p>Cargando notificaciones...</p>
      ) : notifications.length === 0 ? (
        <div className="card empty-state">No tenés notificaciones aún.</div>
      ) : (
        <div className="notifications-list">
          {notifications.map((n) => (
            <div key={n.id} className={`card notification-card ${n.read ? "read" : "unread"}`}>
              <div className="notification-content">
                <span className="notif-dot">{!n.read && "● "}</span>
                <p>{n.message}</p>
                <small className="text-muted">
                  {new Date(n.createdAt).toLocaleString()} ·{" "}
                  <Link to={`/tickets/${n.ticketId}`}>Ver ticket #{n.ticketId}</Link>
                </small>
              </div>

              {!n.read && (
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  className="btn-mark-read"
                  title="Marcar como leída"
                >
                  ✓ Leída
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
