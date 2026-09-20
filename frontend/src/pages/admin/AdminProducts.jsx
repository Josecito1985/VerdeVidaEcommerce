// src/pages/admin/AdminProducts.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const EMPTY_FORM = { id: null, name: '', description: '', price: '', stock: '', image: '', categoryId: '', active: true };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  async function loadProducts() {
    setLoading(true);
    try {
      const { data } = await api.get('/products/admin');
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  function startEdit(p) {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description || '',
      price: p.price,
      stock: p.stock,
      image: p.image || '',
      categoryId: p.category_id,
      active: !!p.active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.categoryId) {
      showToast('Completá nombre, precio y categoría', 'error');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      image: form.image.trim(),
      categoryId: Number(form.categoryId),
      active: form.active,
    };
    try {
      if (form.id) {
        await api.put(`/products/${form.id}`, payload);
        showToast('Producto actualizado', 'success');
      } else {
        await api.post('/products', payload);
        showToast('Producto creado', 'success');
      }
      resetForm();
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.error || 'No se pudo guardar el producto', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Dar de baja este producto?')) return;
    try {
      await api.delete(`/products/${id}`);
      showToast('Producto dado de baja', 'success');
      loadProducts();
    } catch (err) {
      showToast(err.response?.data?.error || 'No se pudo dar de baja', 'error');
    }
  }

  return (
    <div className="page">
      <div className="container admin-layout">
        <form className="card admin-form" onSubmit={handleSubmit}>
          <h2>{form.id ? `Editar producto #${form.id}` : 'Nuevo producto'}</h2>

          <div className="field">
            <label>Nombre</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="field">
            <label>Descripción</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Precio</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label>Categoría</label>
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Seleccioná una categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Imagen (nombre de archivo en /public/productos)</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="banana.png" />
          </div>

          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Producto activo (visible en el catálogo)
          </label>

          <div className="admin-form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : form.id ? 'Guardar cambios' : 'Crear producto'}
            </button>
            {form.id && (
              <button type="button" className="btn btn-outline" onClick={resetForm}>Cancelar</button>
            )}
          </div>
        </form>

        <div className="card admin-list">
          <h2>Productos ({products.length})</h2>
          {loading ? (
            <div className="empty-state"><span className="spinner" /></div>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category_name}</td>
                    <td>${Number(p.price).toLocaleString('es-AR')}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span className={`badge ${p.active ? 'badge-approved' : 'badge-cancelled'}`}>
                        {p.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => startEdit(p)}>Editar</button>{' '}
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Baja</button>
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
