//1.
import React from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import "../styles/Conocenos.css";

//2.
function Conocenos() {
    //3.
    return (
        <>
            <Header />
            <Breadcrumb currentPage="Conocenos" />
            <h2 className="tituloh2">¿Quiénes somos?</h2>
            <div class="left">
                <img id="img-conocenos" src={require("../images/img-contacto/conocenos.png")} alt="Imagen Conócenos" />
                <div class="parrafos">
                    <p class="parrafo1">Somos un sitio web que apoya y promueve la artesanía, un espacio donde difundimos los productos e historias de artesanos, artistas y diseñadores.</p>
                    <p class="parrafo1">Entendemos cómo, dónde y quién hace lo que compramos.
                        Además, al comprar a un artesano impulsa la economía local y como consumidor, conoces específicamente a aquellos
                        que se benefician de esta compra.</p>
                </div>
            </div>

            <p class="parrafo4">Queremos cambiar la cultura del consumo y al mismo tiempo apoyar la cultura corporativa con una
                cadena de
                valor
                donde todos ganemos. Queremos celebrar la artesanía, el uso de materiales sostenibles y elogiar la creatividad
                de quienes promueven una economía circular</p>

            <div className="imgs3">
                <div className="artesanos">
                    <img className="fotos"
                        src={require("../images/img-contacto/hecho-a-mano.png")} />
                    <h3 className="preguntas">Solo hecho a mano</h3>
                </div>
                <div className="artesanos">
                    <img className="fotos" src={require("../images/img-contacto/sostenible.png")} />
                    <h3 className="preguntas">Cadena de valor sostenible</h3>
                </div>
                <div className="artesanos">
                    <img className="fotos"
                        src={require("../images/img-contacto/historias.png")} />
                    <h3 className="preguntas">Historias</h3>
                </div>
            </div>

            <h2 className="tituloh2">Nuestro trabajo</h2>
            <img id="ODS"
                src={require("../images/img-contacto/conocenos/ODS.png")} />
            <p class="parrafo4">Desde Valéxico estamos aportando nuestro granito de arena para conseguir estos objetivos. Con
                el trabajo que se
                realiza desde nuestra zanja, ayudamos con los objetivos #1: Acabar con la pobreza, #8: Trabajo decente y
                crecimiento económico y económico #12: Producción y consumo responsables.</p>
            <div class="imgs2">
                <img
                    src={require("../images/img-contacto/conocenos/pobreza.png")} id="pobreza" />
                <img
                    src={require("../images/img-contacto/conocenos/trabajo.png")} id="trabajo" />
                <img
                    src={require("../images/img-contacto/conocenos/produccion.png")} id="produccion" />
            </div>
            <Footer />
        </>
    );
}

//4.
export default Conocenos; 