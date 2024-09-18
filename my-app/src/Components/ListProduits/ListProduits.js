import React, { useState, useEffect } from "react"
import axios from 'axios'
import './ListProduits.css'
import ProduitCard from "../ProduitCard/ProduitCard"
import PageSelector from "../PageSelector/PageSelector"
import Commentaire from "../Commentaire/Commentaire"
import CardAnimals from '../CardAnimals/CardAnimals'


const Index = () => {
  const [produits, setproduits] = useState([])
  const [maxPage, setMaxPage] = useState(0)
  const [page, setPage] = useState(1)
  const [blur, setBlur] = useState(false)
  const [categorie, setCategorie] = useState("")

  const SIZE = 4

  useEffect(() => {
    setBlur(true)
    axios.get(`${process.env.REACT_APP_API_URL}/`, {
      params: {
        start: page * SIZE - SIZE,
        size: SIZE,
        categorie: categorie,
      }
    })
      .then(res => {
        let json = res.data
        setproduits(json.produits)
        const maxPageNumber = (json.countElement + SIZE - 1) / SIZE
        setMaxPage(parseInt(maxPageNumber))
      })
      .finally(() => {
        setBlur(false)
      })
  }, [page, categorie])

  const handleCategorieChange = (event) => {
    setCategorie(event.target.value)
    setPage(1) // Réinitialiser la page lorsque la catégorie change
  }

  return (
    <div className={`${blur && 'blur'}`}>
      <div className="filter">
        <button 
          className={`filter-button ${categorie === '' ? 'active' : ''}`} 
          onClick={() => handleCategorieChange({ target: { value: '' } })}>
          Tous
        </button>
        <button 
          className={`filter-button ${categorie === 'CHAT' ? 'active' : ''}`} 
          onClick={() => handleCategorieChange({ target: { value: 'CHAT' } })}>
          Chat
        </button>
        <button 
          className={`filter-button ${categorie === 'RONGEUR' ? 'active' : ''}`} 
          onClick={() => handleCategorieChange({ target: { value: 'RONGEUR' } })}>
          Rongeur
        </button>
      </div>
      <div className="produit-grid">
        {produits.length > 0 ? (
          produits.map(produit => (
            <ProduitCard key={produit.id} produit={produit} />
          ))
        ) : (
          <div>Aucun produit trouvé</div>
        )}
      </div>
      <PageSelector max={maxPage} page={page} setPage={setPage} />
      <br />
      <Commentaire />
      <CardAnimals />
    </div>
  )
}

export default Index