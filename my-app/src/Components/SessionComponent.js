import React, { useEffect } from 'react';
import axios from '../AxiosConfig';

const SessionComponent = () => {
    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const startResponse = await axios.get('/session/start');
                console.log('Réponse de démarrage de session :', startResponse.data);

                const checkResponse = await axios.get('/session/check');
                console.log('Réponse de vérification de session :', checkResponse.data);
            } catch (error) {
                console.error('Une erreur est survenue avec les requêtes de session :', error);
            }
        };

        fetchSessionData();
    }, []);

    return (
        <div>
            Vérifiez la console qui doit être en PLS avec toutes les erreurs.
        </div>
    );
};

export default SessionComponent;

