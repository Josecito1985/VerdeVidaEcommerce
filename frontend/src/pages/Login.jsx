// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  function validate() {
    const e = {};
    if (!email.trim()) e.email = 'Ingresá tu email';
    if (!password) e.password = 'Ingresá tu contraseña';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      showToast('¡Bienvenido de nuevo!', 'success');
      navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      showToast(err.response?.data?.error || 'No se pudo iniciar sesión', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="container auth-container">
        <div className="auth-card card">
          <h2>Ingresar</h2>
          <p className="auth-subtitle">Accedé a tu cuenta de Verde Vida.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
              {submitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="auth-switch">
            ¿No tenés cuenta? <Link to="/registro">Creá una acá</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
