import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./styles/Finalizacion.css";
import Breadcrumb from "../components/Breadcrumb";
import axios from 'axios';

function Finalizacion() {
  const [cartItems, setCartItems] = useState([]);

  // Define a function to get the cart items from localStorage
  function getCartItems() {
    const cartItems = localStorage.getItem('carrito');
    return cartItems ? JSON.parse(cartItems) : [];
  }

  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    const items = getCartItems();
    setCartItems(items);
  }, []);

  // Calculate the total payment
  const totalPayment = cartItems.reduce((acc, item) => {
    return acc + item.precio * item.cantidad;
  }, 0);

  // Function to insert the order and order details into the database
  async function insertPedido() {
    try {
      // Get user ID from localStorage
      const usuario_id = localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')).id : null;

      if (!usuario_id) {
        console.error('Error: No user ID found in localStorage.');
        return; // Do not proceed with the insert if the user ID is not available
      }

      // Check if cartItems is not empty before proceeding with the insert
      if (cartItems.length === 0) {
        console.warn('Warning: Cart is empty. No order will be inserted.');
        return;
      }

      // Create an object with the order data
      const pedidoData = {
        usuario_id: usuario_id,
        total: totalPayment,
        detalles: cartItems.map(item => {
          return {
            producto_id: item.id,
            cantidad: item.cantidad,
            precio_unitario: item.precio
          };
        })
      };

      // Send the order data to the server
      await axios.post('http://localhost:8081/nuevopedido', pedidoData);

    } catch (error) {
      console.error('Error al insertar el pedido:', error);
    }
  }

  useEffect(() => {
    // Call the function to insert the order after the component mounts and totalPayment is calculated
    insertPedido();
  }, [totalPayment]); // Run this effect whenever totalPayment changes

  return (
    <>
      <Header />
      <Breadcrumb currentPage="Finalizacion" />
      <main>
        <img
          id="comprobado"
          src={require("./finalizacion/comprobado.png")}
          alt="Finalizacion"
        />
        <h2>¡Gracias por tu compra!</h2>
        <div className="compra-recibida">
          <h3>Tu solicitud de compra fue recibida</h3>
          <p>
            Tu pedido se encuentra en proceso de validación, en breve recibirás un
            correo con el detalle de tu compra
          </p>
        </div>

        {/* Display the cart items in the table */}
        <div className="left">
          <h2 id="h2-resumen">Resumen de Compra</h2>
          <table style={{ border: "1px solid black", padding: "8px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>ID</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Nombre</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Descripción</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Cantidad</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Precio</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{item.id}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{item.nombre}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{item.descripcion}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{item.cantidad}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>${item.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Display the total payment */}
        <div className="compra-recibida">
          <h3>Pagaste en Total: ${totalPayment}</h3>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Finalizacion;
