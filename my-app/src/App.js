import React from 'react';
import Navbar from './Components/Navbar/Navbar'
import ListProduits from './Components/ListProduits/ListProduits'
import ProduitPage from './Components/ProduitPage/ProduitPage'

import Footer from './Components/Footer/Footer'
import Login from './Components/Login/Login'
import SignUp from './Components/Register/Register'
import SessionComponent from './Components/SessionComponent'
import { UserProvider } from './Components/UserContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<ListProduits />} />
          <Route path="/produit/:nom/:id" element={<ProduitPage />} />
        </Routes>
      </Router>

      <Footer />
    </div>
  );
}

export default App;
