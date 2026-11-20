import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { ticketsApi } from "../api/tickets.api";
import type { Ticket } from "../types";
import { Can } from "../components/Can";

export const TicketListPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      const data = await ticketsApi.getAll();
      setTickets(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Tickets de Mesa de Ayuda</h2>
          <p className="text-muted">Gestión de incidentes y requerimientos</p>
        </div>
        <Can permission="ticket:create">
          <Link to="/tickets/new" className="btn-primary">
            + Nuevo Ticket
          </Link>
        </Can>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <p>Cargando tickets...</p>
      ) : tickets.length === 0 ? (
        <div className="card empty-state">No hay tickets registrados todavía.</div>
      ) : (
        <div className="table-wrapper card">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Categoría</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Creador</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td><strong>{t.title}</strong></td>
                  <td><span className="chip chip-gray">{t.category}</span></td>
                  <td>
                    <span className={`chip chip-priority-${t.priority.toLowerCase()}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`chip chip-status-${t.status.toLowerCase()}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{t.creator?.name || `Usuario #${t.creatorId}`}</td>
                  <td>
                    <Link to={`/tickets/${t.id}`} className="btn-link">
                      Ver detalle →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
