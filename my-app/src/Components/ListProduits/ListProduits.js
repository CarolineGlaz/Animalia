import React, { useState, useEffect } from "react"
import axios from 'axios'
import './ListProduits.css'
import ProduitCard from "../ProduitCard/ProduitCard"
import PageSelector from "../PageSelector/PageSelector"
import Commentaire from "../Commentaire/Commentaire"

const Index = () => {
  const [produits, setproduits] = useState([])
  const [maxPage, setMaxPage] = useState(0)
  const [page, setPage] = useState(1)
  const [blur, setBlur] = useState(false)

  const SIZE = 4

  useEffect(() => {
    setBlur(true)
    axios.get(`${process.env.REACT_APP_API_URL}/`, {
      params: {
        start: (page - 1) * SIZE,
        size: SIZE
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
  }, [page])

  return (
    <div className={`${blur && 'blur'}`}>
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
      <div style={{ padding: 20 + 'px', }}></div>
    </div>
  )
}

export default Index