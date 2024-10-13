import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import { SessionContext } from '../SessionContext'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [popup, setPopup] = useState(false)
    const { session, logout, login } = useContext(SessionContext)

    const navigate = useNavigate()
   
    useEffect(()=> {
        if(session.isLogged){
            const localPanier = JSON.parse(localStorage.getItem('panier')) || [];
            if(localPanier == []){
                navigate("/")
            } else {
                setPopup(true)
            }
        }
            


    }, [session])


    return (
        <div>
            <MyPopup display={popup}/>
            <form onSubmit={(e) => {
                        e.preventDefault()
                        login(e, username, password)
                    }} method="POST">
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

const MyPopup = ( props ) => {
    const navigate = useNavigate()

    const ajouterElement = async (id, quantite) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/panier/ajouter/${id}`, {
                quantite: quantite
            });
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleClosePopup = async (answer) => {
        if (answer === "Oui") {
            const localPanier = JSON.parse(localStorage.getItem('panier')) || [];
            for (const element of localPanier) {
                await ajouterElement(element.idProduit, element.quantite);
            }
            localStorage.removeItem('panier');
        } else {
            localStorage.removeItem('panier');
        }
        navigate("/");
    };

    return (
        <div>
        {props.display && (
            <div className="popup">
            <div className="popup-content">
                <p>Vous avez un panier en cours, souhaitez vous le charger sur votre compte ou le supprimer ? (Les données seront perdues.) </p>
                <button className="mybutton" onClick={() => handleClosePopup("Oui")}>Le charger</button>
                <button className="mybutton" onClick={() => handleClosePopup("Non")}>Le supprimer</button>
            </div>
            </div>
        )}

        <style jsx>{`
            .popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            }
            .popup-content {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            }
            .mybutton {
            margin: 10px;
            padding: 10px 20px;
            cursor: pointer;
            }
        `}</style>
        </div>
    );
};


export default Login
