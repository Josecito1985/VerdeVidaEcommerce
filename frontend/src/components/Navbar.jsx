// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <span className="navbar-leaf">🌿</span> Verde Vida
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-links ${open ? 'is-open' : ''}`}>
          <Link to="/" onClick={() => setOpen(false)}>Catálogo</Link>

          {user && (
            <Link to="/carrito" onClick={() => setOpen(false)} className="navbar-cart">
              Carrito
              {itemCount > 0 && <span className="navbar-cart-badge">{itemCount}</span>}
            </Link>
          )}

          {user?.role === 'admin' && (
            <>
              <Link to="/admin/productos" onClick={() => setOpen(false)}>Productos (admin)</Link>
              <Link to="/admin/pedidos" onClick={() => setOpen(false)}>Pedidos (admin)</Link>
            </>
          )}

          {user ? (
            <>
              <Link to="/perfil" onClick={() => setOpen(false)}>Hola, {user.name.split(' ')[0]}</Link>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Ingresar</Link>
              <Link to="/registro" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
                Crear cuenta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
