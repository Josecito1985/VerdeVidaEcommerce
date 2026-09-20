// src/components/ProductCard.jsx
import { useState } from 'react';
import { useCart } from '../context/CartContext';

const CATEGORY_ACCENT = {
  frutas: 'accent-leaf',
  verduras: 'accent-forest',
  'alimentos-naturales': 'accent-clay',
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const outOfStock = product.stock <= 0;

  async function handleAdd() {
    setAdding(true);
    await addItem(product, 1);
    setAdding(false);
  }

  return (
    <div className={`product-card ${CATEGORY_ACCENT[product.category_slug] || 'accent-leaf'}`}>
      <div className="product-card-image">
        {product.image ? (
          <img src={`/productos/${product.image}`} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-card-placeholder">🌿</div>
        )}
        {outOfStock && <span className="product-card-outstock">Sin stock</span>}
      </div>

      <div className="product-card-body">
        <span className="product-card-category">{product.category_name}</span>
        <h3>{product.name}</h3>
        {product.description && <p className="product-card-desc">{product.description}</p>}

        <div className="product-card-footer">
          <span className="product-card-price">${Number(product.price).toLocaleString('es-AR')}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAdd}
            disabled={outOfStock || adding}
          >
            {adding ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
