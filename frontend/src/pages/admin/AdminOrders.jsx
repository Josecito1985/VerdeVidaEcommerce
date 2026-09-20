// src/pages/admin/AdminOrders.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const STATUS_LABEL = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  async function loadOrders() {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/admin');
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadOrders(); }, []);

  async function handleStatusChange(id, status) {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      showToast(`Pedido #${id} actualizado a "${STATUS_LABEL[status]}"`, 'success');
      loadOrders();
    } catch (err) {
      showToast(err.response?.data?.error || 'No se pudo actualizar el pedido', 'error');
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="card" style={{ padding: 24 }}>
          <h2>Pedidos ({orders.length})</h2>
          {loading ? (
            <div className="empty-state"><span className="spinner" /></div>
          ) : orders.length === 0 ? (
            <p className="empty-state">Todavía no hay pedidos.</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Actualizar</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.customer_name}<br /><span className="cart-row-price">{o.customer_email}</span></td>
                    <td>{new Date(o.created_at).toLocaleDateString('es-AR')}</td>
                    <td>${Number(o.total).toLocaleString('es-AR')}</td>
                    <td><span className={`badge badge-${o.status}`}>{STATUS_LABEL[o.status]}</span></td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      >
                        {Object.entries(STATUS_LABEL).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
