import React from 'react';
import Navbar from './Components/Navbar/Navbar'
import ListProduits from './Components/ListProduits/ListProduits'
import Footer from './Components/Footer/Footer'
import Login from './Components/Login/Login'
import SignUp from './Components/Register/Register'


function App() {
  return (
    <div className="App">
      <Navbar />
        <ListProduits />
        <Login />
        <SignUp />
      <Footer />
    </div>
  );
}

export default App;
