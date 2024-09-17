import React, { useContext, useState } from 'react';
import { SessionContext } from '../SessionContext';
import './Navbar.css';
import axios from 'axios';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { session, setSession } = useContext(SessionContext);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const logout = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/session/logout`)
            .then(() => {
                setSession({ isLogged: false });
            })
            .catch(error => {
                console.error('Erreur lors de la déconnexion:', error);
            });
    };

    return (
        <nav className="navbar">
            <div className="logoContainer">
                <button className="menuToggle" onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
                <a href="/" className="logoNavbar">Animalia</a>
            </div>
            <div className={`menu ${isMenuOpen ? 'open' : 'close'}`}>
                <div className="liensContainer">
                    <a className="liens" href="/Panier"> 🛒 Panier</a>
                    {session.isLogged ? (
                        <>
                            <a className="liens" href="/Compte">Mon compte {session.id}</a>
                            <a onClick={logout} className="liens">Se déconnnecter</a>
                        </>
                    ) : (
                        <a className="liens" href="/login">Se connecter</a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
