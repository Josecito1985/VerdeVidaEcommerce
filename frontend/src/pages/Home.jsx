// src/pages/Home.jsx
import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (search) params.search = search;

    const timeout = setTimeout(() => {
      api.get('/products', { params })
        .then((res) => setProducts(res.data))
        .finally(() => setLoading(false));
    }, 250); // debounce simple para la búsqueda

    return () => clearTimeout(timeout);
  }, [activeCategory, search]);

  const emptyMessage = useMemo(() => {
    if (search) return `No encontramos productos para "${search}".`;
    return 'Todavía no hay productos cargados en esta categoría.';
  }, [search]);

  return (
    <div className="page">
      <div className="container">
        <section className="hero">
          <div>
            <h1>Frescura, sostenibilidad y confianza, directo a tu puerta.</h1>
            <p className="hero-subtitle">
              Frutas, verduras y alimentos naturales seleccionados, con entrega
              rápida y pago 100% seguro con Mercado Pago.
            </p>
          </div>
        </section>

        <div className="catalog-controls">
          <div className="category-tabs">
            <button
              className={`tab ${activeCategory === '' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('')}
            >
              Todos
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`tab ${activeCategory === c.slug ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>

          <input
            className="search-input"
            type="search"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar productos"
          />
        </div>

        {loading ? (
          <div className="empty-state"><span className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
