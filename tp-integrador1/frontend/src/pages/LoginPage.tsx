import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { authApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authApi.login(email, password);
      login(data.token, data.user);
      navigate("/tickets");
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2>Iniciar Sesión</h2>
        <p className="subtitle">Mesa de ayuda — TLP IV</p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@tp.com"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <p className="footer-text">
          ¿No tenés cuenta? <Link to="/register">Registrate acá</Link>
        </p>

        <div className="demo-credentials">
          <small>
            <strong>Usuarios de prueba (seed):</strong><br />
            admin@tp.com | operador@tp.com | usuario@tp.com<br />
            Clave: <code>tlp4-2026</code>
          </small>
        </div>
      </div>
    </div>
  );
};
