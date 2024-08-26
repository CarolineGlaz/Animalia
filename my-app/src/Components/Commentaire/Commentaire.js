import React, { useEffect, useState } from 'react';
import './Commentaire.css';
import axios from 'axios';
import FormAvis from '../FormAvis/FormAvis';

const Commentaire = () => {
  const [commentaire, setCommentaire] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setLoading(false)
    axios.get(`${process.env.REACT_APP_API_URL}/avis`)
      .then((res) => {
        setCommentaire(res.data);
      })
      .catch((error) => {
        setError('Erreur lors de la récupération des données.');
        console.error('Erreur :', error);
      });
  }, [loading]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? commentaire.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === commentaire.length - 1 ? 0 : prevIndex + 1
    );
  };


  return (
    <div className='content-commentaire'>
      <h2 className='commentaire-up'>Vos commentaires comptent pour nous !</h2>
      <div className="comCarousel">
        <button className="comCarousel-button prev" onClick={handlePrevious}>
          &#10094;
        </button>
        <div className="comCarousel-content">
          {commentaire.length > 0 ? (
            commentaire.map((com, index) => (
              <div
                key={index}
                className={`comCarousel-item ${index === 0 ? 'first-item' : ''} ${index === currentIndex ? 'current-item' : ''}`}
                style={{ transform: `translateX(-${currentIndex * 125}%)` }}
              >
                <div className="test">
                  <h3>{com.nom} {com.prenom}</h3>
                  <p>"{com.contenu}"</p>
                  <h4>{com.date}</h4>
                </div>
              </div>
            ))
          ) : (
            <div>Aucun commentaire disponible.</div>
          )}
        </div>
        <button className="comCarousel-button next" onClick={handleNext}>
          &#10095;
        </button>
      </div>
      <h2 className='commentaire-down'>Donnez votre avis !</h2>

      <FormAvis reload={setLoading} />
    </div>
  );
}

export default Commentaire;
