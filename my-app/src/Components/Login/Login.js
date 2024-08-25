import React, { useState } from 'react';
import "./Login.css"
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Replace with actual user fetching logic
  const [csrfToken, setCsrfToken] = useState(''); // Replace with actual token fetching logic

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="body-container">
      <form onSubmit={handleSubmit} className="form-container">
        {error && (
          <div className="alert-danger">
            {error.message}
          </div>
        )}
  
        {user && (
          <div className="login-message">
            You are logged in as {user.userIdentifier}, <a href="/logout">Logout</a>
          </div>
        )}
  
        <h1 className="form-title">Connecte toi !</h1>
  
        <label htmlFor="inputEmail" className="form-label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          id="inputEmail"
          className="form-input"
          autoComplete="email"
          required
          autoFocus
        />
  
        <label htmlFor="inputPassword" className="form-label">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          id="inputPassword"
          className="form-input"
          autoComplete="current-password"
          required
        />
  
        <input
          type="hidden"
          name="_csrf_token"
          value={csrfToken}
        />
  
        <button className="form-button" type="submit">
          Se connecter
        </button>
        <Link to="/signup">Pas de compte ? - Inscrit toi ici !</Link>
      </form>
    </div>
  );
  
};

export default Login;