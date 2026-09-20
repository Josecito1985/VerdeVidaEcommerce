// src/pages/Checkout.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function Checkout() {
  const { items, total } = useCart();
  const { showToast } = useToast();
  const [processing, setProcessing] = useState(false);

  async function handlePay() {
    setProcessing(true);
    try {
      const { data } = await api.post('/payments/create-preference');
      window.location.href = data.initPoint;
    } catch (err) {
      showToast(err.response?.data?.error || 'No se pudo iniciar el pago', 'error');
      setProcessing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="page container">
        <div className="empty-state">
          <h2>No hay nada para pagar</h2>
          <p>Agregá productos a tu carrito antes de continuar.</p>
          <Link to="/" className="btn btn-primary">Ver catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container cart-layout">
        <div className="cart-items card">
          <h2>Confirmá tu pedido</h2>
          {items.map((item) => (
            <div className="cart-row" key={item.product_id} style={{ gridTemplateColumns: '56px 1fr auto' }}>
              <img
                src={item.image ? `/productos/${item.image}` : undefined}
                alt={item.name}
                className="cart-row-img"
              />
              <div className="cart-row-info">
                <strong>{item.name}</strong>
                <span className="cart-row-price">Cantidad: {item.quantity}</span>
              </div>
              <span className="cart-row-subtotal">
                ${(item.price * item.quantity).toLocaleString('es-AR')}
              </span>
            </div>
          ))}
        </div>

        <aside className="cart-summary card">
          <h3>Total a pagar</h3>
          <div className="cart-summary-row">
            <span>Total</span>
            <strong>${total.toLocaleString('es-AR')}</strong>
          </div>
          <button className="btn btn-primary btn-block" onClick={handlePay} disabled={processing}>
            {processing ? 'Redirigiendo a Mercado Pago...' : 'Pagar con Mercado Pago'}
          </button>
          <p className="checkout-note">Vas a completar el pago en el entorno seguro de Mercado Pago.</p>
        </aside>
      </div>
    </div>
  );
}
