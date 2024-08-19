import React, { useEffect, useState } from "react"

const ProduitCard = (props) => {
  const produit = props.produit;
  const MAX_CHAR = 128;

  const maxDisplayDescription = (str) => {
    if (str.length > MAX_CHAR) {
      return str.substring(0, MAX_CHAR) + '...';
    } else {
      return str;
    }
  }

  const formatStringForURL = (str) => {
    let formattedStr = str.toLowerCase();
    formattedStr = formattedStr.replace(/\s+/g, '-');
    formattedStr = formattedStr.replace(/[^a-z0-9-_]/g, '');
    formattedStr = formattedStr.replace(/-{2,}/g, '-');

    return formattedStr;
  }

  if (!produit) return <div id="error-produit">Produit not found</div>

  return (
    <div id={`produit-${produit.id}`}>
      <label>{produit.nom}</label>
      <p>{maxDisplayDescription(produit.description)}</p>
      <img src={produit.img} alt={produit.nom} />
      <label>Prix : {produit.prix}€</label>
      <button>Ajouter au Panier</button>
      <a href={`/produit/${formatStringForURL(produit.nom)}/${produit.id}`}>Acceder à la fiche du produit</a>
    </div>
  );

}

export default ProduitCard;