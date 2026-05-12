import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ProductDetails from './components/ProductDetails';

function App() {
  const [cartCounter, setCartCounter] = useState(0);

  return (
    <Router>
      <Header cartCounter={cartCounter} />
      
      {/* ABBIAMO RIMOSSO IL className="container" PER OCCUPARE TUTTA LA PAGINA */}
      <div style={{ width: '100%' }}>
        <Routes>
          <Route path="/" element={<Home setCartCounter={setCartCounter} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;