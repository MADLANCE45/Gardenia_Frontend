import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 
import { CartProvider } from './context/CartContext'; // <-- IMPORTA QUESTO

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* Avvolgiamo l'App nel Provider */}
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);