import React from 'react';
import Navbar from './Components/Navbar/Navbar'
import ListProduits from './Components/ListProduits/ListProduits'
import ProduitPage from './Components/ProduitPage/ProduitPage'

import Footer from './Components/Footer/Footer'
import Login from './Components/Login/Login'
import SignUp from './Components/Register/Register'
import { SessionContext, SessionProvider } from './Components/SessionContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Panier from './Components/Panier/Panier';
import './App.css'

import axios from 'axios';

axios.defaults.withCredentials = true;

function App() {

  
  return (
    <div className="App">
      <SessionProvider>
      <Navbar />
      <Router>
        <div className="page-content">
          <Routes>
            <Route path="/" element={<ListProduits />} />
            <Route path="/produit/:nom/:id" element={<ProduitPage />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
      <Footer />
      </SessionProvider>
    </div>
  );
}

export default App;
