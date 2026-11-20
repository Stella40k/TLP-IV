import { apiFetch } from "./client";
import type { NotificationItem, User, UserRole } from "../types";

export const notificationsApi = {
  getMyNotifications: () =>
    apiFetch<{ notifications: NotificationItem[]; unreadCount: number }>(
      "/notifications",
    ),

  markAsRead: (id: number) =>
    apiFetch<{ message: string }>(`/notifications/${id}/read`, {
      method: "PATCH",
    }),

  markAllAsRead: () =>
    apiFetch<{ message: string }>("/notifications/read-all", {
      method: "PATCH",
    }),
};

export const usersApi = {
  getAll: () => apiFetch<User[]>("/users"),
  assignRole: (id: number, role: UserRole) =>
    apiFetch<{ message: string; user: User }>(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }),
};
