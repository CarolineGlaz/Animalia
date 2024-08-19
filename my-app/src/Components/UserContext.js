import React, { createContext, useState, useEffect } from 'react';
// import axios from '../AxiosConfig';

export const UserContext = createContext(); // Crée un contexte React pour gérer les informations utilisateur

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Déclare un état local 'user' initialisé à null

    useEffect(() => {
        // axios.get('/session/check')
        //     .then(response => {
        //         setUser(response.data.user_id); 
        //     })
        //     .catch(error => {
        //         console.error('There was an error checking the session!', error); // Affiche une erreur si la vérification de session échoue
        //     });
    }, []); // Le tableau vide en tant que second argument signifie que cet effet s'exécute uniquement une fois après le montage initial du composant

    return (
        <UserContext.Provider value={user}>
            {children} {/* Rendu des composants enfants enveloppés dans le contexte 'UserContext' */}
        </UserContext.Provider>
    );
};
