import React from 'react';

const ProductList = ({ produits, edit, onDelete }) => (
  <ul>
    {produits.map(produit => (
      <li key={produit.id}>
        {produit.nom} {produit.description} {produit.categorie} {produit.prix}
        <br />
        <button onClick={() => edit(produit)}>Modifier</button>
        <button onClick={() => onDelete(produit.id)}>Supprimer</button>
      </li>
    ))}
  </ul>
);

export default ProductList;
