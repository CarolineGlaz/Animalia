import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import { SessionContext } from '../SessionContext'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { session, logout, login } = useContext(SessionContext)

    const navigate = useNavigate()
   

    return (
        <div>
            <form onSubmit={(e) => login(e, username, password).then(()=>navigate("/"))} method="POST">
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
                <p>
                    Vous n'avez pas de compte ? <a href="/register">Inscrivez-vous ici</a>
                </p>
            </form>
        </div>
    )
}

export default Login
