
import react from "react";
import "../styles/BurgerButton.css";
import { Link } from "react-router-dom";

function BurgerButton(props){
return(
<div onClick={props.handleClick} className={`icon nav-icon-5 ${props.clicked ? 'open' : ""}`}>
<span></span>
<span></span>
<span></span>
</div>
);
}

export default BurgerButton;


