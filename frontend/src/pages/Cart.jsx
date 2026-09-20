// src/pages/Cart.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, total, loading, updateQuantity, removeItem } = useCart();

  if (loading) {
    return <div className="page container"><div className="empty-state"><span className="spinner" /></div></div>;
  }

  if (items.length === 0) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h2>Tu carrito está vacío</h2>
          <p>Todavía no agregaste productos.</p>
          <Link to="/" className="btn btn-primary">Ver catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container cart-layout">
        <div className="cart-items card">
          <h2>Tu carrito</h2>

          {items.map((item) => (
            <div className="cart-row" key={item.product_id}>
              <img
                src={item.image ? `/productos/${item.image}` : undefined}
                alt={item.name}
                className="cart-row-img"
              />

              <div className="cart-row-info">
                <strong>{item.name}</strong>
                <span className="cart-row-price">
                  ${Number(item.price).toLocaleString('es-AR')} c/u
                </span>
              </div>

              <div className="qty-stepper">
                <button
                  className="btn-sm btn-outline"
                  onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                  aria-label={`Quitar una unidad de ${item.name}`}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  className="btn-sm btn-outline"
                  onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  aria-label={`Agregar una unidad de ${item.name}`}
                >
                  +
                </button>
              </div>

              <span className="cart-row-subtotal">
                ${(item.price * item.quantity).toLocaleString('es-AR')}
              </span>

              <button
                className="btn-danger btn-sm"
                onClick={() => removeItem(item.product_id)}
                aria-label={`Quitar ${item.name} del carrito`}
              >
                Quitar
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary card">
          <h3>Resumen</h3>
          <div className="cart-summary-row">
            <span>Total</span>
            <strong>${total.toLocaleString('es-AR')}</strong>
          </div>
          <Link to="/checkout" className="btn btn-primary btn-block">Ir a pagar</Link>
          <Link to="/" className="btn btn-outline btn-block">Seguir comprando</Link>
        </aside>
      </div>
    </div>
  );
}
