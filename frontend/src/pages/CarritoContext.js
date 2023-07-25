import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { UserContext } from "../components/UserContext";

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  const { usuario } = useContext(UserContext); // Get the logged-in user from UserContext

  useEffect(() => {
    // Fetch products from the database
    axios
      .get("http://localhost:8081/productos")
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });

    // Get the shopping cart of the logged-in user from local storage on component load
    if (usuario) {
      const carritoGuardado = localStorage.getItem(`carrito_${usuario.id}`);
      if (carritoGuardado) {
        setCarrito(JSON.parse(carritoGuardado));
      }
    }
  }, [usuario]); // The 'usuario' dependency ensures the cart is loaded when the user changes

  const guardarCarritoEnLocalStorage = (carritoActual) => {
    if (usuario) {
      localStorage.setItem(`carrito_${usuario.id}`, JSON.stringify(carritoActual));
    }
  };

  const agregarAlCarrito = (producto) => {
    const productoEnCarrito = carrito.find((item) => item.id === producto.id);
    const stockDisponible = producto.stock;

    if (productoEnCarrito) {
      if (productoEnCarrito.cantidad < stockDisponible) {
        // Increase the quantity in the cart
        const nuevoCarrito = carrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
        setCarrito(nuevoCarrito);
      } else {
        // Show warning alert if stock is insufficient
        Swal.fire({
          icon: 'warning',
          title: 'Stock insuficiente',
          text: 'No hay suficiente stock disponible para agregar más productos.',
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: 'OK',
        });
      }
    } else {
      if (1 <= stockDisponible) {
        // Add the product to the cart
        setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      } else {
        // Show warning alert if stock is insufficient
        Swal.fire({
          icon: 'warning',
          title: 'Stock insuficiente',
          text: 'No hay suficiente stock disponible para agregar este producto.',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const eliminarDelCarrito = (producto) => {
    const productoEnCarrito = carrito.find((item) => item.id === producto.id);
    if (productoEnCarrito) {
      // Check if the current quantity is greater than 1 before subtracting
      if (productoEnCarrito.cantidad > 1) {
        const nuevoCarrito = carrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad - 1 } : item
        );
        setCarrito(nuevoCarrito);
      } else {
        // Remove the product from the cart if the quantity is 1
        const nuevoCarrito = carrito.filter((item) => item.id !== producto.id);
        setCarrito(nuevoCarrito);

        // Show error alert if the quantity reaches 0
        Swal.fire({
          icon: 'error',
          title: 'Producto eliminado',
          text: 'Se eliminó el producto del carrito de compras',
          showConfirmButton: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonText: 'OK',
        });

      }
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const eliminarTotalDelCarrito = (producto) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== producto.id);
    setCarrito(nuevoCarrito);
    Swal.fire({
      icon: 'error',
      title: 'Productos eliminados',
      text: 'Se eliminaron todos los productos del carrito de compras',
      confirmButtonText: 'OK',
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  };

  // Save the shopping cart to local storage whenever it changes
  useEffect(() => {
    guardarCarritoEnLocalStorage(carrito);
  }, [carrito]);

  return (
    <CarritoContext.Provider
      value={{ productos, carrito, agregarAlCarrito, eliminarTotalDelCarrito, eliminarDelCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
