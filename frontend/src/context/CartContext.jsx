// src/context/CartContext.jsx
// El carrito vive en el backend (tabla cart_items), asociado al usuario logueado.
// Esto reemplaza el localStorage por-usuario del proyecto original: ahora el
// carrito persiste de verdad entre dispositivos y sesiones.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setItems(data.items);
      setTotal(data.total);
    } catch {
      // silencioso: si falla, el usuario puede reintentar abriendo el carrito
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addItem(product, quantity = 1) {
    if (!user) {
      showToast('Iniciá sesión para agregar productos al carrito', 'info');
      return false;
    }
    try {
      const { data } = await api.post('/cart/items', { productId: product.id, quantity });
      setItems(data.items);
      setTotal(data.total);
      showToast(`${product.name} agregado al carrito`, 'success');
      return true;
    } catch (err) {
      showToast(err.response?.data?.error || 'No se pudo agregar el producto', 'error');
      return false;
    }
  }

  async function updateQuantity(productId, quantity) {
    try {
      const { data } = await api.put(`/cart/items/${productId}`, { quantity });
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      showToast(err.response?.data?.error || 'No se pudo actualizar la cantidad', 'error');
    }
  }

  async function removeItem(productId) {
    try {
      const { data } = await api.delete(`/cart/items/${productId}`);
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      showToast(err.response?.data?.error || 'No se pudo quitar el producto', 'error');
    }
  }

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, total, itemCount, loading, addItem, updateQuantity, removeItem, refresh }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
