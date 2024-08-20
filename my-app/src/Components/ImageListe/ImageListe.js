import axios from "axios"
import { useEffect, useState } from "react"


const ImageListe = ({ id }) => {
  const [images, setImages] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)
  const [imagesData, setImagesData] = useState([])


  useEffect(() => {
    try {
      axios.get(`https://127.0.0.1:8000/produit/image/${id}`)
        .then((res => {
          let json = res.data
          setImages(json.encodedImages)
          setImagesData(json.images)
        })
        )
    } catch (erreur) {
      setErreur("Erreur lors du chargement de l'image.")
      console.error('Erreur :', erreur)
    } finally {
      setChargement(false)
    }

  }, [id])

  if (chargement) return <p>Chargement de l'image ...</p>
  if (erreur) return <p>{erreur}</p>

  return (
    <div>
      {images ?
        imagesData.map((imgData) => (
          <img key={`image${imgData.id}`} src={'data:image/jpeg;base64,' + images[imgData.id]} alt={imgData.nom} />
        ))
        : <p>Pas d'image supplémentaire disponible</p>
      }
    </div>
  )


}

export default ImageListe