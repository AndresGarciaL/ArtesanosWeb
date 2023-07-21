import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import jwt_decode from 'jwt-decode';

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));



const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce',
});

connection.connect((error) => {
  if (error) {
    console.log('No fue posible la conexión');
  } else {
    console.log('Conexión con el servidor exitosa');
  }
});


// Ruta para obtener todos los productos
app.get('/productos', (req, res) => {
  const query = 'SELECT * FROM productos';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los productos:', err);
      res.status(500).json({ error: 'Error al obtener los productos' });
      return;
    }

    res.json(results);
  });
});

// Ruta para obtener todas las categorías
app.get('/categorias', (req, res) => {
  const query = 'SELECT * FROM categorias';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener las categorías:', err);
      res.status(500).json({ error: 'Error al obtener las categorías' });
      return;
    }

    res.json(results);
  });
});

// Ruta para obtener los productos por categoría
app.get('/categorias/:id', (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM productos WHERE categoria_id = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener los productos por categoría:', err);
      res.status(500).json({ error: 'Error al obtener los productos por categoría' });
      return;
    }

    res.json(results);
  });
});

// Ruta para añadir una nueva categoría
app.post('/addcategorias', (req, res) => {
  const { nombre } = req.body;
  const query = `INSERT INTO categorias (nombre) VALUES (?)`;
  const values = [nombre];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error al añadir la categoría:', err);
      res.status(500).json({ error: 'Error al añadir la categoría' });
      return;
    }

    res.json({ message: 'Categoría añadida correctamente' });
  });
});

// Ruta para añadir un nuevo producto
app.post('/addproducto', (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, image } = req.body;
  const query = `INSERT INTO productos (nombre, descripcion, precio, stock, categoria_id, image) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [nombre, descripcion, precio, stock, categoria, image];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error al añadir el producto:', err);
      res.status(500).json({ error: 'Error al añadir el producto' });
      return;
    }

    res.json({ message: 'Producto añadido correctamente' });
  });
});


//RUTA PARA ELIMINAR UN PRODUCTO
app.delete('/delproductos/:id', (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM productos WHERE id = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar el producto:', err);
      res.status(500).json({ error: 'Error al eliminar el producto' });
      return;
    }

    res.json({ message: 'Producto eliminado correctamente' });
  });
});

// Ruta para modificar un producto
app.put('/editproductos/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, precio } = req.body;
  const query = `UPDATE productos SET nombre = ?, precio = ? WHERE id = ?`;
  const values = [nombre, precio, id];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error al modificar el producto:', err);
      res.status(500).json({ error: 'Error al modificar el producto' });
      return;
    }

    res.json({ message: 'Producto modificado correctamente' });
  });
});


//RUTA PARA ELIMINAR UNA CATEGORIA 
app.delete('/delcategoria/:id', (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM categorias WHERE id = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar la categoría:', err);
      res.status(500).json({ error: 'Error al eliminar la categoría' });
      return;
    }

    res.json({ message: 'Categoría eliminada correctamente' });
  });
});

// Ruta para modificar el nombre de una categoría
app.put('/editcategoria/:id', (req, res) => {
  const id = req.params.id;
  const { nombre } = req.body;
  const query = `UPDATE categorias SET nombre = ? WHERE id = ?`;
  const values = [nombre, id];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error al modificar el nombre de la categoría:', err);
      res.status(500).json({ error: 'Error al modificar el nombre de la categoría' });
      return;
    }

    res.json({ message: 'Nombre de la categoría modificado correctamente' });
  });
});

//Ruta para obtener todos los roles
// Ruta para obtener todos los roles
app.get('/roles', (req, res) => {
  const query = 'SELECT * FROM roles';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los roles:', err);
      res.status(500).json({ error: 'Error al obtener los roles' });
      return;
    }

    res.json(results);
  });
});


// Ruta para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  const query = 'SELECT * FROM usuarios';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los usuarios:', err);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
      return;
    }

    res.json(results);
  });
});

//RUTA PARA AGREGAR UN NUEVO USUARIO
app.post('/addusuarios', (req, res) => {
  const { nombre, apellidos, email, contrasena, direccion, rol_id, estatus } = req.body;

  // Generar el hash de la contraseña
  bcrypt.hash(contrasena, 10, (error, hash) => {
    if (error) {
      console.error('Error al generar el hash de la contraseña:', error);
      res.status(500).json({ error: 'Error al añadir el usuario' });
      return;
    }

    // El hash se encuentra en la variable 'hash', ahora podemos usarlo en la consulta
    const query = `INSERT INTO usuarios (nombre, apellidos, email, contrasena, direccion, rol_id, estatus) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [nombre, apellidos, email, hash, direccion, rol_id, estatus];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error al añadir el usuario:', err);
        res.status(500).json({ error: 'Error al añadir el usuario' });
        return;
      }

      res.json({ message: 'Usuario añadido correctamente' });
    });
  });
});

//RUTA PARA ELIMINAR UN USUARIO
app.delete('/delusuario/:id', (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM usuarios WHERE id = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar el usuario:', err);
      res.status(500).json({ error: 'Error al eliminar el usuario' });
      return;
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  });
});


//RUTA PARA MODIFICAR UN USUARIO
app.put('/editusuario/:id', (req, res) => {
  const id = req.params.id;
  const { nombre, apellidos, email, contrasena, direccion, rol_id, estatus } = req.body;
  const query = `UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, contrasena = ?, direccion = ?, rol_id = ?, estatus = ? WHERE id = ?`;
  const values = [nombre, apellidos, email, contrasena, direccion, rol_id, estatus, id];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error al modificar el usuario:', err);
      res.status(500).json({ error: 'Error al modificar el usuario' });
      return;
    }

    res.json({ message: 'Información del usuario modificada correctamente' });
  });
});

// Register
app.post('/registrar', (req, res) => {
  const { nombre,apellidos, email, contrasena } = req.body;

  // Generar el hash de la contraseña
  bcrypt.hash(contrasena, 10, (error, hash) => {
    if (error) {
      console.log('Error al generar el hash de la contraseña', error);
      res.status(500).json({ Estatus: 'ERROR', Error: 'Error al registrar usuario' });
    } else {
      const sql = 'INSERT INTO usuarios (nombre,apellidos, email, contrasena,rol_id, estatus) VALUES (?,?,?,?,2,1)';
      connection.query(sql, [nombre,apellidos, email, hash], (error, resultado) => {
        if (error) {
          console.log('Error al registrar usuario', error);
          res.status(500).json({ Estatus: 'ERROR', Error: 'Error al registrar usuario' });
        } else {
          res.json({ Estatus: 'CORRECTO' });
        }
      });
    }
  });
});

  //* LOGIN
  app.post("/login", (peticion, respuesta) => {
    const { email, contrasena } = peticion.body;
    const query = "SELECT contrasena FROM usuarios WHERE email = ?";
    connection.query(query, [email], (error, resultados) => {
      if (error) return respuesta.json({ Error: "Error en la consulta." });
      if (resultados.length === 0) return respuesta.json({ Error: "Error en la consulta" });
      const usuario = resultados[0];
      const match = bcrypt.compareSync(contrasena, usuario.contrasena);
      if (match) {
        const token = jwt.sign({ email: email }, "secreto"); // Corrige el campo aquí
        return respuesta.json({ Estatus: "CORRECTO", Resultado: usuario, token });
      } else {
        return respuesta.json({ Error: "Error en las credenciales del usuario" });
      }
    });
  });
  
  app.post("/VerificarCorreo", (peticion, respuesta) => {
    const { email } = peticion.body;
    const query = "SELECT * FROM usuarios WHERE email = ?";
    connection.query(query, [email], (error, resultados) => {
      if (error) {
        return respuesta.json({ Error: "Error en la consulta" });
      } else {
        if (resultados.length > 0) {
          return respuesta.json({ Estatus: "Correcto", Resultado: resultados });
        } else {
          return respuesta.json({ Error: "El usuario no existe" });
        }
      }
    });
  });
  
  // Autenticar
  const autenticarUsuario = (peticion, respuesta, siguiente) => {
    const token = peticion.header("Authorization");
    if (!token) {
      return respuesta.status(401).json({ Error: "Acceso no autorizado" });
    }
    try {
      const decoded = jwt.verify(token, "secreto"); // Asegúrate de que "secreto" coincida con la clave usada para firmar el token
      peticion.user = decoded;
      siguiente();
    } catch (error) {
      return respuesta.status(401).json({ Error: "Acceso no autorizado" });
    }
  };

  app.get("/UsuarioActual", autenticarUsuario, (peticion, respuesta) => {
    const { email } = peticion.user;
    const query = "SELECT * FROM usuarios WHERE email = ?";
    connection.query(query, [email], (error, resultados) => {
      if (error) {
        return respuesta.status(500).json({ Error: "Error en la consulta" });
      } else {
        if (resultados.length > 0) {
          const usuario = resultados[0];
          return respuesta.json({ Estatus: "CORRECTO", Resultado: usuario });
        } else {
          return respuesta.status(404).json({ Error: "Usuario no encontrado" });
        }
      }
    });
  });

// Iniciar server
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});