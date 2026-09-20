// src/pages/Confirmation.jsx
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';

export default function Confirmation() {
  const [params] = useSearchParams();
  const status = params.get('status') || params.get('collection_status');
  const { refresh } = useCart();

  useEffect(() => {
    refresh(); // el carrito ya se vació en el backend al generar el pedido
  }, [refresh]);

  const isApproved = status === 'approved';

  return (
    <div className="page container">
      <div className="empty-state confirmation">
        <div className="confirmation-icon">{isApproved ? '✅' : '🕓'}</div>
        <h2>{isApproved ? '¡Gracias por tu compra!' : 'Estamos procesando tu pago'}</h2>
        <p>
          {isApproved
            ? 'Tu pedido fue confirmado. Te llegará un correo con los detalles.'
            : 'Si usaste el modo de prueba de Mercado Pago, el estado puede tardar unos segundos en actualizarse.'}
        </p>
        <div className="confirmation-actions">
          <Link to="/perfil" className="btn btn-primary">Ver mis pedidos</Link>
          <Link to="/" className="btn btn-outline">Seguir comprando</Link>
        </div>
      </div>
    </div>
  );
}
