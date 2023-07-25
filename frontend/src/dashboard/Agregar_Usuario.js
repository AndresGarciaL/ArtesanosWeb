import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Categorias_Dash.css";
import SideBar_Dash from "./SideBar_Dash";
import Header_Dash from "./Header_Dash";
import Footer from "../components/Footer";
import swal from "sweetalert";

function Agregar_Usuario() {
  const mostrarAlerta = (title, text, icon) => {
    swal({
      title,
      text,
      icon,
      button: "Aceptar",
      timer: 5000,
    });
  };

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [direccion, setDireccion] = useState("");
  const [rolId, setRolId] = useState("");
  const [roles, setRoles] = useState([]);
  const navegacion = useNavigate();
  const [formError, setFormError] = useState("");

  useEffect(() => {
    // Obtener las categorías de la base de datos al cargar el componente
    axios
      .get("http://localhost:8081/roles")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los roles:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for empty required fields
    if (!nombre || !apellidos || !email || !contrasena || !direccion || !rolId ) {
      mostrarAlerta("Error", "Por favor, rellene todos los campos del formulario", "error");
    } else {
      axios
        .post("http://localhost:8081/addusuarios", {
          nombre,
          apellidos,
          email,
          contrasena,
          direccion,
          rol_id: rolId, // Assign the selected role ID to the user
       
        })
        .then((response) => {
          console.log("Usuario agregado correctamente");
          navegacion("/Dashboard/Usuarios"); // Redirigir
          limpiarFormulario(); // Restablecer los valores del formulario
          mostrarAlerta('Éxito', 'Se agregó correctamente el Usuario .', 'success', 3000);
        })
        .catch((error) => {
          console.error("Error al agregar el usuario:", error);
        });
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "nombre") {
      setNombre(e.target.value);
    } else if (e.target.name === "apellidos") {
      setApellidos(e.target.value);
    } else if (e.target.name === "email") {
      setEmail(e.target.value);
    } else if (e.target.name === "contrasena") {
      setContrasena(e.target.value);
    } else if (e.target.name === "direccion") {
      setDireccion(e.target.value);
    } else if (e.target.name === "rolId") {
      setRolId(e.target.value);
    } 
  };

  const limpiarFormulario = () => {
    setNombre("");
    setApellidos("");
    setEmail("");
    setContrasena("");
    setDireccion("");
    setRolId("");
  };

  return (
    <>
      <Header_Dash />
      <div className="dashboard-container">
        <SideBar_Dash />
        <div className="container-cat">
          <div className="separator">
            <h1></h1>
          </div>
          <section className="dash-cat">
            <div className="title-cat-dash">
              <h1 style={{ fontSize: "24px", textAlign: "center" }}>
                Agregar Usuario
              </h1>
            </div>
            <div className="cat-nombres">
              <form onSubmit={handleSubmit}>
                {formError && <p className="error-message">{formError}</p>}
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre del Usuario"
                  value={nombre}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="apellidos"
                  placeholder="Apellidos del Usuario"
                  value={apellidos}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="contrasena"
                  placeholder="Contraseña"
                  value={contrasena}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección del Usuario"
                  value={direccion}
                  onChange={handleChange}
                />
                <select
                  name="rolId"
                  id="rolId"
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
               
                <button
                  type="submit"
                  style={{
                    display: "block",
                    margin: "20px auto",
                    fontSize: "18px",
                  }}
                >
                  Agregar
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Agregar_Usuario;
