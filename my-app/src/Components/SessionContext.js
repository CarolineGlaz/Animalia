import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

axios.defaults.withCredentials = true

export const SessionContext = createContext()

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState({ isLogged: false })

  const startSession = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/session/start`)
      .then(response => {
        checkSession()
        console.log('Session démarrée:', response.data)
      })
      .catch(error => {
        console.error('Erreur lors du démarrage de la session:', error)
      })
  }

  const checkSession = () => {
    console.log("Appel de checkSession")
    axios.get(`${process.env.REACT_APP_API_URL}/session/check`)
      .then(response => {
        console.log('Session trouvée:', response.data)
        setSession(response.data.sessionData)
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          console.log('Aucune session trouvée, démarrage de la session')
          startSession()
        } else {
          console.error('Erreur lors de la vérification de la session:', error)
        }
      })
  }

  const logout = async () => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/session/logout`)
        // console.log(response.data.message)
        setSession({ isLogged: false })
        startSession()
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error.message)
        if (error.response) {
            console.error('Réponse du serveur:', error.response.data)
        } else if (error.request) {
            console.error('Requête envoyée mais aucune réponse reçue:', error.request)
        } else {
            console.error('Erreur lors de la configuration de la requête:', error.message)
        }
    }
  }

  const login = async (e, username, password) => {
    e.preventDefault()

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/my-login`, {
            username: username,
            password: password,
        }, {
            withCredentials: true
        })

        console.log(response)
        console.log('Connexion avec succès')
        checkSession()
    } catch (error) {
        console.log("La connexion a échoué. Veuillez vérifier vos informations d'identification.")
    }
}


  useEffect(() => {
    checkSession()
  }, [])

  return (
    <SessionContext.Provider value={{ session, logout, login }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext) 