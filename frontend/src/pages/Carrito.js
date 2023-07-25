import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { CarritoContext } from "./CarritoContext";
import { UserContext } from "../components/UserContext"; // Importar el contexto de autenticación
import axios from "axios";
import "../styles/Carrito.css";
import Producto from "../components/Producto";

function Carrito() {
  const { productos, carrito, agregarAlCarrito, eliminarTotalDelCarrito, eliminarDelCarrito } = useContext(CarritoContext);
  const { usuario } = useContext(UserContext); // Obtener el usuario actual del contexto de autenticación

  useEffect(() => {
    // Guardar carrito en el almacenamiento local
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // Calcular el precio total del carrito
  const calcularPrecioTotal = () => {
    let total = 0;
    carrito.forEach((item) => {
      total += item.precio * item.cantidad;
    });
    return total.toFixed(2);
  };

  // Function to create a new order and its details in the database
  const crearNuevoPedido = () => {
    if (!usuario) {
      // Si no hay usuario autenticado, mostrar un mensaje o redirigir a la página de inicio de sesión
      console.log("Debes iniciar sesión antes de realizar un pedido.");
      return;
    }

    // Prepare the data for the new order
    const nuevoPedido = {
      usuario_id: usuario.id, // Utilizar el ID del usuario actual
      fecha_pedido: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      estado: 'En proceso', // Estado del pedido (puedes cambiarlo según tus necesidades)
      total: parseFloat(calcularPrecioTotal()), // Total del pedido (convertido a número decimal)
      detalles: carrito.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio
      }))
    };

    // Make a POST request to the server to create the new order and its details
    axios.post("http://localhost:8081/nuevo-pedido", nuevoPedido, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"), // Asegurar que el token de autenticación esté presente
      },
    })
      .then((response) => {
        // If the server responds with success, you can proceed to initiate the PayPal payment
        if (response.data.message === 'Pedido agregado correctamente') {
          iniciarPagoPayPal();
        } else {
          console.error("Error al crear el nuevo pedido:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error al crear el nuevo pedido:", error);
      });
  };

  // Function to initiate the PayPal payment
  const iniciarPagoPayPal = () => {
    const totalAmount = calcularPrecioTotal();
    const currency = "USD"; // Set the currency according to your requirement
    const description = "Compra en MiTienda"; // Set the description as needed

    // Make a POST request to your server to initiate the PayPal payment
    fetch("http://localhost:8081/createPayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ totalAmount, currency, description }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Once you get the approval URL, open a new window for PayPal payment
        window.open(data.approvalURL, "_blank", "noopener,noreferrer");
      })
      .catch((error) => {
        console.error("Error initiating PayPal payment:", error);
      });
  };
  return (
    <>
      <Header />
      <Breadcrumb currentPage="Carrito" />

      <section className="section-carrito">
        <div className="detalle-carrito">
          <div className="titulo-resumen-carrito">
            <h3>Resumen de compra</h3>
          </div>
          <div className="resumen-carrito">
            {carrito.map((item) => (
              <div key={item.id} className="item-resumen">
                <span className="item-title">🟢 {item.nombre}</span>
                <span className="item">Cantidad: {item.cantidad}</span>
                <span className="item">
                  Precio por unidad: ${item.precio.toFixed(2)}
                </span>
                <span className="item">
                  Subtotal: ${(item.precio * item.cantidad).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="total-carrito">
              <span className="item-title-total">Total: </span>
              <span className="item-title-total">${calcularPrecioTotal()}</span>
            </div>
            <button className="button-compra" onClick={iniciarPagoPayPal}>
              Continuar compra
            </button>
          </div>
        </div>

      
               <div className="container-carrito">
          {carrito.map((item) => (
            <div className="products-cart" key={item.id}>
              <div className="product-cart">
                <a href="">
                  <img
                    className="img"
                    src={require(`../images/Productos/${item.image}`)}
                    alt=""
                  />
                </a>
              </div>
              <div className="prodc-nombre-carrito">
                <h5>{item.nombre}</h5>
                <div className="botones-carrito">
                  <div className="btn-carrito">
                    <div className="btn-eliminar">
                      <button onClick={() => eliminarTotalDelCarrito(item)}>
                        Eliminar
                      </button>
                    </div>
                    <div className="btn--carrito">
                      <a href="#">Comprar ahora</a>
                    </div>
                    <div className="btn--carrito">
                      <a href="#">Guardar</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-cart">
                <div className="quantity-selector">
                  <button
                    className="quantity-btn minus"
                    onClick={() =>
                      eliminarDelCarrito({
                        ...item,
                        cantidad: item.cantidad - 1,
                      })
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={item.cantidad}
                    readOnly
                    className="quantity-input"
                  />
                  <button
                    className="quantity-btn plus"
                    onClick={() =>
                      agregarAlCarrito({
                        ...item,
                        cantidad: item.cantidad + 1,
                      })
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="prodc-precio-carrito">
                <h4>$ {(item.precio * item.cantidad).toFixed(2)}</h4>
              </div>
            </div>
          ))}
        </div>
    
      </section>

      <div>
        <div className="products">
          <div className="title-carrito">
            <h1>Recomendaciones para ti</h1>
          </div>
          {productos.map((producto) => (
            <Producto
              key={producto.id}
              producto={producto}
              agregarAlCarrito={agregarAlCarrito}
            />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Carrito;
