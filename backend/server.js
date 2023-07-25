import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import multer from 'multer';
import paypal from 'paypal-rest-sdk';

paypal.configure({
  mode: 'sandbox', // Set this to 'live' for production environment
  client_id: 'AU9szlwCmWWHB8Pk4lmuQkyArUn9FQkr8GkUTQ4K5saTz9yoJxeUjIPASeDZOG5vWyoz4lW7y5Paempq',
  client_secret: 'EBDDabpWfnBNNj3PlqfmNS_L64c9MTpH2YChYjvlSbV58VRGGmrcNdtdXiIp_rhyoDeJa3c11CRQCejz',
});

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

// Route to initiate PayPal payment
app.post('/createPayment', (req, res) => {
  const { totalAmount, currency, description } = req.body;

  const paymentData = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: 'http://localhost:3000/Finalizacion', // Replace this with your success URL
      cancel_url: 'http://localhost:8081/cancel', // Replace this with your cancel URL
    },
    transactions: [{
      amount: {
        total: totalAmount,
        currency,
      },
      description,
    }],
  };

  // Create the payment
  paypal.payment.create(paymentData, (error, payment) => {
    if (error) {
      console.error('Error creating PayPal payment:', error);
      res.status(500).json({ error: 'Error creating PayPal payment' });
    } else {
      // Redirect the user to the PayPal payment approval URL
      const approvalURL = payment.links.find(link => link.rel === 'approval_url').href;
      res.json({ approvalURL });
    }
  });
});

// Route for PayPal payment success
app.get('/success', (req, res) => {
  const { paymentId, PayerID } = req.query;

  // Execute the payment
  paypal.payment.execute(paymentId, { payer_id: PayerID }, (error, payment) => {
    if (error) {
      console.error('Error executing PayPal payment:', error);
      res.status(500).json({ error: 'Error executing PayPal payment' });
    } else {
      // Payment successfully executed, do something with the payment details if needed
      res.json({ message: 'Payment successful' });
    }
  });
});

// Route for PayPal payment cancel
app.get('/cancel', (req, res) => {
  res.json({ message: 'Payment canceled' });
});



const storage = multer.diskStorage({
  destination: '../frontend/src/images/Productos', // Change the destination folder to your desired location
  filename: function (req, file, cb) {
    // Get the original file extension
    const originalFileExtension = file.originalname.split('').pop();
    cb(null, file.originalname); // Use the original file name as the new filename
  },
});

const upload = multer({ storage: storage });

// Ruta para añadir un nuevo producto with image upload
app.post('/addproducto', upload.single('image'), (req, res) => {
  const { nombre, descripcion, precio, stock, categoria } = req.body;
  const image = req.file.filename; // Save the filename in the database

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
    const query = `INSERT INTO usuarios (nombre, apellidos, email, contrasena, direccion, rol_id, estatus) VALUES (?, ?, ?, ?, ?, ?, 1)`;
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


// Ruta para agregar un nuevo pedido
app.post('/nuevopedido', (req, res) => {
  const { usuario_id, total, detalles } = req.body;

  // Primero, insertamos el pedido en la tabla "pedidos"
  const insertPedidoQuery = `INSERT INTO pedidos (usuario_id, fecha_pedido, estado, total) VALUES (?, NOW(), 'Correcto', ?)`;
  connection.query(insertPedidoQuery, [usuario_id, total], (err, resultPedido) => {
    if (err) {
      console.error('Error al insertar el pedido:', err);
      res.status(500).json({ error: 'Error al insertar el pedido' });
      return;
    }

    const pedido_id = resultPedido.insertId; // Obtener el ID del pedido recién insertado

    // Luego, insertamos los detalles del pedido en la tabla "detalles_pedidos"
    const insertDetallesQuery = `INSERT INTO detalles_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES ?`;
    const detallesValues = detalles.map(({ producto_id, cantidad, precio_unitario }) => [pedido_id, producto_id, cantidad, precio_unitario]);

    connection.query(insertDetallesQuery, [detallesValues], (err, resultDetalles) => {
      if (err) {
        console.error('Error al insertar los detalles del pedido:', err);
        res.status(500).json({ error: 'Error al insertar los detalles del pedido' });
        return;
      }

      res.json({ message: 'Pedido insertado correctamente' });
    });
  });
});



  // Ruta para obtener todos los pedidos
app.get('/pedidos', (req, res) => {
  const query = 'SELECT * FROM pedidos';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los pedidos:', err);
      res.status(500).json({ error: 'Error al obtener los pedidos' });
      return;
    }

    res.json(results);
  });
});





app.delete('/delpedido/:id', (req, res) => {
  const id = req.params.id;

  // Primero, eliminamos los detalles de pedido asociados al pedido
  const deleteDetallesQuery = `DELETE FROM detalles_pedidos WHERE pedido_id = ?`;
  connection.query(deleteDetallesQuery, [id], (err, resultDetalles) => {
    if (err) {
      console.error('Error al eliminar los detalles del pedido:', err);
      res.status(500).json({ error: 'Error al eliminar los detalles del pedido' });
      return;
    }

    // Luego, eliminamos el pedido
    const deletePedidoQuery = `DELETE FROM pedidos WHERE id = ?`;
    connection.query(deletePedidoQuery, [id], (err, resultPedido) => {
      if (err) {
        console.error('Error al eliminar el pedido:', err);
        res.status(500).json({ error: 'Error al eliminar el pedido' });
        return;
      }

      res.json({ message: 'Pedido eliminado correctamente' });
    });
  });
});



// Ruta para obtener un pedido y sus detalles de productos por su ID
app.get('/detalle-pedido/:id', (req, res) => {
  const pedidoId = req.params.id;

  // Consultar el pedido y sus detalles de productos
  const query = `
    SELECT 
      p.id AS pedido_id,
      p.fecha_pedido,
      p.estado,
      dp.id AS detalle_id,
      dp.cantidad,
      pr.id AS producto_id,
      pr.nombre AS producto_nombre,
      pr.descripcion AS producto_descripcion,
      pr.precio AS producto_precio,
      pr.stock AS producto_stock,
      pr.image AS producto_image
    FROM 
      pedidos p
    JOIN 
      detalles_pedidos dp ON p.id = dp.pedido_id
    JOIN 
      productos pr ON dp.producto_id = pr.id
    WHERE p.id = ?;
  `;

  connection.query(query, [pedidoId], (err, results) => {
    if (err) {
      console.error('Error al obtener el pedido y sus detalles de productos:', err);
      res.status(500).json({ error: 'Error al obtener el pedido y sus detalles de productos' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }

    // Organizar los datos en una estructura más legible
    const pedidoInfo = {
      pedido_id: results[0].pedido_id,
      fecha_pedido: results[0].fecha_pedido,
      estado: results[0].estado,
      detalles: []
    };

    results.forEach(row => {
      const detalleProducto = {
        detalle_id: row.detalle_id,
        cantidad: row.cantidad,
        precio_unitario: row.producto_precio, // Renombrar precio a precio_unitario
        producto: {
          producto_id: row.producto_id,
          nombre: row.producto_nombre,
          descripcion: row.producto_descripcion,
          precio: row.producto_precio,
          stock: row.producto_stock,
          image: row.producto_image
        }
      };

      pedidoInfo.detalles.push(detalleProducto);
    });

    res.json(pedidoInfo);
  });
});


// Iniciar server
const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});