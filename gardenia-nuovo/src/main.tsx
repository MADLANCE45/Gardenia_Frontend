import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { CartProvider } from './context/CartContext.tsx' // Assicurati che il percorso sia giusto

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>,
)