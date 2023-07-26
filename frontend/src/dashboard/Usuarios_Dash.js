import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Usuarios_Dash.css";
import { useParams } from "react-router-dom";
import SideBar_Dash from "./SideBar_Dash";
import Header_Dash from "./Header_Dash";
import Footer from "../components/Footer";
import swal from "sweetalert";

function Usuarios_Dash() {
  const { id } = useParams();
  const [usuarios, setUsuarios] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    contrasena: "",
    direccion: "",
    rol_id: "",
    estatus: "",
  });

  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8081/usuarios")
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error);
      });

    // Get the currently logged-in user
    axios
      .get("http://localhost:8081/UsuarioActual")
      .then((response) => {
        setLoggedInUser(response.data.Resultado);
      })
      .catch((error) => {
        console.error("Error al obtener el usuario actual:", error);
      });
  }, [id]);

  const handleDelete = (id) => {
    if (loggedInUser && loggedInUser.id === id) {
      axios.post("http://localhost:8081/logout").then(() => {
        navigate("/login");
      });
    } else {
      axios
        .delete(`http://localhost:8081/delusuario/${id}`)
        .then((response) => {
          setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
        })
        .catch((error) => {
          console.error("Error al eliminar el usuario:", error);
        });
    }
  };

  const handleEditStart = (id, nombre, apellidos, email, contrasena, direccion, rol_id, estatus) => {
    setEditingUserId(id);
    setEditedUserData({
      nombre,
      apellidos,
      email,
      contrasena,
      direccion,
      rol_id,
      estatus,
    });
  };

  const handleEditCancel = () => {
    setEditingUserId(null);
    setEditedUserData({
      nombre: "",
      apellidos: "",
      email: "",
      contrasena: "",
      direccion: "",
      rol_id: "",
      estatus: "",
    });
  };

  const handleEditSave = (id) => {
    const updatedUsuarios = usuarios.map((usuario) => {
      if (usuario.id === id) {
        return {
          ...usuario,
          ...editedUserData,
        };
      }
      return usuario;
    });

    axios
      .put(`http://localhost:8081/editusuario/${id}`, editedUserData)
      .then((response) => {
        setUsuarios(updatedUsuarios);
        setEditingUserId(null);
      })
      .catch((error) => {
        console.error("Error al modificar el usuario:", error);
      });
  };

  const handleKeyDown = (event, id) => {
    if (event.key === "Enter") {
      handleEditSave(id);
    } else if (event.key === "Escape") {
      handleEditCancel();
    }
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
        swal("¡Confirmado!", "Usuario eliminado con éxito", "success");
        handleDelete(id);
      } else {
        swal("Cancelado", "La acción fue cancelada", "error");
      }
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
              <Link to="/Dashboard/AgregarUsuario">
                <button
                  className="btn-agregar"
                  style={{
                    display: "block",
                    margin: "20px auto",
                    fontSize: "18px",
                  }}
                >
                  Agregar
                </button>
              </Link>
              <h1 style={{ fontSize: "24px", textAlign: "center", margin: "auto" }}>Usuarios</h1>
            </div>
            <div className="users-info">
              <table className="table-users">
                <thead>
                  <tr>
                    
                    <th className="center">
                      <h4>Nombre</h4>
                    </th>
                    <th className="center">
                      <h4>Apellidos</h4>
                    </th>
                    <th className="center">
                      <h4>Email</h4>
                    </th>
                    <th className="center">
                      <h4>Dirección</h4>
                    </th>
                    <th className="center">
                      <h4>Rol</h4>
                    </th>
                    <th className="center">
                      <h4>Estatus</h4>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      
                      <td className="center">
                        {editingUserId === usuario.id ? (
                          <input
                            type="text"
                            value={editedUserData.nombre}
                            onChange={(e) => setEditedUserData({ ...editedUserData, nombre: e.target.value })}
                            onKeyDown={(e) => handleKeyDown(e, usuario.id)}
                          />
                        ) : (
                          <h5>{usuario.nombre}</h5>
                        )}
                      </td>
                      <td className="center">
                        {editingUserId === usuario.id ? (
                          <input
                            type="text"
                            value={editedUserData.apellidos}
                            onChange={(e) => setEditedUserData({ ...editedUserData, apellidos: e.target.value })}
                            onKeyDown={(e) => handleKeyDown(e, usuario.id)}
                          />
                        ) : (
                          <h5>{usuario.apellidos}</h5>
                        )}
                      </td>
                      <td className="center">
                        {editingUserId === usuario.id ? (
                          <input
                            type="text"
                            value={editedUserData.email}
                            onChange={(e) => setEditedUserData({ ...editedUserData, email: e.target.value })}
                            onKeyDown={(e) => handleKeyDown(e, usuario.id)}
                          />
                        ) : (
                          <h5>{usuario.email}</h5>
                        )}
                      </td>
                      <td className="center">
                        {editingUserId === usuario.id ? (
                          <input
                            type="text"
                            value={editedUserData.direccion}
                            onChange={(e) => setEditedUserData({ ...editedUserData, direccion: e.target.value })}
                            onKeyDown={(e) => handleKeyDown(e, usuario.id)}
                          />
                        ) : (
                          <h5>{usuario.direccion}</h5>
                        )}
                      </td>
                      <td className="center">
                        {editingUserId === usuario.id ? (
                          <input
                            type="text"
                            value={editedUserData.rol_id}
                            onChange={(e) => setEditedUserData({ ...editedUserData, rol_id: e.target.value })}
                            onKeyDown={(e) => handleKeyDown(e, usuario.id)}
                          />
                        ) : (
                          <h5>{usuario.rol_id}</h5>
                        )}
                      </td>
                      <td className="center">
                        {editingUserId === usuario.id ? (
                          <input
                            type="text"
                            value={editedUserData.estatus}
                            onChange={(e) => setEditedUserData({ ...editedUserData, estatus: e.target.value })}
                            onKeyDown={(e) => handleKeyDown(e, usuario.id)}
                          />
                        ) : (
                          <h5>{usuario.estatus}</h5>
                        )}
                      </td>
                      <td>
                        {editingUserId === usuario.id ? (
                          <>
                            <img
                              className="img-guardar"
                              src={require(`./icons/guardar.png`)}
                              alt=""
                              onClick={() => handleEditSave(usuario.id)}
                            />
                            <img
                              className="img-cancel"
                              src={require(`./icons/cancelar.png`)}
                              alt=""
                              onClick={() => handleEditCancel()}
                            />
                          </>
                        ) : (
                          <img
                            className="img-edit"
                            src={require(`./icons/editar.png`)}
                            alt=""
                            onClick={() =>
                              handleEditStart(
                                usuario.id,
                                usuario.nombre,
                                usuario.apellidos,
                                usuario.email,
                                usuario.contrasena,
                                usuario.direccion,
                                usuario.rol_id,
                                usuario.estatus
                              )
                            }
                          />
                        )}
                      </td>
                      <td>
                        <img
                          className="img-del"
                          src={require(`./icons/eliminar.png`)}
                          alt=""
                          onClick={() => mostrarAlertaDel(usuario.id)}
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

export default Usuarios_Dash;
