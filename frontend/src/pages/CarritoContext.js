import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import "../styles/Carrito.css";
import Swal from 'sweetalert2';

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);

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

    // Obtener carrito del almacenamiento local
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  useEffect(() => {
    // Guardar carrito en el almacenamiento local
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  //Añadir productos cantidad y mostrar alerta
  const agregarAlCarrito = (producto) => {
    const productoEnCarrito = carrito.find((item) => item.id === producto.id);
    const stockDisponible = producto.stock;

    if (productoEnCarrito) {
      if (productoEnCarrito.cantidad < stockDisponible) {
        // Aumentar la cantidad en el carrito
        const nuevoCarrito = carrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
        setCarrito(nuevoCarrito);
      } else {
        // Mostrar alerta de advertencia
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
        // Agregar el producto al carrito
        setCarrito([...carrito, { ...producto, cantidad: 1 }]);
      } else {
        // Mostrar alerta de advertencia
        Swal.fire({
          icon: 'warning',
          title: 'Stock insuficiente',
          text: 'No hay suficiente stock disponible para agregar este producto.',
          confirmButtonText: 'OK',
        });
      }
    }
  };


  //Eliminar productos cantidad
  const eliminarDelCarrito = (producto) => {
    const productoEnCarrito = carrito.find((item) => item.id === producto.id);
    if (productoEnCarrito) {
      // Verificar si la cantidad actual es mayor a 1 antes de restar
      if (productoEnCarrito.cantidad > 1) {
        const nuevoCarrito = carrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad - 1 } : item
        );
        setCarrito(nuevoCarrito);
      } else {
        // Eliminar el producto del carrito si la cantidad es 1
        const nuevoCarrito = carrito.filter((item) => item.id !== producto.id);
        setCarrito(nuevoCarrito);

        // Mostrar alerta de advertencia si la cantidad llega a 0
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

  //Eliminar todos los productos del carrito
  const eliminarTotalDelCarrito = (producto) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== producto.id);
    setCarrito(nuevoCarrito);
    Swal.fire({
      icon: 'error',
      title: 'Productos eliminados',
      text: 'Se eliminarón todos los productos del carrito de compras',
      confirmButtonText: 'OK',
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'OK',
    });
  };


  return (
    <CarritoContext.Provider
      value={{ productos, carrito, agregarAlCarrito, eliminarTotalDelCarrito, eliminarDelCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
