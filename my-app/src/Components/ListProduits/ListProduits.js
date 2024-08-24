import React, { useState, useEffect } from "react"
import axios from 'axios'
import './ListProduits.css'
import ProduitCard from "../ProduitCard/ProduitCard"
import PageSelector from "../PageSelector/PageSelector"

const Index = () => {
  const [produits, setproduits] = useState([])
  const [maxPage, setMaxPage] = useState(0)
  const [page, setPage] = useState(1)

  const SIZE = 1

  useEffect(() => {
    axios.get('https://127.0.0.1:8000/', {
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
  }, [page])

  return (
    <div>
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
    </div>
  )
}

export default Index