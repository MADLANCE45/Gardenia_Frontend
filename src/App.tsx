import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header'; 
import Login from './components/Login';
import Register from './components/Register.tsx';
import Home from './components/Home.tsx';
import ProductDetails from './components/ProductDetails.tsx';

function App() {
  return (
    <BrowserRouter>
      {/* L'Header sta fuori da Routes, così è visibile in ogni pagina */}
      <Header /> 
      
      <main style={{ minHeight: '80vh', padding: '20px' }}>
        <Routes>
          {/* Rotta di default */}
          <Route path="/" element={<Navigate to="/login" />} /> 
          
          {/* Le nostre pagine */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />

          {/* ROTTA CORRETTA PER IL DETTAGLIO PRODOTTO */}
          <Route path="/product/:id" element={<ProductDetails />} />

        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;