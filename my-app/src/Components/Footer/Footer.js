import React from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Assurez-vous d'installer react-icons

const Footer = () => {
  return (
    <footer className="contentFooter">
      <div className="footer-top">
        <div className="texte-footer">
          <span>© 2024 Animalia. Tous droits réservés.</span>
        </div>
        <div className="social-icons">
          <a href="https://facebook.com" className="social-icon"><FaFacebook /></a>
          <a href="https://twitter.com" className="social-icon"><FaTwitter /></a>
          <a href="https://instagram.com" className="social-icon"><FaInstagram /></a>
        </div>
      </div>
      <div className="footer-bottom">
        <a href="/privacy-policy" className="privacy-policy">Politique de confidentialité</a>
      </div>
    </footer>
  );
}

export default Footer;
