import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './AdminPage.css'
import ProductForm from '../ProductForm/ProductForm'
import UserForm from '../UserForm/UserForm'
import ProductListDashboard from '../ProductListDashboard/ProductListDashboard'
import UserList from '../UserList/UserList'

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

  const handleProductSubmit = (produit) => {
    if (editProduit) {
      axios.put(`${process.env.REACT_APP_API_URL}/dashboard/modifier/${editProduit.id}`, produit)
        .then(() => {
          setProduits(prev => prev.map(produit => (produit.id === editProduit.id ? produit : produit)))
          setSuccessMessage("Produit modifié avec succès")
        })
        .catch(error => {
          console.error("Erreur lors de la mise à jour du produit", error)
        })
    } else {
      axios.post(`${process.env.REACT_APP_API_URL}/dashboard/ajouter`, produit)
        .then(() => {
          setProduits(prev => [...prev, produit])
          setSuccessMessage('Produit ajouté avec succès')
        })
        .catch(error => {
          console.error("Erreur lors de l'ajout du produit", error)
        })
    }
    resetProductForm()
  }

  const handleUserSubmit = (userToSend) => {
    if (editUser) {
      axios.put(`${process.env.REACT_APP_API_URL}/dashboard/user/modifier/${editUser.id}`, userToSend)
        .then(() => {
          setUser(prev => prev.map(utilisateur => (utilisateur.id === editUser.id ? userToSend : utilisateur)))
          setUserSuccessMessage('Utilisateur modifié avec succès')
        })
        .catch(error => {
          console.error("Erreur lors de la mise à jour de l'utilisateur", error)
        })
    } else {
      axios.post(`${process.env.REACT_APP_API_URL}/dashboard/user/ajouter`, userToSend)
        .then(() => {
          setUser(prev => [...prev, userToSend])
          setUserSuccessMessage("Utilisateur ajouté avec succès")
        })
        .catch(error => {
          console.error("Erreur lors de l'ajout de l'utilisateur", error)
        })
    }
    resetUserForm()
  }

  const resetProductForm = () => {
    setProduitData({ nom: '', description: '', categorie: '', prix: '', img: '' })
    setEditProduit(null)
  }

  const resetUserForm = () => {
    setUserData({ email: '', password: '', nom: '', prenom: '', adresse: '', roles: [] })
    setEditUser(null)
  }

  const deleteProduct = (id) => {
    if (window.confirm("Etes-vous sûr de vouloir supprimer ce produit ?")) {
      axios.delete(`${process.env.REACT_APP_API_URL}/dashboard/supprimer/${id}`)
        .then(() => {
          setProduits(prev => prev.filter(produit => produit.id !== id))
          setSuccessMessage('Produit supprimé avec succès')
        })
        .catch(error => {
          console.error("Erreur lors de la suppression du produit", error)
        })
    }
  }

  const deleteUser = (id) => {
    if (window.confirm("Etes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      axios.delete(`${process.env.REACT_APP_API_URL}/dashboard/user/supprimer/${id}`)
        .then(() => {
          setUser(prev => prev.filter(utilisateur => utilisateur.id !== id))
          setUserSuccessMessage('Utilisateur supprimé avec succès')
        })
        .catch(error => {
          console.error("Erreur lors de la suppression de l'utilisateur", error)
        })
    }
  }

  if (loading) return <p>Chargement...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Page Admin</h1>

      <h2>Liste des produits</h2>
      <ProductListDashboard produits={produits} edit={setEditProduit} onDelete={deleteProduct} />
      <ProductForm 
        ProduitData={ProduitData} 
        setProduitData={setProduitData} 
        onSubmit={handleProductSubmit} 
        successMessage={successMessage} 
        editProduit={editProduit} 
        setEditProduit={setEditProduit} 
        resetProductForm={resetProductForm}
      />
      
      <h2>Liste des utilisateurs</h2>
      <UserList users={user} edit={setEditUser} onDelete={deleteUser} />
      <UserForm 
        UserData={UserData} 
        setUserData={setUserData} 
        onSubmit={handleUserSubmit} 
        userSuccessMessage={userSuccessMessage} 
        editUser={editUser} 
        setEditUser={setEditUser} 
      />
    </div>
  )
}

export default AdminPage
