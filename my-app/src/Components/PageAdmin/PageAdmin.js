import React, { useEffect, useState } from 'react'
import axios, { Axios } from 'axios'
import PageSelector from '../PageSelector/PageSelector'

const PageAdmin = () => {
  return (
    <div className='PageAdmin'>
      <h2>Modifier un produit</h2>
      <ProductList></ProductList>
      <h2>Ajouter un produit</h2>
      <AddProduct></AddProduct>
      <h2>Modifier un utilisateur</h2>
      <UserList></UserList>
      <h2>AJouter un utilisateur</h2>
      <AddUser></AddUser>
    </div>
  )
}

const ProductList  = () => {
  const [blur, setBlur] = useState(false)
  const [maxPage, setMaxPage] = useState(0)
  const [page, setPage] = useState(1)
  const [produits, setproduits] = useState([])
  const [loading, setLoading] = useState(false)

  const SIZE = 4

  useEffect(() => {
    setLoading(false)
    setBlur(true)
    axios.get(`${process.env.REACT_APP_API_URL}/`, {
      params: {
        start: page * SIZE - SIZE,
        size: SIZE,
      }
    },)
      .then(res => {
        let json = res.data
        setproduits(json.produits)
        const maxPageNumber = (json.countElement + SIZE - 1) / SIZE
        setMaxPage(parseInt(maxPageNumber))
      })
      .finally(() => {
        setBlur(false)
      })
  }, [page, loading])

  return (
    <div className='ProductList'>
      { produits.map((produit) => {
       return <Product key={produit.id} load={setLoading} produit={produit}/>
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

  const CATEGORIES = ['TOUS', 'CHAT', 'RONGEUR']

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduitData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;

    setProduitData(prev => ({ ...prev, categorie: [selectedCategory] }));
  };

  useEffect(() => {
    setProduitData(props.produit)
  }, [])

  const DeleteProduct = (e) =>{
    e.preventDefault()
    axios.delete(`${process.env.REACT_APP_API_URL}/dashboard/supprimer/${props.produit.id}`)
    .then(response => {
      console.log(response)
      props.load(true)
    })
    .catch(error => {
      if (error.response && error.response.status === 404){
        console.log(`Erreur lors de la suppression du produit`);
      } else {
        console.log(`Autre erreur`);
      }
    })
  }

  const PutProduct = (e) => {
    e.preventDefault()
    if(JSON.stringify(props.produit) === JSON.stringify(ProduitData))
      return

    axios.put(`${process.env.REACT_APP_API_URL}/dashboard/modifier/${props.produit.id}`, ProduitData )
    .then( response => {
      console.log(response)
      props.load(true)
    })
    .catch( error =>{
        if (error.response && error.response.status === 404){
          console.log(`Erreur lors de la modification du produit`)
        }
    })
  }

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
        <button type="submit" className={`${(JSON.stringify(props.produit) === JSON.stringify(ProduitData)) && 'blur'}`} onClick={PutProduct} >Mettre à jour</button>
        <button onClick={DeleteProduct}>Supprimer</button>
      </form>
    </div>
  )
}

const AddProduct = () => {
  const [success, setSuccess] = useState(false)
  const [produitData, setProduitData] = useState({
    nom: '',
    description: '',
    categorie: '',
    prix: '',
    img: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduitData(prev => ({ ...prev, [name]: value }))
  }

  const productAdd = (e) => {
    e.preventDefault()
    axios.post(`${process.env.REACT_APP_API_URL}/dashboard/ajouter`, produitData)
      .then(response => {
        console.log(response)
        setSuccess(true)
      })
      .catch(error => {
        console.log(`Erreur lors de l'ajout du produit`)
      })
  }

  useEffect(() => {
    if (success) {
      setProduitData({
        nom: '',
        description: '',
        categorie: '',
        prix: '',
        img: ''
      })
      setSuccess(false)
    }
  }, [success])

  return (
    <div className='AddProduct'>
      <form onSubmit={productAdd}>
        <input type="text" name="nom" value={produitData.nom} onChange={handleChange} placeholder="Nom" required />
        <input type="text" name="description" value={produitData.description} onChange={handleChange} placeholder="Description" required />
        <input type="text" name="categorie" value={produitData.categorie} onChange={handleChange} placeholder="Catégorie" required />
        <input type="number" name="prix" value={produitData.prix} onChange={handleChange} placeholder="Prix" required />
        <input type="text" name="img" value={produitData.img} onChange={handleChange} placeholder="URL de l'image" required />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  )
}


const UserList = () => {
  const [blur, setBlur] = useState(false)
  const [maxPage, setMaxPage] = useState(0)
  const [page, setPage] = useState(1)
  const [utilisateurs, setUtilisateurs] = useState([])
  const [loading, setLoading] = useState(false)

  const SIZE = 4

  useEffect(() => {
    setLoading(false)
    setBlur(true)
    axios.get(`${process.env.REACT_APP_API_URL}/dashboard/user/get`, {
      params: {
        start: page * SIZE - SIZE,
        size: SIZE,
      },
    })
    .then(res => {
      const json = res.data
      console.log(json.users)
      setUtilisateurs(json.users)
      const maxPageNumber = (json.countElement + SIZE - 1) / SIZE
      setMaxPage(parseInt(maxPageNumber))
      console.log(parseInt(maxPageNumber))
    })
    .finally(() => {
      setBlur(false)
    })
  }, [page, loading])

  return (
    <div className='UserList'>
      {utilisateurs.map((user) => (
        <User key={user.id} load={setLoading} user={user} />
      ))}
      <PageSelector max={maxPage} page={page} setPage={setPage} />
    </div>
  )
}


const User = (props) => {
  const [UserData, setUserData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    adresse: '',
    roles: [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    setUserData(props.user)
  }, [props.user])

    const DeleteUser = (e) => {
    e.preventDefault()
    axios.delete(`${process.env.REACT_APP_API_URL}/dashboard/user/supprimer/${props.user.id}`)
      .then((response) => {
        console.log(response)
        props.load(true)
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.log("Erreur lors de la suppression de l'utilisateur");
        } else {
          console.log('Autre erreur');
        }
      })
  }

  const PutUser = (e) => {
    e.preventDefault()
    if (JSON.stringify(props.user) === JSON.stringify(UserData)) return

    axios.put(`${process.env.REACT_APP_API_URL}/dashboard/user/modifier/${props.user.id}`, UserData)
      .then((response) => {
        console.log(response)
        props.load(true)
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.log("Erreur lors de la modification de l'utilisateur")
        }
      })
  }

  return (
    <div id={`user-${props.user.id}`}>
      <form onSubmit={console.log}>
        <input type="email" name="email" value={UserData.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="nom" value={UserData.nom} onChange={handleChange} placeholder="Nom" required />
        <input type="text" name="prenom" value={UserData.prenom} onChange={handleChange} placeholder="Prénom" required />
        <input type="text" name="adresse" value={UserData.adresse} onChange={handleChange} placeholder="Adresse" required />
        <button type="submit" className={`${(JSON.stringify(props.user) === JSON.stringify(UserData)) && 'blur'}`} onClick={PutUser}>Mettre à jour</button>
        <button onClick={DeleteUser}>Supprimer</button>
      </form>
    </div>
  )
}

const AddUser = () => {
  const [success, setSuccess] = useState(false)
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    adresse: '',
    roles: []
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const userAdd = (e) => {
    e.preventDefault()
    axios.post(`${process.env.REACT_APP_API_URL}/dashboard/user/ajouter`, userData)
      .then(response => {
        console.log(response)
        setSuccess(true)
      })
      .catch(error => {
        console.log("Erreur lors de l'ajout de l'utilisateur")
      })
  }

  useEffect(() => {
    if (success) {
      setUserData({
        email: '',
        password: '',
        nom: '',
        prenom: '',
        adresse: '',
        roles: []
      })
      setSuccess(false)
    }
  }, [success])

  return (
    <div className='AddUser'>
      <form onSubmit={userAdd}>
        <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Mot de passe" required />
        <input type="text" name="nom" value={userData.nom} onChange={handleChange} placeholder="Nom" required />
        <input type="text" name="prenom" value={userData.prenom} onChange={handleChange} placeholder="Prénom" required />
        <input type="text" name="adresse" value={userData.adresse} onChange={handleChange} placeholder="Adresse" required />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  )
}




export default PageAdmin
