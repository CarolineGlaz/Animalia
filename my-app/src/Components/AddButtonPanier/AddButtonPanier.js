import axios from "axios";
import React, { useState } from "react"
import Verify from "../../utils/Verify";

const AddButtonPanier = (props) => {
  const [ajouter, setAjouter] = useState(false);
  const [quantitie, setQuantitie] = useState(1);

  const ajouterElement = (id) => {

    axios.post(`https://127.0.0.1:8000/panier/ajouter/${id}`, {
      quantite: quantitie
    })
      .then(response => {
        console.log('Réponse du serveur:', response.data);
        setAjouter(false)
      })
      .catch(error => {
        console.error('Erreur:', error);
      })
  }

  const setAndVerifyQuantitie = (value) => {
    const number = Verify.convertToPositiveNumber(value);
    setQuantitie(number);
  }

  return(
    <div>
      {ajouter ?
        <div>
          <input
            name="quantities"
            type="number"
            value={quantitie}
            onChange={(event) => setAndVerifyQuantitie(event.target.value)}
          />
          <button onClick={() => ajouterElement(props.id)}>Ajouter</button>
        </div>
        : <button onClick={() => setAjouter(true)}>Ajouter au Panier</button>
      }
    </div>
  )
}

export default AddButtonPanier