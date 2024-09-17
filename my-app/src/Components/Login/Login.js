import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Hook de navigation

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://127.0.0.1:8000/my-login', {
                username: username,
                password: password,
            }, {
                withCredentials: true
            });

            console.log(response);
            console.log('Connexion avec succès');
            navigate('/'); 
        } catch (error) {
            setErrorMessage("La connexion a échoué. Veuillez vérifier vos informations d'identification.");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} method="POST">
                <div>
                    <label>Username:</label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Login</button>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <p>
                    Vous n'avez pas de compte ? <a href="/register">Inscrivez-vous ici</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
