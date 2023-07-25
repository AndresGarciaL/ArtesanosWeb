import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Categorias_Dash.css';
import SideBar_Dash from './SideBar_Dash';
import Header_Dash from './Header_Dash';
import Footer from '../components/Footer';
import swal from 'sweetalert';

function Agregar_Producto() {
  const mostrarAlerta = (title, text, icon, timer) => {
    swal({ title, text, icon, button: 'Aceptar', timer });
  };

  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null); // Use null for image state
  const [formSubmitted, setFormSubmitted] = useState(false); // Track form submission

  const navegacion = useNavigate();

  useEffect(() => {
    // Obtener las categorías de la base de datos al cargar el componente
    axios
      .get('http://localhost:8081/categorias')
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form fields
    if (!nombre || !descripcion || !precio || !stock || !categoria || !image) {
      mostrarAlerta('Error', 'Complete todos los campos del formulario.', 'error', 3000);
      return;
    }

    try {
      // Create a new FormData object to handle image file
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      formData.append('precio', precio);
      formData.append('stock', stock);
      formData.append('categoria', categoria);
      formData.append('image', image); // Append the image file to the FormData object

      // Send the form data to the server with axios
      const response = await axios.post('http://localhost:8081/addproducto', formData);
      mostrarAlerta('Éxito', 'Se agregó el producto correctamente.', 'success', 3000);
      console.log('Producto agregado correctamente');
      limpiarFormulario(); // Restablecer los valores del formulario
      setFormSubmitted(false); // Set formSubmitted to true to show success alert
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      mostrarAlerta('Error', 'Hubo un problema al agregar el producto.', 'error', 3000);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Check if a file was selected
    if (file) {
      setImage(file);
    } else {
      // If no file was selected (e.g., user cancels the selection), reset the image state to null
      setImage(null);
    }
  };
  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setStock('');
    setCategoria('');
    setImage(null); // Set image state to null to remove the selected image
  };

  useEffect(() => {
    if (formSubmitted) {
      mostrarAlerta(
        'Producto Agregado con Éxito',
        '¡Vaya a la pagina de productos para ver los cambios!',
        'success',
        5000
      );
      setFormSubmitted(true); // Reset formSubmitted to false after showing the alert
    }
  }, [formSubmitted]);

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
              <h1 style={{ fontSize: '24px', textAlign: 'center' }}>Agregar Producto</h1>
            </div>
            <div className="cat-nombres">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre del Producto"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                <input
                  type="text"
                  name="descripcion"
                  placeholder="Descripcion Producto"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
                <input
                 min={1}
                 max={50000}
                  type="number"
                  name="precio"
                  placeholder="Precio Producto"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                />
                <input
               min={1}
               max={50000}
                  type="number"
                  readonly
                  name="stock"
                  placeholder="Stock producto"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
                <select name="categoria" id="categoria" onChange={(e) => setCategoria(e.target.value)} required>
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
                <input type="file" name="image" onChange={handleImageChange} accept="image/*" />
                <button
                  type="submit"
                  style={{
                    display: 'block',
                    margin: '20px auto',
                    fontSize: '18px',
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

export default Agregar_Producto;
