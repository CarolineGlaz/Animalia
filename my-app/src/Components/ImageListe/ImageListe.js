import axios from "axios";
import { useEffect, useState } from "react";
import './ImageListe.css';

const ImageListe = ({ id, setParentImageData }) => {
  const [images, setImages] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [imagesData, setImagesData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/produit/image/${id}`)
      .then(res => {
        let json = res.data;
        setImages(json.encodedImages);
        setImagesData(json.images);
        setChargement(false);
      })
      .catch(err => {
        setErreur("Erreur lors du chargement de l'image.");
        console.error('Erreur :', err);
        setChargement(false);
      });
  }, [id]);

  useEffect(() => {
    if(imagesData[currentIndex])
      setParentImageData(imagesData[currentIndex]);
  }, [currentIndex, imagesData]);

  const handlePrev = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? imagesData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === imagesData.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (chargement) return <p>Chargement de l'image ...</p>;
  if (erreur) return <p>{erreur}</p>;

  return (
    <div className="carousel">
      {images ? (
        <>
          <button className="carousel-button prev" onClick={handlePrev}>
            &#10094;
          </button>
          <div className="carousel-track">
            <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {imagesData.map((imgData) => (
                <div key={`image${imgData.id}`} className="carousel-item">
                  <img src={'data:image/jpeg;base64,' + images[imgData.id]} alt={imgData.nom} />
                </div>
              ))}
            </div>
          </div>
          <button className="carousel-button next" onClick={handleNext}>
            &#10095;
          </button>
        </>
      ) : (
        <p>Pas d'image supplémentaire disponible</p>
      )}
    </div>
  );
};

export default ImageListe;
