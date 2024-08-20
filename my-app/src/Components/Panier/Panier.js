import React, { useEffect, useState } from 'react'
import './Panier.css'
import axios from 'axios'

const Panier = () => {
  const [panier, setPanier] = useState([])

  useEffect(() => {
    axios.get(`https://127.0.0.1:8000/panier/get`)
      .then((res => {
        let json = res.data
        setPanier(json)
      }))
      .catch((error) => {
        console.error(error);
      })
  }, [])

  return (
    <div>
      <h1>Panier</h1>
      {
        panier ? <ListPanier panier={panier} />
          : <p>Aucun produit dans le panier</p>
      }

    </div>
  )
}



const ListPanier = (props) => {
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);

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
    let number = isNaN(value) ?
      value.replace(/\D/g, '')
      : value
    number = number < 0 ? '0' : number

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: number
    }));
  };


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
            <button onClick={() => putElement()}>Mettre à jour</button>
            <button onClick={() => deleteElement()}>Supprimer</button>
          </div>
        ))
      }
      <p id='prix-total'>Total : {total} €</p>
    </div>
  );
}

const putElement = () => {
}

const deleteElement = () => {
}


export default Panier
