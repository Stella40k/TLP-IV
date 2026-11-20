import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { notificationsApi } from "../api/notifications.api";

export const NotificationBell: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchCount = async () => {
    try {
      const data = await notificationsApi.getMyNotifications();
      setUnreadCount(data.unreadCount);
    } catch (_error) {
      // silencioso en polling
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 6000); // Polling cada 6 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <Link to="/notifications" className="bell-btn" title="Bandeja de notificaciones">
      🔔 Notificaciones
      {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
    </Link>
  );
};
