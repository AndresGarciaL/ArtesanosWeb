import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import Artesanos from "./pages/Artesanos";
import Conocenos from "./pages/Conocenos";
import Contacto from "./pages/Contacto";
import Shop from "./pages/Shop";
import Tienda from "./pages/Tienda";
import Categorias from "./pages/Categorias";
import Carrito from "./pages/Carrito";
import Dashboard from "./dashboard/Dashboard";
import Categorias_Dash from "./dashboard/Categorias_Dash";
import Agregar_Categoria from "./dashboard/Agregar_Categoria";
import Productos_Dash from "./dashboard/Productos_Dash";
import PrivateRoute from "./components/PrivateRoute";
import Agregar_Producto from "./dashboard/Agregar_Producto";
import Compra from "./pages/Compra";
import Usuarios_Dash from "./dashboard/Usuarios_Dash";
import Agregar_Usuario from "./dashboard/Agregar_Usuario";
import Pedidos_Dash from "./dashboard/Pedidos_Dash";
import Finalizacion from "./dashboard/Finalizacion";



function App() {
  return (
    
      <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          
          <Route path="/Artesanos" element={<Artesanos />} />
          <Route path="/Conocenos" element={<Conocenos />} />
          <Route path="/Contacto" element={<Contacto />} />
          <Route path="/Shop" element={<Shop />} />
          <Route path="/Tienda" element={<Tienda />} />
          <Route path="/categorias/:id" element={<Categorias />} />
          <Route path="/Carrito" element={<Carrito />} />
          <Route path="/Compra" element={<Compra />} />
          <Route path="/Finalizacion" element={<Finalizacion />} />

            <Route path="/Artesanos" element={<Artesanos />} />
            <Route path="/Conocenos" element={<Conocenos />} />
            <Route path="/Contacto" element={<Contacto />} />
            <Route path="/Shop" element={<Shop />} />
            <Route path="/Tienda" element={<Tienda />} />
            <Route path="/categorias/:id" element={<Categorias />} />
            <Route path="/Carrito" element={<Carrito />} />

            <Route element={<PrivateRoute roles={[1]}/>}>
            <Route path="/Dashboard" element={<Dashboard/>}/>
          </Route>

          <Route element={<PrivateRoute roles={[1]}/>}>
            <Route path="/Dashboard/Categorias" element={<Categorias_Dash />}/>
          </Route>

          <Route element={<PrivateRoute roles={[1]}/>}>
            <Route path="/Dashboard/AgregarCategoria" element={<Agregar_Categoria />}/>
          </Route>
           
          <Route element={<PrivateRoute roles={[1]}/>}>
            <Route path="/Dashboard/Productos" element={<Productos_Dash/>}/>
          </Route>

          <Route element={<PrivateRoute roles={[1]}/>}>
            <Route path="/Dashboard/AgregarProducto" element={<Agregar_Producto/>}/>
          </Route>

          <Route element={<PrivateRoute roles={[1]}/>}>
            <Route path="/Dashboard/Usuarios" element={<Usuarios_Dash/>}/>
          </Route>
          
          <Route element={<PrivateRoute roles={[1]}/>}>
            <Route path="/Dashboard/AgregarUsuario" element={<Agregar_Usuario/>}/>
          </Route>

          <Route element={<PrivateRoute roles={[1]}/>}>
            <Route path="/Dashboard/Pedidos" element={<Pedidos_Dash/>}/>
          </Route>


          </Routes>
        </Router>
      
   
  );
}

export default App;
