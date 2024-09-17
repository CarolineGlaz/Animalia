import { useState, useEffect } from 'react';
import axios from 'axios';
import './CardAnimals.css';

const CardAnimals = () => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/card`);
        setCards(response.data.cardAnimals || []);
      } catch (err) {
        setError("Erreur lors de la récupération des données.");
        console.error(err);
      }
    };

    fetchCards();
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="card-container">
      {cards.length > 0 ? (
        cards.map((card) => (
          <div key={card.id} className="card">
            <img className="card-image" src={card.data} alt={card.titre} />
            <h3>{card.titre}</h3>
            <p>{card.contenu}</p>
          </div>
        ))
      ) : (
        <p className="no-cards">Aucune carte trouvée</p>
      )}
    </div>
  );
};

export default CardAnimals;
