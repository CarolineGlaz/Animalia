import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios"
import ImageListe from '../ImageListe/ImageListe'
import AddButtonPanier from '../AddButtonPanier/AddButtonPanier'
import './ProduitPage.css'

const ProduitPage = () => {
  const { nom, id } = useParams()
  const [produit, setProduit] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [blur, setBlur] = useState(false)


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/produit/data/${id}`).then((res => {
      let json = res.data
      setProduit(json.produit)
    })).catch((e) => {
      if (e.response && e.response.data && e.response.data.message) {
        setErreur(e.response.data.message)
      } else {
        setErreur("Erreur lors du chargement du produit.")
      }
    })

  }, [id])

  if (erreur) return <p>{erreur}</p>
  if (!produit) return <p>Chargement du produit...</p>

  return (
    <div className={`product-page ${blur && 'blur'}`}>
      <div className="product-container">
        <img className="product-img" src={produit.img} alt={produit.nom} />
        <div className="product-info">
          <p className="product-name">{produit.nom}</p>
          <p className="product-description">{produit.description}</p>
          <p className="product-price">Prix : {produit.prix}€</p>
          <div className="product-actions">
            <ImageListe id={id} setParentImageData={(e) => {}} className="btn-view-images" />
            {/* <AddButtonPanier id={produit.id} className="btn-add-to-cart" setBlur={setBlur}/> */}
            <AddButtonPanier produit={props.produit} id={produit.id} className="btn-add-to-cart" setBlur={setBlur} />
          </div>
        </div>
      </div>
    </div>
  )


}

export default ProduitPage;
