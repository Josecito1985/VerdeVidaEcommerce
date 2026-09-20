-- =========================================================
-- Verde Vida — Datos de prueba
-- =========================================================
USE verdevida_db;

INSERT INTO categories (name, slug) VALUES
  ('Frutas', 'frutas'),
  ('Verduras', 'verduras'),
  ('Alimentos naturales', 'alimentos-naturales');

-- Usuario administrador de ejemplo (password: Admin123! -> hash generado con bcrypt, reemplazar en producción)
-- Generar el hash real con: node -e "console.log(require('bcrypt').hashSync('Admin123!', 10))"
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Administrador Verde Vida', 'admin@verdevida.com', '$2b$10$replace.with.a.real.bcrypt.hash.................', 'admin');

INSERT INTO products (category_id, name, description, price, image, stock) VALUES
  (1, 'Banana', 'Bananas frescas de estación, ideales para el desayuno.', 800.00, 'banana.png', 120),
  (1, 'Manzana roja', 'Manzanas rojas crocantes y dulces.', 1200.00, 'manzana.png', 90),
  (1, 'Frutillas', 'Frutillas frescas de productores locales.', 2200.00, 'frutillas.png', 40),
  (1, 'Naranja', 'Naranjas jugosas, ideales para exprimir.', 900.00, 'naranja.png', 100),
  (2, 'Tomate', 'Tomates redondos, seleccionados a mano.', 1100.00, 'tomate.png', 80),
  (2, 'Lechuga', 'Lechuga mantecosa fresca de hoja verde.', 700.00, 'lechuga.png', 60),
  (2, 'Papa', 'Papas de campo, ideales para todo uso.', 650.00, 'papa.png', 150),
  (2, 'Berenjena', 'Berenjenas frescas, firmes y brillantes.', 1300.00, 'berenjena.png', 35),
  (3, 'Miel pura', 'Miel 100% natural de productores regionales.', 3500.00, 'miel.png', 25),
  (3, 'Huevos de campo', 'Docena de huevos de gallinas libres.', 2800.00, 'huevos.png', 45);
