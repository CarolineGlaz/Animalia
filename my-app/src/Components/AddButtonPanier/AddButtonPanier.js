import axios from "axios";
import React, { useContext, useState } from "react"
import Verify from "../../utils/Verify"
import "./AddButtonPanier.css"
import { SessionContext } from "../SessionContext";

const AddButtonPanier = (props) => {
  const [ajouter, setAjouter] = useState(false);
  const [quantitie, setQuantitie] = useState(1);
  const { session } = useContext(SessionContext)

  const localAjouterElement  = (id) => {
    const localPanier = JSON.parse(localStorage.getItem('panier')) || [];
    let exist = false;
    localPanier.forEach(element => {
      if(element.idProduit && element.idProduit === props.produit.id) {
        exist = true;
        element.quantite += quantitie;
      }
    });
    if(!exist) {
      let obj = {
        id: (localPanier.length +1),
        idUtilisateur: -1,
        idProduit: props.produit.id,
        produit: props.produit,
        quantite: quantitie,
      }
      localPanier.push(obj);
    }
    localStorage.setItem('panier', JSON.stringify(localPanier));
    setAjouter(false)
  }

  const ajouterElement = (id) => {
    if(session.isLogged)
      onlineAjouterElement(id);
    else
      localAjouterElement(id);
  }  

  const onlineAjouterElement = (id) => {
    props.setBlur(true)
    axios.post(`${process.env.REACT_APP_API_URL}/panier/ajouter/${id}`, {
      quantite: quantitie
    })
      .then(response => {
        setAjouter(false)
      })
      .catch(error => {
        console.error('Erreur:', error)
      })
      .finally(() => props.setBlur(false))
  }

  const setAndVerifyQuantitie = (value) => {
    const number = Verify.convertToPositiveNumber(value)
    setQuantitie(parseInt(number, 10))
  }

  return (
    <div>
      {ajouter ?
        <div>
          <input
            name="quantities"
            type="number"
            value={quantitie}
            onChange={(event) => setAndVerifyQuantitie(event.target.value)}
          />
          <button className="ajouter-panier" onClick={() => ajouterElement(props.id)}>Ajouter</button>
        </div>
        : <button className="boutton-panier" onClick={() => setAjouter(true)}>Ajouter au Panier</button>
      }
    </div>
  )
}

export default AddButtonPanier