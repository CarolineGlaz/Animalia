import React, { useEffect, useState } from 'react'
import './Panier.css'
import axios from 'axios'
import Verify from '../../utils/Verify'

const Panier = () => {
  const [panier, setPanier] = useState([])
  const [needToLoad, setNeedToLoad] = useState(false)

  useEffect(() => {
    setNeedToLoad(false)
    axios.get(`https://127.0.0.1:8000/panier/get`)
      .then((res => {
        let json = res.data
        setPanier(json)
      }))
      .catch((error) => {
        console.error(error);
      })
  }, [needToLoad])

  return (
    <div>
      <h1>Panier</h1>
      {
        panier ? <ListPanier panier={panier} load={setNeedToLoad} />
          : <p>Aucun produit dans le panier</p>
      }

    </div>
  )
}



const ListPanier = (props) => {
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    props.panier.forEach(element => {
      handleQuantityChange(element.id, element.quantite);
    });
  }, [props.panier])

  useEffect(() => {
    setTotal(props.panier.map((element) => {
      const quantity = quantities[element.id] || 0;
      return quantity * element.produit.prix
    })
      .reduce((acc, value) => {
        return acc + value;
      }, 0)
    )
  }, [quantities, props.panier])

  const handleQuantityChange = (id, value) => {
    const number = Verify.convertToPositiveNumber(value);

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: number
    }));
  };


  const putElement = (id) => {
    if (!id || !quantities[id])
      return;

    axios.put(`https://127.0.0.1:8000/panier/modifier/${id}`, {
      quantite: quantities[id],
    })
      .then(response => {
        console.log('Réponse du serveur:', response.data);
      })
      .catch(error => {
        console.error('Erreur:', error);
      })
      .finally(
        props.load(true)
      )

  }

  const deleteElement = (id) => {
    axios.delete(`https://127.0.0.1:8000/panier/supprimer/${id}`)
      .then(response => {
        console.log('Réponse du serveur:', response.data);

      })
      .catch(error => {
        console.error('Erreur:', error);
      })
      .finally(
        props.load(true)
      )
  }

  return (
    <div id="list-panier">
      {
        props.panier.map((element) => (
          <div key={element.id}>
            <img src={element.produit.img} alt={element.produit.nom} />
            <p>{element.produit.nom}</p>
            <p>{element.produit.prix}€</p>
            <input
              name="quantities"
              type="number"
              value={quantities[element.id] || ''}
              onChange={(event) => handleQuantityChange(element.id, event.target.value)}
            />
            <button onClick={() => putElement(element.id)}>Mettre à jour</button>
            <button onClick={() => deleteElement(element.id)}>Supprimer</button>
          </div>
        ))
      }
      <p id='prix-total'>Total : {total} €</p>
    </div>
  );
}

export default Panier
