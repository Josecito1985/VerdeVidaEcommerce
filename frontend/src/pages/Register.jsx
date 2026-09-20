// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function validate() {
    const e = {};
    if (name.trim().length < 2) e.name = 'Ingresá tu nombre completo';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'El email no es válido';
    if (password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      showToast('Cuenta creada, ¡bienvenido a Verde Vida!', 'success');
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.error || 'No se pudo crear la cuenta', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="container auth-container">
        <div className="auth-card card">
          <h2>Crear cuenta</h2>
          <p className="auth-subtitle">Sumate a la comunidad Verde Vida.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Nombre completo</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
              {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="auth-switch">
            ¿Ya tenés cuenta? <Link to="/login">Ingresá acá</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
