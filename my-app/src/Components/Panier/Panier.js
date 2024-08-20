import React, { useEffect, useState } from 'react'
import './Panier.css'
import { Axios } from 'axios'

const exempleListProduit = [
  { id: 4, nom: "Truc" },
  { id: 3, nom: "Bidule" },
  { id: 10, nom: "Chouette" }
]



const Panier = () => {
  const [produits, setProduits] = useState(exempleListProduit)
  // const [chargement, setChargement] = useState(true)
  // const [erreur, setErreur] = useState(null)

  return (
    <div>
      <h1>Panier</h1>
      {
        produits ? <ListPanier produits={produits} />
          : <p>Aucun produit dans le panier</p>
      }

    </div>
  )
}



const ListPanier = (props) => {
  return ( 
    <div id="list-panier">
      {
        props.produits.map((produit) => (
          <div key={produit.id}>
            <p>{produit.nom}</p>
          </div>
        ))
      }
    </div>
  )
}


export default Panier
