import React, { useState } from "react"
import AddButtonPanier from "../AddButtonPanier/AddButtonPanier";
import './ProduitCard.css'
import Format from "../../utils/Format";

const ProduitCard = (props) => {
  const [blur, setBlur] = useState(false)

  const produit = props.produit;
  const MAX_CHAR = 128;

  const maxDisplayDescription = (str) => {
    if (str.length > MAX_CHAR) {
      return str.substring(0, MAX_CHAR) + '...';
    } else {
      return str;
    }
  }

  if (!produit) return <div id="error-produit">Produit not found</div>


  return (
    <div className={`produit-card ${blur && 'blur'}`} id={`produit-${produit.id}`}>
      <div className="image-card">
        <img className="produit-image" src={produit.img} alt={produit.nom} />
      </div>
      <label className="produit-nom">{produit.nom}</label>
      <p className="produit-description">{maxDisplayDescription(produit.description)}</p>
      <label className="produit-prix">Prix : {produit.prix}€</label>
      <AddButtonPanier produit={props.produit} id={produit.id} setBlur={setBlur} />
      <a className="produit-lien" href={`/produit/${Format.formatStringForURL((produit.nom))}/${produit.id}`}>Accéder à la fiche du produit</a>
    </div>
  )



}

export default ProduitCard;