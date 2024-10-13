import React, { useContext, useEffect, useState } from 'react'
import './Panier.css'
import axios from 'axios'
import Verify from '../../utils/Verify'
import Format from '../../utils/Format'
import { SessionContext } from '../SessionContext'

const Panier = () => {
  const [panier, setPanier] = useState([])
  const [needToLoad, setNeedToLoad] = useState(false)
  const { session } = useContext(SessionContext)

  useEffect(() => {
    if(!session.isLogged){
      const localPanier = JSON.parse(localStorage.getItem('panier')) || [];
      setPanier(localPanier)
      return;
    }

    setNeedToLoad(false)
    axios.get(`${process.env.REACT_APP_API_URL}/panier/get`)
      .then((res => {
        let json = res.data
        setPanier(json)
      }))
      .catch((error) => {
        console.error(error)
      })
  }, [needToLoad, session])

  return (
    <div>
      <br />
      {
        panier && (panier.length !== 0) ? <ListPanier panier={panier} load={setNeedToLoad} setPanier={setPanier} />
          : <h3>Aucun produit dans le panier</h3>
      }
      <br />
    </div>
  )
}



const ListPanier = (props) => {
  const [quantities, setQuantities] = useState({})
  const [total, setTotal] = useState(0)
  const { session } = useContext(SessionContext)

  useEffect(() => {
    props.panier.forEach(element => {
      handleQuantityChange(element.id, element.quantite)
    })
  }, [props.panier])

  useEffect(() => {
    let total = props.panier.map((element) => {
      const quantity = quantities[element.id] || 0
      return quantity * element.produit.prix
    })
      .reduce((acc, value) => {
        return acc + value
      }, 0)
    setTotal(total.toFixed(2))
    // console.log(quantities)
  }, [quantities, props.panier])

  const handleQuantityChange = (id, value) => {
    const number = Verify.convertToPositiveNumber(value)

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: number
    }))
  }


  const putElement = (id, blur) => {
    if (!id || !quantities[id])
      return

    if(!session.isLogged){
      if(quantities[id] == 0){
        deleteElement(id, blur)
        return;
      }

      const localPanier = JSON.parse(localStorage.getItem('panier')) || [];

      localPanier.forEach((element) => {
        if(element.id === id)
          element.quantite = parseInt(quantities[id], 10);
      });
      localStorage.setItem('panier', JSON.stringify(localPanier));
      props.load(true)
      return;
    }

    blur(true)
    axios.put(`${process.env.REACT_APP_API_URL}/panier/modifier/${id}`, {
      quantite: quantities[id],
    })
      .then(response => {
        if (quantities[id] === '0') {
          props.setPanier(props.panier.filter(element => element.id !== id))
        }

        //console.log('Réponse du serveur:', response.data)
      })
      .catch(error => {
        console.error('Erreur:', error)
      })
      .finally(() => {
        blur(false)
        props.load(true)
      })
  }


  const deleteElement = (id, blur) => {
    
    if(!session.isLogged){
      const localPanier = JSON.parse(localStorage.getItem('panier')) || [];
      const newLocalPanier = localPanier.filter(element => element.id !== id);
      props.setPanier(props.panier.filter(element => element.id !== id))
      localStorage.setItem('panier', JSON.stringify(newLocalPanier));
      props.load(true);
      return;
    }


    blur(true)
    axios.delete(`${process.env.REACT_APP_API_URL}/panier/supprimer/${id}`)
      .then(response => {
        //console.log('Réponse du serveur:', response.data)
        props.setPanier(props.panier.filter(element => element.id !== id))
      })
      .catch(error => {
        console.error('Erreur:', error)
      })
      .finally(() => {
        props.load(true)
        blur(false)
      })
  }

  return (
    <div className="cart-container">
      {
        props.panier.map((element) => (
          <PanierItem key={element.id} element={element} delete={deleteElement} put={putElement} quantities={quantities} handlechange={handleQuantityChange} />
        ))
      }
      <p className="cart-total">Total : {total} €</p>
    </div>
  )
}


const PanierItem = (props) => {
  const [blur, setBlur] = useState(false)
  
  return (
    <div key={props.element.id} className={`cart-item ${blur && 'blur'}`}>
      <img className="cart-item-img" src={props.element.produit.img} alt={props.element.produit.nom} />
      <div className="cart-item-details">
        <a  className="cart-item-name," 
            href={`/produit/${Format.formatStringForURL((props.element.produit.nom))}/${props.element.produit.id}`}>{props.element.produit.nom}</a>
        <p className="cart-item-price">{props.element.produit.prix}€</p>
      </div>
      <input
        className="cart-item-quantity"
        name="quantities"
        type="number"
        value={props.quantities[props.element.id] || ''}
        onChange={(event) => props.handlechange(props.element.id, event.target.value)}
      />
      <div className="cart-item-buttons">
        <button className="btn-update" onClick={() => props.put(props.element.id, setBlur)}>Mettre à jour</button>
        <button className="btn-delete" onClick={() => props.delete(props.element.id, setBlur)}>Supprimer</button>
      </div>
    </div>
  )


}

export default Panier
