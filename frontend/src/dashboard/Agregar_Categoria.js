import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Categorias_Dash.css";
import SideBar_Dash from "./SideBar_Dash";
import Header_Dash from "./Header_Dash";
import Footer from "../components/Footer";
import swal from "sweetalert";

function Agregar_Categoria() {
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
  const navegacion = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nombre.trim() === "") {
      mostrarAlerta("Error", "Por favor, rellene el campo del nombre de la categoría", "error");
      return;
    }

    axios
      .post("http://localhost:8081/addcategorias", { nombre })
      .then((response) => {
        console.log("Categoría agregada correctamente");
        navegacion("/Dashboard/Categorias"); // Redirigir
        setNombre(""); // Limpiar el campo de entrada
      })
      .catch((error) => {
        console.error("Error al agregar la categoría:", error);
      });
  };

  const handleChange = (e) => {
    setNombre(e.target.value);
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
                Agregar Categorías
              </h1>
            </div>
            <div className="cat-nombres">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Nombre de la categoría"
                  value={nombre}
                  onChange={handleChange}
                  required
                />
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

export default Agregar_Categoria;
