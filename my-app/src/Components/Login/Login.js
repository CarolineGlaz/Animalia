import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger">
          {error.message}
        </div>
      )}

      {user && (
        <div className="mb-3">
          You are logged in as {user.userIdentifier}, <a href="/logout">Logout</a>
        </div>
      )}

      <h1 className="h3 mb-3 font-weight-normal">Connecte toi !</h1>

      <label htmlFor="inputEmail">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        name="email"
        id="inputEmail"
        className="form-control"
        autoComplete="email"
        required
        autoFocus
      />

      <label htmlFor="inputPassword">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name="password"
        id="inputPassword"
        className="form-control"
        autoComplete="current-password"
        required
      />

      <input
        type="hidden"
        name="_csrf_token"
        value={csrfToken}
      />

      <button className="btn btn-lg btn-primary" type="submit">
        Sign in
      </button>
    </form>
  );
};

export default Login;