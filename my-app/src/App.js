import React from 'react';
import Navbar from './Components/Navbar/Navbar'
import ListProduits from './Components/ListProduits/ListProduits'
import Footer from './Components/Footer/Footer'
import Login from './Components/Login/Login'
import SignUp from './Components/Register/Register'
import SessionComponent from './Components/SessionComponent'
import { UserProvider } from './Components/UserContext';


function App() {
  return (
    <div className="App">
      <UserProvider>
        <SessionComponent />
      </UserProvider>
    </div>
  );
}

export default App;
