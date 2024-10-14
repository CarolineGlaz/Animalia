import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import { SessionContext } from '../SessionContext'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [popup, setPopup] = useState(false)
    const { session, logout, login } = useContext(SessionContext)

    const navigate = useNavigate()

    useEffect(()=> {
      if(session.isLogged){
        const localPanier = JSON.parse(localStorage.getItem('panier')) || [];

        if(localPanier.length == 0){
            navigate("/")
        } else {
            setPopup(true)
        }
      }
    }, [session])

    return (
      <div className="login-page">
        <MyPopup display={popup}/>
          <form 
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault()
              login(e, username, password)
            }} 
            method="POST"
          >
            <h2>Connexion</h2>
            <hr></hr>
              <div className="login-form-group">
                <label className="login-form-label">Username:</label>
                <input
                  className="login-form-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required />
              </div>
              <div className="login-form-group">
                <label className="login-form-label">Password:</label>
                  <input 
                    className="login-form-input"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
              </div>
              <button className="login-form-button" type="submit">Login</button>
              <p>
                Vous n'avez pas de compte ? <a className="login-form-link" href="/register">Inscrivez-vous ici</a>
              </p>
          </form>
      </div>
    )
}

const MyPopup = ( props ) => {
  
  const navigate = useNavigate()
  const ajouterElement = async (id, quantite) => {
      try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/panier/ajouter/${id}`, {
          quantite: quantite
          });
      } catch (error) {
        console.error('Erreur:', error);
      }
  };

  const handleClosePopup = async (answer) => {
    if (answer === "Oui") {
        const localPanier = JSON.parse(localStorage.getItem('panier')) || [];
        for (const element of localPanier) {
          await ajouterElement(element.idProduit, element.quantite);
        }
        localStorage.removeItem('panier');
    } else {
        localStorage.removeItem('panier');
    }
    navigate("/");
  };
  
  return (
      <div>
      {props.display && (
          <div className="popup">
          <div className="popup-content">
              <p>Vous avez un panier en cours, souhaitez vous le charger sur votre compte ou le supprimer ? (Les données seront perdues.) </p>
              <button className="popup-button" onClick={() => handleClosePopup("Oui")}>Le charger</button>
              <button className="popup-button" onClick={() => handleClosePopup("Non")}>Le supprimer</button>
          </div>
          </div>
      )}
      </div>
  );
};

export default Login
