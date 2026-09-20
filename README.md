# 🌿 Verde Vida — E-Commerce

Tienda online de frutas, verduras y alimentos naturales. Proyecto reconstruido
con backend modularizado, carrito persistente en base de datos e integración
funcional con Mercado Pago.

## Estructura del proyecto

```
verdevida-app/
├── database/
│   ├── schema.sql      # Creación de la base de datos y tablas
│   └── seed.sql        # Datos de ejemplo (categorías, productos, admin)
├── backend/            # API en Node.js + Express + MySQL
└── frontend/           # React + Vite
```

## 1. Base de datos (MySQL 8+)

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

> El usuario admin de `seed.sql` trae un hash de contraseña de ejemplo que **no
> es válido**. Generá uno real antes de usarlo:
> ```bash
> node -e "console.log(require('bcrypt').hashSync('TuPasswordSegura123', 10))"
> ```
> y actualizá el campo `password_hash` del usuario admin con el resultado.

## 2. Backend

```bash
cd backend
cp .env.example .env     # completá tus credenciales de MySQL y tu MP_ACCESS_TOKEN
npm install
npm run dev               # http://localhost:4000
```

Variables clave en `.env`:
- `MP_ACCESS_TOKEN`: Access Token de tu cuenta de Mercado Pago (modo TEST para pruebas).
- `MP_BACK_URL_*`: a dónde redirige Mercado Pago después del pago (deben apuntar
  a la URL pública real del frontend en producción, no a `localhost`).
- `JWT_SECRET`: generá uno propio y largo, nunca reutilices el de ejemplo.

**Importante:** el archivo `.env` nunca debe subirse a git (ya está en
`.gitignore`). Si alguna vez se commitea por error, rotá todas las credenciales
inmediatamente aunque lo borres del repo después.

## 3. Frontend

```bash
cd frontend
cp .env.example .env      # VITE_API_URL apuntando a tu backend
npm install
npm run dev                # http://localhost:5173
```

Las imágenes de productos van en `frontend/public/productos/` (crear la
carpeta), con el mismo nombre de archivo que cargues en el campo `image` de
cada producto (por ejemplo `banana.png`).

## 4. Flujo de pago con Mercado Pago

1. El cliente arma su carrito (persistido en la base de datos) y va a Checkout.
2. El backend crea el pedido, descuenta stock y genera una `Preference` en
   Mercado Pago dentro de una transacción atómica.
3. El cliente paga en el entorno de Mercado Pago y es redirigido según
   `MP_BACK_URL_*`.
4. Mercado Pago notifica el resultado al webhook `POST /api/payments/webhook`,
   que actualiza el estado real del pedido (`approved` / `rejected` / `pending`).

Para probar el webhook en desarrollo local, exponé tu backend con una
herramienta como [ngrok](https://ngrok.com/) y configurá esa URL pública en el
panel de Mercado Pago Developers.

## 5. Usuarios y roles

- `cliente`: navega el catálogo, gestiona su carrito y compra.
- `admin`: además puede dar de alta/editar/dar de baja productos y gestionar
  el estado de los pedidos, desde `/admin/productos` y `/admin/pedidos`.

## 6. Próximos pasos sugeridos

- Subir imágenes reales de los productos.
- Configurar el webhook de Mercado Pago con una URL pública fija (Render,
  Railway, etc.).
- Agregar tests automáticos sobre `services/` (la lógica de negocio ya está
  separada de Express, así que es fácil testear sin levantar el servidor).
