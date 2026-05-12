import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ProductDetails from './components/ProductDetails';
import Carrello from './components/Carrello';

function App() {
  // NOTA: Abbiamo rimosso cartCounter da qui perché ora usiamo il CartContext!

  return (
    <Router>
      {/* L'Header ora legge il carrello da solo tramite useContext */}
      <Header /> 
      
      <div style={{ width: '100%', minHeight: '80vh' }}>
        <Routes>
          {/* Reindirizziamo la root alla home o al login */}
          <Route path="/" element={<Navigate to="/home" />} />
          
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/carrello" element={<Carrello />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;