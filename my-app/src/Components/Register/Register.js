import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [adresse, setAdresse] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        email,
        password,
        nom,
        prenom,
        adresse,
      }, {
        withCredentials: true
    })
      
      setMessage('Inscription réussie, vous allez être redirigé vers la page de connexion.')

      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error(error.response.data.message)
        setMessage(error.response.data.message)
        console.error("Une erreur s'est produite")
        setMessage("Une erreur s'est produite. Veuillez réessayer.")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Nom"
      />
      <input
        type="text"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        placeholder="Prénom"
      />
      <input
        type="text"
        value={adresse}
        onChange={(e) => setAdresse(e.target.value)}
        placeholder="Adresse"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      <button type="submit">S'inscrire</button>
      {message && <p>{message}</p>}
    <p>
        Vous avez déjà un compte ? <a href="/login">Connectez-vous ici</a>
    </p>
    </form>
  )
}

export default Register
