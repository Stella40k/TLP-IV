import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ticketsApi } from "../api/tickets.api";
import type { TicketCategory, TicketPriority } from "../types";

export const TicketFormPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TicketCategory>("SOFTWARE");
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const created = await ticketsApi.create({
        title,
        description,
        category,
        priority,
      });
      navigate(`/tickets/${created.id}`);
    } catch (err: any) {
      setError(err.message || "Error al crear ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container form-container">
      <div className="card">
        <h2>Crear Nuevo Ticket</h2>
        <p className="subtitle">Reportar un nuevo incidente o solicitud</p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título del incidente</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Falla al ingresar al sistema contable"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
              >
                <option value="HARDWARE">HARDWARE</option>
                <option value="SOFTWARE">SOFTWARE</option>
                <option value="NETWORK">NETWORK</option>
                <option value="ACCESS">ACCESS</option>
              </select>
            </div>

            <div className="form-group">
              <label>Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
              >
                <option value="LOW">LOW (Baja)</option>
                <option value="MEDIUM">MEDIUM (Media)</option>
                <option value="HIGH">HIGH (Alta)</option>
                <option value="CRITICAL">CRITICAL (Crítica)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Descripción detallada</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe lo ocurrido, pasos para reproducir o detalles del equipo..."
            />
          </div>

          <div className="btn-actions">
            <button
              type="button"
              onClick={() => navigate("/tickets")}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Creando..." : "Guardar Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
