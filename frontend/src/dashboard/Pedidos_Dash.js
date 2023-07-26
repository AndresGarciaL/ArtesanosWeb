import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Usuarios_Dash.css";
import SideBar_Dash from "./SideBar_Dash";
import Header_Dash from "./Header_Dash";
import Footer from "../components/Footer";
import swal from "sweetalert";

function Pedidos_Dash() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Obtener todos los pedidos
    axios
      .get("http://localhost:8081/pedidos")
      .then((response) => {
        setPedidos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los pedidos:", error);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8081/delpedido/${id}`)
      .then((response) => {
        setPedidos(pedidos.filter((pedido) => pedido.id !== id));
      })
      .catch((error) => {
        console.error("Error al eliminar el pedido:", error);
      });
  };

  const mostrarDetallesEnTabla = (pedidoDetalle) => {
    // Crear la tabla en formato HTML
    const tablaHTML = `
      <div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              
              <th style="border: 1px solid black; padding: 8px; text-align: left; margin-bottom: 10px;">Nombre del Producto</th>
              <th style="border: 1px solid black; padding: 8px; text-align: left; margin-bottom: 10px;">Cantidad</th>
              <th style="border: 1px solid black; padding: 8px; text-align: left; margin-bottom: 10px;">Costo Unitario</th>
            </tr>
          </thead>
          <tbody>
            ${pedidoDetalle.detalles.map((detalle) => `
              <tr key=${detalle.detalle_id}>
                
                <td style="border: 1px solid black; padding: 8px;">${detalle.producto.nombre}</td>
                <td style="border: 1px solid black; padding: 8px;">${detalle.cantidad}</td>
                <td style="border: 1px solid black; padding: 8px;">${detalle.precio_unitario}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Mostrar la alerta con la tabla en formato HTML
    swal({
      title: "Detalles del pedido",
      content: {
        element: 'div',
        attributes: {
          innerHTML: tablaHTML
        }
      },
      icon: "info",
      buttons: ["Aceptar"],
    });
  };

  const mostrarAlertaDel = (id) => {
    swal({
      title: "¿Estás seguro que deseas eliminar?",
      text: "Esta acción es irreversible",
      icon: "warning",
      buttons: ["Cancelar", "Aceptar"],
      dangerMode: true,
    }).then((confirm) => {
      if (confirm) {
        swal("¡Confirmado!", "Pedido eliminado con éxito", "success");
        handleDelete(id);
      } else {
        swal("Cancelado", "La acción fue cancelada", "error");
      }
    });
  };

  const mostrarAlertaDet = (id) => {
    // Obtener el detalle del pedido por su ID
    axios
      .get(`http://localhost:8081/detalle-pedido/${id}`)
      .then((response) => {
        const pedidoDetalle = response.data;
        mostrarDetallesEnTabla(pedidoDetalle); // Mostrar los detalles en forma de tabla
      })
      .catch((error) => {
        console.error("Error al obtener el detalle del pedido:", error);
      });
  };

  return (
    <>
      <Header_Dash />
      <div className="dashboard-container">
        <SideBar_Dash />
        <div className="container-users">
          <section className="dash-users">
            <div className="title-users-dash">
              <h1 style={{ fontSize: "24px", textAlign: "center", margin: "auto" }}>Pedidos</h1>
            </div>
            <div className="users-info">
              <table className="table-users">
                <thead>
                  <tr>
                    <th className="center">
                      <h4>Usuario</h4>
                    </th>
                    <th className="center">
                      <h4>Fecha de Pedido</h4>
                    </th>
                    <th className="center">
                      <h4>Estado</h4>
                    </th>
                    <th className="center">
                      <h4>Detalles del Pedido</h4>
                    </th>
                    <th className="center">
                      <h4>Total</h4>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td className="center">
                        <h5>{pedido.nombre_usuario}</h5>
                      </td>
                      <td className="center">
                        <h5>{pedido.fecha_pedido}</h5>
                      </td>
                      <td className="center">
                        <h5>{pedido.estado}</h5>
                      </td>
                      <td className="center">
                        <button className="btn-detalles" onClick={() => mostrarAlertaDet(pedido.id)}>Ver Detalles</button>
                      </td>
                      <td className="center">
                        <h5>${pedido.total}</h5>
                      </td>
                    
                      <td>
                        <img
                          className="img-del"
                          src={require(`./icons/eliminar.png`)}
                          alt=""
                          
                          onClick={() => mostrarAlertaDel(pedido.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Pedidos_Dash;
