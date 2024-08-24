import React, { useEffect, useState } from 'react'
import './Panier.css'
import axios from 'axios'
import Verify from '../../utils/Verify'
import Format from '../../utils/Format'

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
      <br />
      {
        panier ? <ListPanier panier={panier} load={setNeedToLoad} />
          : <p>Aucun produit dans le panier</p>
      }
      <br />
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
    <div className="cart-container">
      {
        props.panier.map((element) => (
          <div key={element.id} className="cart-item">
            <img className="cart-item-img" src={element.produit.img} alt={element.produit.nom} />
            <div className="cart-item-details">
              <a className="cart-item-name," href={`/produit/${Format.formatStringForURL((element.produit.nom))}/${element.produit.id}`}>{element.produit.nom}</a>
              <p className="cart-item-price">{element.produit.prix}€</p>
            </div>
            <input
              className="cart-item-quantity"
              name="quantities"
              type="number"
              value={quantities[element.id] || ''}
              onChange={(event) => handleQuantityChange(element.id, event.target.value)}
            />
            <div className="cart-item-buttons">
              <button className="btn-update" onClick={() => putElement(element.id)}>Mettre à jour</button>
              <button className="btn-delete" onClick={() => deleteElement(element.id)}>Supprimer</button>
            </div>
          </div>
        ))
      }
      <p className="cart-total">Total : {total} €</p>
    </div>
  );
  
}

export default Panier
