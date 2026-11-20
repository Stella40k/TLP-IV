export type UserRole = "admin" | "operador" | "usuario";
export type TicketStatus = "ABIERTO" | "EN_PROGRESO" | "RESUELTO" | "CERRADO";
export type TicketCategory = "HARDWARE" | "SOFTWARE" | "NETWORK" | "ACCESS";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type Permission =
  | "ticket:read"
  | "ticket:create"
  | "ticket:update"
  | "ticket:change-status"
  | "ticket:delete"
  | "subscription:create"
  | "subscription:delete"
  | "notification:read"
  | "user:read"
  | "user:assign-role";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  creatorId: number;
  assignedToId?: number | null;
  creator?: User;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: number;
  userId: number;
  ticketId: number;
  message: string;
  read: boolean;
  createdAt: string;
  ticket?: {
    id: number;
    title: string;
    status: TicketStatus;
  };
}
