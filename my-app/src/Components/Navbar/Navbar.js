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

    const handleLogout = () => {
        logout()
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
                            {session.role === 'ROLE_ADMIN' && (
                                <a className="liens" href="/Admin">Pannel Admin</a>
                            )}
                            <a onClick={handleLogout} className="liens">Se déconnecter</a>
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
