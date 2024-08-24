import React, { useContext } from 'react';
//import { UserContext } from '../UserContext';
import './Navbar.css'

const Navbar = () => {
    const user = null

    return (
        <nav className="navbar">
            <div className='logoContainer'>
                <a href="/" className='logoNavbar'>Animalia</a>
            </div>
            <div className='liensContainer'>
                
                
                <a className='liens' href="/Panier"> 🛒 Panier</a>
                {user ? (
                    <a className='liens' href="/Compte">Mon compte</a>
                ) : (
                    <a className='liens' href="/login">Se connecter</a>
                )}
            </div>
        </nav>
    );
    
}

export default Navbar;