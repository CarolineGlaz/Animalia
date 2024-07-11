import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className='liensContainer'>
        <a href="/" className='logoNavbar'>Animalia</a>
            <a className='liens' href="/produits">Mes commandes</a>
            <a className='liens' href="/Compte">Mon compte</a>
            <a className='liens' href="/Panier">Panier</a>
      </div>
    </nav>
  );
}

export default Navbar;
