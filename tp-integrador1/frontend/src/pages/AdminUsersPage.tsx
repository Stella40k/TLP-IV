import React, { useEffect, useState } from "react";
import { usersApi } from "../api/notifications.api";
import type { User, UserRole } from "../types";

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    setError(null);
    setMsg(null);
    try {
      await usersApi.assignRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
      setMsg(`Rol actualizado correctamente a '${newRole}'`);
    } catch (err: any) {
      setError(err.message || "Error al actualizar rol");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Administración de Usuarios</h2>
          <p className="text-muted">Asignación de roles y permisos del sistema (RF6)</p>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {msg && <div className="alert-success">{msg}</div>}

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="table-wrapper card">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol Actual</th>
                <th>Asignar Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`chip chip-role-${u.role}`}>{u.role}</span>
                  </td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u.id, e.target.value as UserRole)
                      }
                      className="select-role"
                    >
                      <option value="usuario">usuario</option>
                      <option value="operador">operador</option>
                      <option value="admin">admin</option>
                    </select>
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
