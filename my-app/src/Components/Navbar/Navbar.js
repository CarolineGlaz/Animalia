import React, { useContext, useState } from 'react';
import './Navbar.css';
import { SessionContext } from '../SessionContext';


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { session } = useContext(SessionContext);


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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
                        <a className="liens" href="/Compte">Mon compte {session.id}</a>
                    ) : (
                        <a className="liens" href="/login">Se connecter</a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
