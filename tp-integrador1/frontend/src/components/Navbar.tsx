import React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Can } from "./Can";
import { NotificationBell } from "./NotificationBell";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/tickets"><strong>Mesa de Ayuda</strong></Link>
      </div>

      <div className="nav-links">
        <Link to="/tickets">Tickets</Link>

        <Can permission="ticket:create">
          <Link to="/tickets/new">+ Nuevo Ticket</Link>
        </Can>

        <Can permission="user:read">
          <Link to="/admin/users">Usuarios</Link>
        </Can>

        <NotificationBell />

        <div className="user-pill">
          <span>{user.name} <em>({user.role})</em></span>
          <button onClick={handleLogout} className="btn-logout">Salir</button>
        </div>
      </div>
    </nav>
  );
};
