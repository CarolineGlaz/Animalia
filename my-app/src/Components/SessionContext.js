import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState({ isLogged: false });

  const startSession = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/session/start`)
      .then(response => {
        console.log('Session démarrée:', response.data);
        checkSession();
      })
      .catch(error => {
        console.error('Erreur lors du démarrage de la session:', error);
      });
  };

  const checkSession = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/session/check`)
      .then(response => {
        console.log('Session trouvée:', response.data);
        setSession(response.data.sessionData);
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          console.log('Aucune session trouvée, démarrage de la session');
          startSession();
        } else {
          console.error('Erreur lors de la vérification de la session:', error);
        }
      });
  };

  const logout = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/session/logout`)
      .then(() => {
        setSession({ isLogged: false });
      })
      .catch(error => {
        console.error('Erreur lors de la déconnexion:', error);
      });
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

// Hook personnalisé pour accéder aux informations de session
export const useSession = () => useContext(SessionContext);
