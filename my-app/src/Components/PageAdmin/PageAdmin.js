import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import PageSelector from '../PageSelector/PageSelector'
import './PageAdmin.css' 
import { SessionContext } from '../SessionContext';
import ImageListe from '../ImageListe/ImageListe';


const PageAdmin = () => {
  const { session } = useContext(SessionContext)

  if (!session.isLogged || !session.isAdmin) {
    return (<div className='error'>
              <h1>Vous n'avez pas accès à cette page</h1>
            </div>);
  }

  return (
    <div className='page-admin'>
      <h2>Modifier un produit</h2>
      <ProductList />
      <h2>Ajouter un produit</h2>
      <AddProduct />
      <h2>Modifier un utilisateur</h2>
      <UserList />
      <h2>Ajouter un utilisateur</h2>
      <AddUser />
    </div>
  )
}

const ProductList = () => {
  const [blur, setBlur] = useState(false)
  const [maxPage, setMaxPage] = useState(0)
  const [page, setPage] = useState(1)
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(false)
  const SIZE = 4

  useEffect(() => {
    setLoading(false)
    setBlur(true)
    axios.get(`${process.env.REACT_APP_API_URL}/`, {
      params: {
        start: page * SIZE - SIZE,
        size: SIZE,
      },
    })
      .then(res => {
        const json = res.data
        setProduits(json.produits)
        const maxPageNumber = (json.countElement + SIZE - 1) / SIZE
        setMaxPage(parseInt(maxPageNumber))
      })
      .finally(() => {
        setBlur(false)
      })
  }, [page, loading])

  return (
    <div className='product-list'>
      {produits.map((produit) => (
        <div key={produit.id}>
          <Product load={setLoading} produit={produit} />
          <GalerieImage produit={produit}/>
        </div>
      ))}
      <PageSelector max={maxPage} page={page} setPage={setPage} />
    </div>
  )
}

const Product = (props) => {
  const [produitData, setProduitData] = useState({
    nom: '',
    description: '',
    categorie: [],
    prix: 0,
    img: '',
  })

  const CATEGORIES = ['TOUS', 'CHAT', 'RONGEUR']

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduitData(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value
    setProduitData(prev => ({ ...prev, categorie: [selectedCategory] }))
  }

  useEffect(() => {
    setProduitData(props.produit)
  }, [props.produit])

  const DeleteProduct = (e) => {
    e.preventDefault()
    axios.delete(`${process.env.REACT_APP_API_URL}/dashboard/supprimer/${props.produit.id}`)
      .then(response => {
        props.load(true)
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          console.log(`Erreur lors de la suppression du produit`)
        } else {
          console.log(`Autre erreur`)
        }
      })
  }

  const PutProduct = (e) => {
    e.preventDefault()
    if (JSON.stringify(props.produit) === JSON.stringify(produitData)) return

    axios.put(`${process.env.REACT_APP_API_URL}/dashboard/modifier/${props.produit.id}`, produitData)
      .then(response => {
        props.load(true)
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          console.log(`Erreur lors de la modification du produit`)
        }
      })
  }

  return (
    <div className='product'>
      <form onSubmit={console.log}>
        <input type="text" name="nom" value={produitData.nom} onChange={handleChange} placeholder="Nom" required />
        <input type="text" name="description" value={produitData.description} onChange={handleChange} placeholder="Description" required />
        
        <select
          name="categorie"
          value={produitData.categorie[0] || ''}
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
        <input type="number" name="prix" value={produitData.prix} onChange={handleChange} placeholder="Prix" required />
        <input type="text" name="img" value={produitData.img} onChange={handleChange} placeholder="URL de l'image" required />
        <button type="submit" disabled={(JSON.stringify(props.produit) === JSON.stringify(produitData))} onClick={PutProduct}>Mettre à jour</button>
        <button onClick={DeleteProduct}>Supprimer</button>
      </form>
    </div>
  )
}

const GalerieImage = ( props ) => {
  const [keyList, setKeyList] = useState(0);
  const [keyImage, setKeyImage] = useState(0);
  const [display, setDisplay] = useState(false);
  const [imageData, setImagesData] = useState({
    id: -1,
  });
  const [alt, setAlt] = useState("");
  const [image, setImage] = useState(null);

  const handleAltChange = (e) => {
    setAlt(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Récupère l'image téléchargée
  };

  const deleteImage = () => {
    if(imageData.id == -1)
      return;
    axios.delete(`${process.env.REACT_APP_API_URL}/dashboard/image/delete/${props.produit.id}/${imageData.id}`)
    .then(res => {
      setKeyList((prevKey) => prevKey + 1);
    })
    .catch(err => {
      console.error('Erreur :', err);
    });
  }

  const addImage = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("alt", alt);
    formData.append("image", image);

    if(!image)
      return

    axios.post(`${process.env.REACT_APP_API_URL}/dashboard/image/add/${props.produit.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }})
    .then(res => {
      setKeyList((prevKey) => prevKey + 1);
      setKeyImage((prevKey) => prevKey + 1);
      setAlt("");
      setImage(null);

    })
    .catch(err => {
      console.error('Erreur :', err);
    });
  }



  return (
    <div>
      { display ? 
        ( <div> 
            <ImageListe key={keyList} id={props.produit.id} setParentImageData={setImagesData}/>
            <button onClick={deleteImage}>Supprimer cette image</button>
            <form onSubmit={addImage}>
              <div>
                <label>Alt :</label>
                <input 
                  type="text" 
                  value={alt} 
                  onChange={handleAltChange} 
                  placeholder="Titre alternatif" 
                />
              </div>
              <div>
                <label>Image :</label>
                <MyFileInput key={keyImage} handleImageChange={handleImageChange} />
              </div>
              <button type="submit" disabled={image == null}>
                Envoyer
              </button>
            </form>
            <button onClick={() => setDisplay(false)}>Masquer la galerie</button>
          </div> ) 
        : <button onClick={() => setDisplay(true)}>Afficher la galerie</button>
      }
    </div>
  )
}

const MyFileInput = (props) => {


  return (
    <input 
    type="file" 
    onChange={props.handleImageChange} 
    accept="image/*"
  />
  )
}

const AddProduct = () => {
  const [success, setSuccess] = useState(false)
  const [produitData, setProduitData] = useState({
    nom: '',
    description: '',
    categorie: '',
    prix: '',
    img: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduitData(prev => ({ ...prev, [name]: value }))
  }

  const productAdd = (e) => {
    e.preventDefault()
    axios.post(`${process.env.REACT_APP_API_URL}/dashboard/ajouter`, produitData)
      .then(response => {
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
        img: '',
      })
      setSuccess(false)
    }
  }, [success])

  return (
    <div className='add-product'>
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
        setUtilisateurs(json.users)
        const maxPageNumber = (json.countElement + SIZE - 1) / SIZE
        setMaxPage(parseInt(maxPageNumber))
      })
      .finally(() => {
        setBlur(false)
      })
  }, [page, loading])

  return (
    <div className='user-list'>
      {utilisateurs.map((user) => (
        <User key={user.id} load={setLoading} user={user} />
      ))}
      <PageSelector max={maxPage} page={page} setPage={setPage} />
    </div>
  )
}

const User = (props) => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    adresse: '',
    roles: '',
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
        props.load(true)
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.log("Erreur lors de la suppression de l'utilisateur")
        } else {
          console.log('Autre erreur')
        }
      })
  }

  const PutUser = (e) => {
    e.preventDefault()
    axios.put(`${process.env.REACT_APP_API_URL}/dashboard/user/modifier/${props.user.id}`, userData)
      .then((response) => {
        props.load(true)
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.log("Erreur lors de la modification de l'utilisateur")
        }
      })
  }

  return (
    <div className='user'>
      <form onSubmit={console.log}>
        <input type="text" name="nom" value={userData.nom} onChange={handleChange} placeholder="Nom" disabled={userData.roles === "2"} required />
        <input type="text" name="prenom" value={userData.prenom} onChange={handleChange} placeholder="Prénom" disabled={userData.roles === "2"} required />
        <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" disabled={userData.roles === "2"} required />
        <input type="text" name="adresse" value={userData.adresse} onChange={handleChange} placeholder="Adresse" disabled={userData.roles === "2"} required />
        <select
            name="roles"
            value={userData.roles}
            onChange={handleChange}
            disabled={userData.roles === "2"}>
            <option value="0">Utilisateur</option>
            <option value="1">Employé</option>
            <option value="2" disabled>Administrateur</option>
        </select>
        { userData.roles === "2" ? null :
          <div name='buttons' style={{ display: 'inline-block' }}>
            <button type="submit" onClick={PutUser}>Mettre à jour</button>
            <button onClick={DeleteUser}>Supprimer</button>
          </div>
        }
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
    roles: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const userAdd = (e) => {
    e.preventDefault()
    axios.post(`${process.env.REACT_APP_API_URL}/dashboard/user/ajouter`, userData)
      .then(response => {
        setSuccess(true)
      })
      .catch(error => {
        console.log(`Erreur lors de l'ajout de l'utilisateur`)
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
        roles: '',
      })
      setSuccess(false)
    }
  }, [success])

  return (
    <div className='add-user'>
      <form onSubmit={userAdd}>
        <input type="text" name="nom" value={userData.nom} onChange={handleChange} placeholder="Nom" required />
        <input type="text" name="prenom" value={userData.prenom} onChange={handleChange} placeholder="Prénom" required />
        <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="adresse" value={userData.adresse} onChange={handleChange} placeholder="Adresse" required />
        <select
            name="roles"
            value={userData.roles}
            onChange={handleChange}
        >
            <option value="0">Utilisateur</option>
            <option value="1">Employé</option>
        </select>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  )
}

export default PageAdmin
