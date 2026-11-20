import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ticketsApi } from "../api/tickets.api";
import type { Ticket, TicketStatus } from "../types";
import { Can } from "../components/Can";

export const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const ticketId = Number(id);

  const loadData = async () => {
    try {
      const [tData, sData] = await Promise.all([
        ticketsApi.getById(ticketId),
        ticketsApi.checkSubscription(ticketId),
      ]);
      setTicket(tData);
      setIsSubscribed(sData.isSubscribed);
    } catch (err: any) {
      setError(err.message || "Error al cargar datos del ticket");
    }
  };

  useEffect(() => {
    loadData();
  }, [ticketId]);

  const handleToggleSubscription = async () => {
    setSubLoading(true);
    setMsg(null);
    try {
      if (isSubscribed) {
        await ticketsApi.unsubscribe(ticketId);
        setIsSubscribed(false);
        setMsg("Te desuscribiste del ticket correctamente");
      } else {
        await ticketsApi.subscribe(ticketId);
        setIsSubscribed(true);
        setMsg("¡Te suscribiste! Recibirás notificaciones ante cualquier cambio de estado");
      }
    } catch (err: any) {
      setError(err.message || "Error al cambiar suscripción");
    } finally {
      setSubLoading(false);
    }
  };

  const handleChangeStatus = async (newStatus: TicketStatus) => {
    setStatusLoading(true);
    setMsg(null);
    try {
      const updated = await ticketsApi.changeStatus(ticketId, newStatus);
      setTicket(updated);
      setMsg(`Estado cambiado a ${newStatus}. Se enviaron las notificaciones correspondientes.`);
    } catch (err: any) {
      setError(err.message || "Error al cambiar estado");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar este ticket?")) return;
    try {
      await ticketsApi.delete(ticketId);
      navigate("/tickets");
    } catch (err: any) {
      setError(err.message || "Error al eliminar ticket");
    }
  };

  if (!ticket && !error) return <p className="page-container">Cargando detalle...</p>;
  if (!ticket) return <div className="page-container alert-error">{error}</div>;

  return (
    <div className="page-container">
      <button onClick={() => navigate("/tickets")} className="btn-secondary" style={{ marginBottom: "1rem" }}>
        ← Volver al listado
      </button>

      {error && <div className="alert-error">{error}</div>}
      {msg && <div className="alert-success">{msg}</div>}

      <div className="card ticket-detail-card">
        <div className="ticket-detail-header">
          <div>
            <span className="ticket-id-tag">Ticket #{ticket.id}</span>
            <h2>{ticket.title}</h2>
          </div>

          {/* Botón de suscripción (RF4) */}
          <button
            onClick={handleToggleSubscription}
            disabled={subLoading}
            className={isSubscribed ? "btn-subscribed" : "btn-subscribe"}
          >
            {isSubscribed ? "✓ Suscripto (Click para cancelar)" : "🔔 Suscribirme a este Ticket"}
          </button>
        </div>

        <div className="ticket-meta-grid">
          <div>
            <small>Categoría</small>
            <p><strong>{ticket.category}</strong></p>
          </div>
          <div>
            <small>Prioridad</small>
            <p><strong>{ticket.priority}</strong></p>
          </div>
          <div>
            <small>Estado Actual</small>
            <p><span className={`chip chip-status-${ticket.status.toLowerCase()}`}>{ticket.status}</span></p>
          </div>
          <div>
            <small>Creado Por</small>
            <p>{ticket.creator?.name || `Usuario #${ticket.creatorId}`}</p>
          </div>
        </div>

        <hr />

        <div className="ticket-body">
          <h4>Descripción</h4>
          <p className="description-text">{ticket.description}</p>
        </div>

        {/* Acciones de Estado (RF3/RF5 - Observer) */}
        <Can permission="ticket:change-status">
          <div className="status-actions card">
            <h4>Cambiar Estado (Dispara Notificaciones)</h4>
            <div className="btn-group">
              {(["ABIERTO", "EN_PROGRESO", "RESUELTO", "CERRADO"] as TicketStatus[]).map((st) => (
                <button
                  key={st}
                  disabled={ticket.status === st || statusLoading}
                  onClick={() => handleChangeStatus(st)}
                  className={`btn-status-option ${ticket.status === st ? "active" : ""}`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </Can>

        <Can permission="ticket:delete">
          <div style={{ marginTop: "2rem", textAlign: "right" }}>
            <button onClick={handleDelete} className="btn-danger">
              Eliminar Ticket
            </button>
          </div>
        </Can>
      </div>
    </div>
  );
};
