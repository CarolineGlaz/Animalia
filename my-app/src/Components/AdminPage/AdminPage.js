import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './AdminPage.css'

const AdminPage = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [produits, setProduits] = useState([])
  const [user, setUser] = useState([])
  const [ProduitData, setProduitData] = useState({
    nom: '',
    description: '',
    categorie: '',
    prix: '',
    img: ''
  })
  const [UserData, setUserData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    adresse: '',
    roles: [],
  })

  const [editProduit, setEditProduit] = useState(null)
  const [editUser, setEditUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [userSuccessMessage, setUserSuccessMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProduits = () => {
      setLoading(true)
      axios.get(`${process.env.REACT_APP_API_URL}/dashboard/get`)
        .then(response => {
          setProduits(response.data)
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            navigate('/')
          } else {
            setError('Une erreur est survenue lors de la récupération des produits')
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }

    const fetchUsers = () => {
      axios.get(`${process.env.REACT_APP_API_URL}/dashboard/user/get`)
        .then(response => {
          setUser(response.data)
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            navigate('/')
          } else {
            setError("Une erreur est survenue lors de la récupération des utilisateurs")
          }
        })
    }

    fetchProduits()
    fetchUsers()
  }, [navigate])

  const handleChange = (element) => {
    const { name, value } = element.target
    setProduitData(etatPrecedent => ({ ...etatPrecedent, [name]: value }))
  }

  const handleUserChange = (element) => {
    const { name, value } = element.target
    setUserData((etatPrecedent) => ({ ...etatPrecedent, [name]: value }))
  }

  const handleUserSubmit = (element) => {
    element.preventDefault()
    const userToSend = { ...UserData, roles: [UserData.roles] }

    if (editUser) {
      axios.put(`${process.env.REACT_APP_API_URL}/dashboard/user/modifier/${editUser.id}`, userToSend)
        .then(() => {
          setUser(etatPrecedent => etatPrecedent.map(utilisateur => (utilisateur.id === editUser.id ? userToSend : utilisateur)))
          setUserSuccessMessage('Utilisateur modifié avec succès')
        })
        .catch(() => {
          setError("Erreur lors de la modification de l'utilisateur")
        })
    } else {
      axios.post(`${process.env.REACT_APP_API_URL}/dashboard/user/ajouter`, userToSend)
        .then(() => {
          setUser(etatPrecedent => [...etatPrecedent, userToSend])
          setUserSuccessMessage("Utilisateur ajouté avec succès")
        })
        .catch(() => {
          setError("Erreur lors de l'ajout de l'utilisateur")
        })
    }

    setUserData({ email: '', password: '', nom: '', prenom: '', adresse: '', roles: [] })
    setEditUser(null)
  }

  const handleSubmit = (element) => {
    element.preventDefault()
    const produit = {
      ...ProduitData,
      prix: parseFloat(ProduitData.prix),
      categorie: [ProduitData.categorie]
    }

    if (editProduit) {
      axios.put(`${process.env.REACT_APP_API_URL}/dashboard/modifier/${editProduit.id}`, produit)
        .then(() => {
          setProduits(etatPrecedent => etatPrecedent.map(produit => (produit.id === editProduit.id ? produit : produit)))
          setSuccessMessage("Produit modifié avec succès")
        })
        .catch(() => {
          setError('Erreur lors de la modification du produit')
        })
    } else {
      axios.post(`${process.env.REACT_APP_API_URL}/dashboard/ajouter`, produit)
        .then(() => {
          setProduits(etatPrecedent => [...etatPrecedent, produit])
          setSuccessMessage('Produit ajouté avec succès')
        })
        .catch(() => {
          setError("Erreur lors de l'ajout du produit")
        })
    }

    setProduitData({ nom: '', description: '', categorie: '', prix: '', img: '' })
    setEditProduit(null)
  }

  const Delete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      axios.delete(`${process.env.REACT_APP_API_URL}/dashboard/supprimer/${id}`)
        .then(() => {
          setProduits(etatPrecedent => etatPrecedent.filter(produit => produit.id !== id))
          setSuccessMessage('Produit supprimé avec succès')
        })
        .catch(() => {
          setError('Erreur lors de la suppression du produit')
        })
    }
  }

  const deleteUser = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      axios.delete(`${process.env.REACT_APP_API_URL}/dashboard/user/supprimer/${id}`)
        .then(() => {
          setUser((etatPrecedent) => etatPrecedent.filter((u) => u.id !== id))
          setUserSuccessMessage('Utilisateur supprimé avec succès')
        })
        .catch(() => {
          setError('Erreur lors de la suppression de l\'utilisateur')
        })
    }
  }

  if (loading) return <p>Chargement...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Page Admin</h1>
      <h2>Liste des produits</h2>
      <ul>
        {produits.map(produit => (
          <li key={produit.id}>
            {produit.nom}
            {produit.description}
            {produit.categorie}
            {produit.prix}
            <br />
            <button onClick={() => {
              setEditProduit(produit)
              setProduitData({
                nom: produit.nom,
                description: produit.description,
                categorie: produit.categorie[0],
                prix: produit.prix,
                img: produit.img
              })
            }}>Modifier</button>
            <button onClick={() => Delete(produit.id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      <h2>{editProduit ? 'Modifier un produit' : 'Ajouter un produit'}</h2>
      {successMessage && <p>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" value={ProduitData.nom} onChange={handleChange} placeholder="Nom" required />
        <input type="text" name="description" value={ProduitData.description} onChange={handleChange} placeholder="Description" required />
        <input type="text" name="categorie" value={ProduitData.categorie} onChange={handleChange} placeholder="Catégorie" required />
        <input type="number" name="prix" value={ProduitData.prix} onChange={handleChange} placeholder="Prix" required />
        <input type="text" name="img" value={ProduitData.img} onChange={handleChange} placeholder="URL de l'image" required />
        <button type="submit">{editProduit ? 'Mettre à jour' : 'Ajouter'}</button>
        {editProduit && <button type="button" onClick={() => setEditProduit(null)}>Annuler</button>}
      </form>

      <h2>Liste des utilisateurs</h2>
      <ul>
        {user.map((u) => (
          <li key={u.id}>
            {u.nom} {u.prenom} ({u.email})
            <button onClick={() => {
              setEditUser(u)
              setUserData({
                email: u.email,
                nom: u.nom,
                prenom: u.prenom,
                adresse: u.adresse,
                roles: u.roles
              })
            }}>Modifier</button>
            <button onClick={() => deleteUser(u.id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      <h2>{editUser ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}</h2>
      {userSuccessMessage && <p>{userSuccessMessage}</p>}
      <form onSubmit={handleUserSubmit}>
        <input type="email" name="email" value={UserData.email} onChange={handleUserChange} placeholder="Email" required />
        <input type="password" name="password" value={UserData.password} onChange={handleUserChange} placeholder="Mot de passe" required />
        <input type="text" name="nom" value={UserData.nom} onChange={handleUserChange} placeholder="Nom" required />
        <input type="text" name="prenom" value={UserData.prenom} onChange={handleUserChange} placeholder="Prénom" required />
        <input type="text" name="adresse" value={UserData.adresse} onChange={handleUserChange} placeholder="Adresse" required />
        <input type="text" name="roles" value={UserData.roles} onChange={handleUserChange} placeholder="Rôle" required />
        <button type="submit">{editUser ? 'Mettre à jour' : 'Ajouter'}</button>
        {editUser && <button type="button" onClick={() => setEditUser(null)}>Annuler</button>}
      </form>
    </div>
  )
}

export default AdminPage
