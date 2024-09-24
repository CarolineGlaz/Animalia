import React from 'react'

const ProductForm = ({ ProduitData, setProduitData, onSubmit, successMessage, editProduit, setEditProduit, resetProductForm }) => {

  const handleChange = (element) => {
    const { name, value } = element.target;
    setProduitData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (element) => {
    element.preventDefault()
    const produit = {
      ...ProduitData,
      prix: parseFloat(ProduitData.prix),
      categorie: [ProduitData.categorie]
    }
    onSubmit(produit)
  }

  return (
    <div>
      <h2>{editProduit ? 'Modifier un produit' : 'Ajouter un produit'}</h2>
      {successMessage && <p>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" value={ProduitData.nom} onChange={handleChange} placeholder="Nom" required />
        <input type="text" name="description" value={ProduitData.description} onChange={handleChange} placeholder="Description" required />
        <input type="text" name="categorie" value={ProduitData.categorie} onChange={handleChange} placeholder="Catégorie" required />
        <input type="number" name="prix" value={ProduitData.prix} onChange={handleChange} placeholder="Prix" required />
        <input type="text" name="img" value={ProduitData.img} onChange={handleChange} placeholder="URL de l'image" required />
        <button type="submit">{editProduit ? 'Mettre à jour' : 'Ajouter'}</button>
        {editProduit && <button type="button" onClick={() => { setEditProduit(null); resetProductForm() }}>Annuler</button>}
      </form>
    </div>
  )
}

export default ProductForm
