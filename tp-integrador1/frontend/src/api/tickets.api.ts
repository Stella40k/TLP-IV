import { apiFetch } from "./client";
import type { Ticket, TicketStatus, TicketCategory, TicketPriority } from "../types";

export const ticketsApi = {
  getAll: () => apiFetch<Ticket[]>("/tickets"),

  getById: (id: number) => apiFetch<Ticket>(`/tickets/${id}`),

  create: (data: {
    title: string;
    description: string;
    category: TicketCategory;
    priority?: TicketPriority;
  }) =>
    apiFetch<Ticket>("/tickets", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    id: number,
    data: {
      title?: string;
      description?: string;
      category?: TicketCategory;
      priority?: TicketPriority;
    },
  ) =>
    apiFetch<Ticket>(`/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  changeStatus: (id: number, status: TicketStatus) =>
    apiFetch<Ticket>(`/tickets/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  delete: (id: number) =>
    apiFetch<void>(`/tickets/${id}`, {
      method: "DELETE",
    }),

  checkSubscription: (ticketId: number) =>
    apiFetch<{ isSubscribed: boolean }>(`/subscriptions/tickets/${ticketId}/status`),

  subscribe: (ticketId: number) =>
    apiFetch<{ message: string }>(`/subscriptions/tickets/${ticketId}`, {
      method: "POST",
    }),

  unsubscribe: (ticketId: number) =>
    apiFetch<{ message: string }>(`/subscriptions/tickets/${ticketId}`, {
      method: "DELETE",
    }),
};
