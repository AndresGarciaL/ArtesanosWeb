import React, { useContext, useEffect, } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import { CarritoContext } from "./CarritoContext";
import "../styles/Carrito.css";
import Producto from "../components/Producto";
import Compra from "./Compra";

function Carrito() {
  const { productos, agregarAlCarrito } = useContext(CarritoContext);
  const { carrito, eliminarTotalDelCarrito } = useContext(CarritoContext);
  const { carrito2, eliminarDelCarrito } = useContext(CarritoContext);

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
                <span className="item">Precio por unidad: ${item.precio.toFixed(2)}</span>
                <span className="item">Subtotal: ${(item.precio * item.cantidad).toFixed(2)}</span>
              </div>
            ))}
            <div className="total-carrito">
              <span className="item-title-total">Total: </span>
              <span className="item-title-total">${calcularPrecioTotal()}</span>
            </div>
            <Link to="/Compra">
              <button className="button-compra">Continuar compra</button>
            </Link>
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