// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page container">
      <div className="empty-state">
        <h2>Página no encontrada</h2>
        <p>El enlace al que intentaste acceder no existe.</p>
        <Link to="/" className="btn btn-primary">Volver al catálogo</Link>
      </div>
    </div>
  );
}
