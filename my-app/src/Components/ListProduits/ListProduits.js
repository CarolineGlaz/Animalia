import React, { useState, useEffect } from "react";
import axios from 'axios';
import './ListProduits.css';
import ProduitCard from "../ProduitCard/ProduitCard";

const Index = () => {
  const [produits, setproduits] = useState([]);

  useEffect(() => {
    axios.get('https://127.0.0.1:8000/')
      .then(res => {
        let json = res.data
        setproduits(json.produits);
      })
  }, []);

  return (
    <div>
      <h2>Liste des produits</h2>
      <ul>
        {produits.length > 0 ? (
          produits.map(produit => (
            <li key={produit.id}>
              <ProduitCard produit={produit} />
            </li>
          ))
        ) : (
          <li>Aucun produit trouvé</li>
        )}
      </ul>
    </div>
  );
}

export default Index;