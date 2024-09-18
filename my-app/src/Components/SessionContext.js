import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

axios.defaults.withCredentials = true

export const SessionContext = createContext()

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState({ isLogged: false })
  const [sessionStarted, setSessionStarted] = useState(false) // Nouvelle variable d'état

  const startSession = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/session/start`)
      .then(response => {
        console.log('Session démarrée:', response.data)
        setSessionStarted(true) // Marque la session comme démarrée
        setSession({ isLogged: true }) // Met à jour l'état de la session directement
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
        if (error.response && error.response.status === 404 && !sessionStarted) {
          console.log('Aucune session trouvée, démarrage de la session')
          startSession()
        } else {
          console.error('Erreur lors de la vérification de la session:', error)
        }
      })
  }

  const logout = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/session/logout`)
      .then(() => {
        setSession({ isLogged: false })
        setSessionStarted(false) // Réinitialise l'état de session démarrée
      })
      .catch(error => {
        console.error('Erreur lors de la déconnexion:', error)
      })
  }

  useEffect(() => {
    checkSession()
  }, [])

  return (
    <SessionContext.Provider value={{ session, setSession, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext) 
