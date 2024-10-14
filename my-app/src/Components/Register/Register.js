import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Assurez-vous que le chemin est correct

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        email,
        password,
        nom,
        prenom,
        adresse,
      }, {
        withCredentials: true,
      });

      setMessage('Inscription réussie, vous allez être redirigé vers la page de connexion.');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error(error.response.data.message);
        setMessage(error.response.data.message);
      } else {
        setMessage("Une erreur s'est produite. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="register-page"> 
      <form className="register-form" onSubmit={handleSubmit}> 
        <h2 className="register-title">Inscription</h2>
        <hr />
        <div className="register-form-group"> 
          <input
            className="register-input" 
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom"
            required
          />
        </div>
        <div className="register-form-group"> 
          <input
            className="register-input" 
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            placeholder="Prénom"
            required
          />
        </div>
        <div className="register-form-group"> 
          <input
            className="register-input" 
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            placeholder="Adresse"
            required
          />
        </div>
        <div className="register-form-group"> 
          <input
            className="register-input" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="register-form-group"> 
          <input
            className="register-input" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
        </div>
        <button className="register-button" type="submit">S'inscrire</button> 
        {message && <p className="register-message">{message}</p>} 
        <p className="register-message">
          Vous avez déjà un compte ? <a className="register-link" href="/login">Connectez-vous ici</a>
        </p>
      </form>
    </div>
  );
  
}

export default Register;
