import React, { useState, useEffect } from "react";
import "../styles/LoginButton.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function LoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navegacion = useNavigate();

  useEffect(() => {
    // Verificar si hay un usuario logueado en el localStorage al cargar el componente
    const usuarioLogueado = localStorage.getItem('usuario') !== null;
    setIsLoggedIn(usuarioLogueado);
  }, []);

  const salir = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navegacion('/');
  }

  return (
    <div className="dropdown">
      <img
        src={require("../images/icons/usuario.png")}
        alt=""
        onClick={() => setIsLoggedIn(isLoggedIn)}
      />
      {isLoggedIn && (
        <div className="dropdown-content">
          <button className="dropdown-content" onClick={salir}>Cerrar Sesion</button>
        </div>
      )}
      {!isLoggedIn && (
        <div className="dropdown-content">
          <Link to={'/Login/'}>Iniciar sesión</Link>
          <Link to={'/Register/'}>Registrarse</Link>
        </div>
      )}
    </div>
  );
}

export default LoginButton;
