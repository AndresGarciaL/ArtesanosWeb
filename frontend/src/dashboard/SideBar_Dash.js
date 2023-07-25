import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/SideBar_Dash.css";

function SideBar_Dash() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <>
      {sidebarVisible && (
        <aside className="sidebar">
          <nav className="sidebar-menu">
            <ul className="menu-items">
              <li className="menu-item">
                <Link to="/Dashboard">
                  <h2 className="sidebar-title">
                  <img
                    className="img"
                    src={require(`./icons/casa.png`)}
                    alt=""
                  />
                    DASHBOARD</h2>
                </Link>
              </li>
            </ul>
            <ul className="menu-items">
              <li className="menu-item dropdown">
                <Link to="/Dashboard/Categorias">
                  <img
                    className="img"
                    src={require(`./icons/categorias.png`)}
                    alt=""
                  />
                  CATEGORIAS
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/Dashboard/Productos">
                  <img
                    className="img"
                    src={require(`./icons/producto.png`)}
                    alt=""
                  />
                  PRODUCTOS
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/Dashboard/Pedidos">
                <img
                    className="img"
                    src={require(`./icons/pedidos.png`)}
                    alt=""
                  />
                  PEDIDOS</Link>
              </li>
              <li className="menu-item">
              <Link to="/Dashboard/Usuarios">
                  <img
                    className="img"
                    src={require(`./icons/user.png`)}
                    alt=""
                  />
                  USUARIOS
                </Link>
              </li>
            </ul>
          </nav>
          <button onClick={toggleSidebar}>Ocultar SideBar</button>
        </aside>
      )}

      {!sidebarVisible && (
        <div className="sidebar-tab" onClick={toggleSidebar}>
          <span>&gt;</span>
        </div>
      )}
    </>
  );
}

export default SideBar_Dash;
