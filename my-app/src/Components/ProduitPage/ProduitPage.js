import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios"
import ImageListe from '../ImageListe/ImageListe';

const ProduitPage = () => {
  const { nom, id } = useParams();
  const [produit, setProduit] = useState(null);
  const [erreur, setErreur] = useState(null)


  useEffect(() => {
    axios.get(`https://127.0.0.1:8000/produit/data/${id}`).then((res => {
      let json = res.data
      setProduit(json.produit)
    })).catch((e) => {
      if (e.response && e.response.data && e.response.data.message) {
        setErreur(e.response.data.message);
      } else {
        setErreur("Erreur lors du chargement du produit.");
      }
    })

  }, [id])

  if (erreur) return <p>{erreur}</p>
  if (!produit) return <p>Chargement du produit...</p>

  return (
    <div>
      <h1>Détails du produit</h1>
      <p>Nom du produit : {produit.nom}</p>

      <img src={produit.img} alt={produit.nom} />

      <p>{produit.descritpion}</p>
      <p>Prix : {produit.prix}€</p>

      <ImageListe id={id} />
    </div>
  );
};

export default ProduitPage;
