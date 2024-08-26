import React, { useContext } from 'react';
import './Navbar.css'
import { SessionContext } from '../SessionContext';

const Navbar = () => {
    const { session } = useContext(SessionContext);

    return (
        <nav className="navbar">
            <div className='logoContainer'>
                <a href="/" className='logoNavbar'>Animalia</a>
            </div>
            <div className='liensContainer'>
                
                
                <a className='liens' href="/Panier"> 🛒 Panier</a>
                { session.isLogged ? (
                    <a className='liens' href="/Compte">Mon compte {session.id}</a>
                ) : (
                    <a className='liens' href="/login">Se connecter</a>
                )}
            </div>
        </nav>
    );
    
}

export default Navbar;