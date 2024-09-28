import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PageSelector from '../PageSelector/PageSelector'

const PageAdmin = () => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)

  return (
    <div className='PageAdmin'>
      <h2>Modifier un produit</h2>
      <ProductList></ProductList>
      <h2>Ajouter un produit</h2>
    </div>
  )
}

const ProductList  = () => {
  const [error, setError] = useState(null)
  const [blur, setBlur] = useState(false)
  const [maxPage, setMaxPage] = useState(0)
  const [page, setPage] = useState(1)
  const [produits, setproduits] = useState([])

  const SIZE = 4

  useEffect(() => {
    setBlur(true)
    axios.get(`${process.env.REACT_APP_API_URL}/`, {
      params: {
        start: page * SIZE - SIZE,
        size: SIZE,
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
    <div className='ProductList'>
      { produits.map((produit) => {
       return <Product key={produit.id} produit={produit}/>
      }) }
      <PageSelector max={maxPage} page={page} setPage={setPage} />
    </div>
  )
}

const Product = (props) => {

  const [ProduitData, setProduitData] = useState({
    nom: '',
    description: '',
    categorie: [],
    prix: 0,
    img: ''
  })

  const CATEGORIES = ['AUTRE', 'CHAT', 'OISEAUX', 'NOURRITURE']


  const handleChange = (element) => {
    const { name, value } = element.target;

    const actualValue = name === 'prix' ? Number(value) : value;

    setProduitData(prev => ({ ...prev, [name]: actualValue }))
  }

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;

    setProduitData(prev => ({ ...prev, categorie: [selectedCategory] }));
  };

  useEffect(() => {
    setProduitData(props.produit)
  }, [])

  return (
    <div id={`product-${props.produit.id}`}>
     <form onSubmit={console.log}>
        <input type="text" name="nom" value={ProduitData.nom} onChange={handleChange} placeholder="Nom" required />
        <input type="text" name="description" value={ProduitData.description} onChange={handleChange} placeholder="Description" required />
        
        <select
          name="categorie"
          value={ProduitData.categorie[0] || ''}
          onChange={handleCategoryChange}
          required
        >
          <option value="" disabled>Choisir une catégorie</option>
          {CATEGORIES.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input type="number" name="prix" value={ProduitData.prix} onChange={handleChange} placeholder="Prix" required />
        <input type="text" name="img" value={ProduitData.img} onChange={handleChange} placeholder="URL de l'image" required />
        <button type="submit" className={`${(JSON.stringify(props.produit) === JSON.stringify(ProduitData)) && 'blur'}`}>Mettre à jour</button>
      </form>
    </div>
  )
}


export default PageAdmin
