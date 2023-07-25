import axios from "axios";
import "./styles/Productos_Dash.css";
import SideBar_Dash from "./SideBar_Dash";
import Header_Dash from "./Header_Dash";
import Footer from "../components/Footer";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";


function Productos_Dash() {
  const mostrarAlertaDel = (id) => {
    swal({
      title: "¿Estás seguro que deseas eliminar?",
      text: "Esta acción es irreversible",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
      dangerMode: true,
    }).then((confirm) => {
      if (confirm) {
        swal("¡Confirmado!", "El Producto se eliminó con éxito", "success");
        handleEliminarProducto(id);
      } else {
        swal("Cancelado", "La acción fue cancelada", "error");
      }
    });
  };

  const [productos, setProductos] = useState([]);
  const [editingProducto, setEditingProducto] = useState(null);
  const [editedProducto, setEditedProducto] = useState({
    nombre: "",
    precio: ""
  });

  useEffect(() => {
    // Obtener productos de la base de datos
    axios
      .get("http://localhost:8081/productos")
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
  }, []);

  const handleEliminarProducto = (id) => {
    axios
      .delete(`http://localhost:8081/delproductos/${id}`)
      .then((response) => {
        console.log("Producto eliminado correctamente");
        // Actualizar la lista de productos después de eliminar
        setProductos(productos.filter((producto) => producto.id !== id));
      })
      .catch((error) => {
        console.error("Error al eliminar el producto:", error);
      });
  };

  const handleEditarProducto = (producto) => {
    setEditingProducto(producto);
    setEditedProducto({
      nombre: producto.nombre,
      precio: producto.precio
    });
  };

  const handleGuardarCambios = () => {
    axios
      .put(`http://localhost:8081/editproductos/${editingProducto.id}`, editedProducto)
      .then((response) => {
        console.log("Producto editado correctamente");
        // Actualizar la lista de productos después de editar
        const updatedProductos = productos.map((producto) => {
          if (producto.id === editingProducto.id) {
            return { ...producto, ...editedProducto };
          }
          return producto;
        });
        setProductos(updatedProductos);
        setEditingProducto(null);
      })
      .catch((error) => {
        console.error("Error al editar el producto:", error);
      });
  };

  const handleCancelarEdicion = () => {
    setEditingProducto(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProducto((prevEditedProducto) => ({
      ...prevEditedProducto,
      [name]: value
    }));
  };

  return (
    <>
      <Header_Dash />
      <div className="dashboard-container">
        <SideBar_Dash />
        <div className="separator">
          <h1></h1>
        </div>
        <section className="products-dash">
          <div className="title-produc-dash">
            <Link to="/Dashboard/AgregarProducto">
              <button
                style={{
                  display: "inline-block",
                  fontSize: "18px",
                  marginLeft: "20px",
                }}
              >
                Agregar
              </button>
            </Link>
            <h1 style={{
                    margin: "auto"
                  }}>Productos</h1>
           
          </div>
          {productos.map((producto) => {
            if (editingProducto && editingProducto.id === producto.id) {
              return (
                <div className="product-dash" key={producto.id}>
                  <div className="img-prod-dash">
                    <a href="">
                      <img
                        src={require(`../images/Productos/${producto.image}`)}
                        alt=""
                      />
                    </a>
                  </div>

                  <input
                    type="text"
                    name="nombre"
                    value={editedProducto.nombre}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="precio"
                    value={editedProducto.precio}
                    onChange={handleInputChange}
                  />

                  <div className="icons-actions-edit">
                    <button className="btn-guardar" onClick={handleGuardarCambios}>Guardar</button>
                    <button className="btn-cancelar" onClick={handleCancelarEdicion}>Cancelar</button>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="product-dash" key={producto.id}>
                  <div className="img-prod-dash">
                    <a href="">
                      <img
                        src={require(`../images/Productos/${producto.image}`)}
                        alt=""
                      />
                    </a>
                  </div>

                  <h3>{producto.nombre}</h3>
                  <h4>$ {typeof producto.precio === 'number' ? producto.precio.toFixed(2) : producto.precio}</h4>
                  <div className="icons-actions">
                    <img
                      className="img-edit2"
                      src={require(`./icons/editar.png`)}
                      alt=""
                      onClick={() => handleEditarProducto(producto)}
                    />
                    <p></p>
                    <img
                      className="img-del2"
                      src={require(`./icons/eliminar.png`)}
                      alt=""
                     onClick={() => mostrarAlertaDel(producto.id)}
                    />
                  </div>
                </div>
              );
            }
          })}
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Productos_Dash;
