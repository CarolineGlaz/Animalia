import React, { useContext } from 'react';
//import { UserContext } from '../UserContext';

const Navbar = () => {
    const user = null;

    return (
        <nav className="navbar">
            <div className='liensContainer'>
                <a href="/" className='logoNavbar'>Animalia</a>
                <a className='liens' href="/produits">Mes commandes</a>
                <a className='liens' href="/Compte">Mon compte</a>
                <a className='liens' href="/Panier">Panier</a>
                {user ? (
                    <li>Welcome, User {user}</li>
                ) : (
                    <li>Loading...</li>
                )}
            </div>
        </nav>
    );
};

export default Navbar;