import React, { useContext, useState } from 'react'
import { SessionContext } from '../SessionContext'
import './Navbar.css'
import axios from 'axios'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { session, logout } = useContext(SessionContext)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout()
            window.location.href = '/';
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    }

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
                            {session.isAdmin && (
                                <a className="liens" href="/admin">Pannel Admin</a>
                            )}
                             {session.isEmploye && (
                                <a className="liens" href="/employe">Pannel Employé</a>
                            )}
                            <a onClick={handleLogout} href="/" className="liens">Se déconnecter</a>
                        </>
                    ) : (
                        <a className="liens" href="/login">Se connecter</a>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
