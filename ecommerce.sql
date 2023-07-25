CREATE DATABASE ecommerce;
USE ecommerce;

-- Crear la tabla Categorías
CREATE TABLE categorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL
);
-- Crear la tabla Productos
CREATE TABLE productos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100),
  descripcion TEXT,
  precio DECIMAL(10, 2),
  stock INT NOT NULL,
  categoria_id INT,
  image varchar (50),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);
-- Crear la tabla de roles
CREATE TABLE roles(
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100)
);
-- Crear la tabla Usuarios
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100),
  apellidos VARCHAR(100),
  email VARCHAR(100),
  contrasena VARCHAR(100),
  direccion VARCHAR(200),
  rol_id int ,
  estatus int,
  FOREIGN KEY (rol_id) REFERENCES roles(id)
);

CREATE TABLE pedidos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  fecha_pedido DATETIME,
  estado VARCHAR(50),
  total DECIMAL(10, 2),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE detalles_pedidos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  pedido_id INT,
  producto_id INT,
  cantidad INT,
  precio_unitario DECIMAL(10, 2),
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);



INSERT INTO roles (nombre)
VALUES
  ('Administrador'),
  ('Cliente');


INSERT INTO categorias (nombre)
VALUES
  ('Hogar'),
  ('Ropa'),
  ('Joyeria'),
  ('Accesorios');

-- Primera inserción
INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id,image)
VALUES
  ('Guayabera Manga Larga', 'Hermosa guayabera en lino con bordado a mano, calado y panel de rejilla. Hecho en Yucatán.', 1525, 10, 2,'guayabera.webp'),
  ('Mouse Pad Piedra del Sol', 'Mouse pad con ilustración prehispánica de la cultura Azteca, la piedra del sol.', 263, 5, 4,'mousepad.webp'),
  ('Anillo de Plata 2 Hojas', 'Hermoso anillo de plata 925 con forma de hojas, hecho por artesanos mexicanos en el estado de Guerrero. ', 610, 10, 3,'anillo.webp'),
  ('Blusa Jalapa de Dias', 'Blusa negra con hermoso bordado a mano en colores. Hecho en Oaxaca.', 1902, 15, 2,'blusa.webp'),
  ('Alebrije Armadillo', 'Colorido alebrije con forma de armadillo, pintado y tallado a mano por artesanos mexicanos en el estado de Oaxaca.', 1136,10, 1,'armadillo.avif');

  SELECT 
  p.id AS id_pedido,
  pr.nombre AS nombre_producto,
  dp.cantidad,
  pr.precio AS costo_unitario
FROM 
  pedidos p
JOIN 
  usuarios u ON p.usuario_id = u.id
JOIN 
  detalles_pedidos dp ON p.id = dp.pedido_id
JOIN 
  productos pr ON dp.producto_id = pr.id   WHERE p.id = 1;

