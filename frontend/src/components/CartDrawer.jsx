import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartDrawer({ open, onClose }) {
  const { user } = useAuth();
  const { items, total, updateQuantity, removeItem } = useCart();

  if (!open) return null;

  return (
    <>
      <div className="cart-drawer-backdrop" onClick={onClose} />
      <aside className="cart-drawer">
        <button className="close-btn" onClick={onClose} aria-label="Cerrar carrito">✕</button>
        <h3>Mi carrito</h3>

        {!user ? (
          <p>Iniciá sesión para ver tu carrito.</p>
        ) : items.length === 0 ? (
          <p>Todavía no agregaste productos.</p>
        ) : (
          <>
            <div className="cart-drawer-items">
              {items.map((item) => (
                <div className="cart-item" key={item.product_id}>
                  <img src={`/frutas/${item.image}`} alt={item.name} />
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <div className="cart-item-price">${Number(item.price).toLocaleString('es-AR')}</div>
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
                      <button className="remove-btn" onClick={() => removeItem(item.product_id)}>Quitar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <span>Total</span>
              <strong>${Number(total).toLocaleString('es-AR')}</strong>
            </div>

            <Link to="/carrito" onClick={onClose}>
              <button className="btn btn-outline btn-block" style={{ marginTop: 12 }}>Ver carrito completo</button>
            </Link>
          </>
        )}
      </aside>
    </>
  );
}
