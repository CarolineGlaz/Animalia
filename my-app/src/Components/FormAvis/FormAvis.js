import axios from "axios"
import { useState } from "react"
import '../Commentaire/Commentaire.css'

const FormAvis = (props) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    commentaire: ''
  })
  const [popupBlur, setPopupBlur] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const envoieAvis = (e) => {
    e.preventDefault()
    setPopupBlur(true)
    axios.post(`${process.env.REACT_APP_API_URL}/avis/send`, formData)
      .then((res) => {
        setFormData({
          nom: '',
          prenom: '',
          commentaire: ''
        })
        props.reload(true)
        setConfirmationMessage('Votre avis a bien été envoyé à notre équipe, merci !')
        console.log(res.data)
      })
      .catch((e) => {
        console.error('erreur', e)
      })
      .finally(() => {
        setPopupBlur(false)
        setIsPopupOpen(false)
      })
  }

  const togglePopup = () => {
    if (popupBlur) return
    setIsPopupOpen(!isPopupOpen)
    setConfirmationMessage('')
  }

  return (
    <div className="button-avis-div">
      <button className="boutton-avis" onClick={togglePopup}>Ajouter un avis</button>
      {isPopupOpen &&
        (<div className="popup-overlay" onClick={togglePopup}>
          <div className={`popup-content ${popupBlur && 'blur'}`} onClick={(e) => e.stopPropagation()}>
            <h3>Ajouter un avis</h3>
            <form onSubmit={envoieAvis}>
              <input type="text" name="nom" value={formData.nom} placeholder="Nom" onChange={handleChange} required />
              <input type="text" name="prenom" value={formData.prenom} placeholder="Prénom" onChange={handleChange} required />
              <textarea name="commentaire" value={formData.commentaire} placeholder="Commentaire" onChange={handleChange} required></textarea>
              <button type="submit">Envoyer</button>
            </form>
            <button className="popup-close" onClick={togglePopup}>x</button>
          </div>
        </div>
        )
      }
      {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>} {/* Affiche le message de confirmation */}
    </div >
  )
}

export default FormAvis
