// src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const STATUS_LABEL = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
};

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    api.get('/orders/mine')
      .then((res) => setOrders(res.data))
      .finally(() => setLoadingOrders(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (name.trim().length < 2) {
      showToast('El nombre debe tener al menos 2 caracteres', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(name.trim());
      showToast('Datos actualizados', 'success');
    } catch (err) {
      showToast(err.response?.data?.error || 'No se pudo actualizar', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <div className="container profile-layout">
        <div className="card profile-card">
          <h2>Mi perfil</h2>
          <form onSubmit={handleSave}>
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={user?.email || ''} disabled />
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>

        <div className="card profile-orders">
          <h2>Mis pedidos</h2>
          {loadingOrders ? (
            <div className="empty-state"><span className="spinner" /></div>
          ) : orders.length === 0 ? (
            <p className="empty-state">Todavía no hiciste ningún pedido.</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{new Date(o.created_at).toLocaleDateString('es-AR')}</td>
                    <td>${Number(o.total).toLocaleString('es-AR')}</td>
                    <td><span className={`badge badge-${o.status}`}>{STATUS_LABEL[o.status]}</span></td>
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
