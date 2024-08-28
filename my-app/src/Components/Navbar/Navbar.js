import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = null;

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
                    {user ? (
                        <a className="liens" href="/Compte">Mon compte</a>
                    ) : (
                        <a className="liens" href="/login">Se connecter</a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
