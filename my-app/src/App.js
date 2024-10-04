import { SessionContext, SessionProvider } from './Components/SessionContext'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import React from 'react'
import axios from 'axios'
import Navbar from './Components/Navbar/Navbar'
import ListProduits from './Components/ListProduits/ListProduits'
import ProduitPage from './Components/ProduitPage/ProduitPage'
import Footer from './Components/Footer/Footer'
import Login from './Components/Login/Login'
import SignUp from './Components/Register/Register'
import Panier from './Components/Panier/Panier'
import './App.css'
import PageAdmin from './Components/PageAdmin/PageAdmin'
import EmployePage from './Components/EmployePage/EmployePage'


axios.defaults.withCredentials = true;

function App() {

  
  return (
    <div className="page-content">
      <SessionProvider>
      <Navbar />
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<ListProduits />} />
            <Route path="/produit/:nom/:id" element={<ProduitPage />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/admin" element={<PageAdmin />} />
            <Route path="/employe" element={<EmployePage/>} />
          </Routes>
        </div>
      </Router>
      <Footer />
      </SessionProvider>
    </div>
  )
}

export default App;
