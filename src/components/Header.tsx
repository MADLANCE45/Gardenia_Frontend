import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; // Importa il context

const Header: React.FC = () => {
  // Estraiamo il numero del carrello dal "Super Genitore"
  const { cartCount } = useContext(CartContext);

  return (
    <header style={{ 
      padding: '10px 20px', 
      background: '#2e7d32', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <div className="logo">
        <Link to="/home" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '24px' }}>
          GARDENIA
        </Link>
      </div>

      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
        
        {/* IL CARRELLO REATTIVO */}
        <Link to="/cart" style={{ color: 'white', textDecoration: 'none', position: 'relative' }}>
          🛒 Carrello 
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-10px',
              right: '-15px',
              background: 'red',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 6px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {cartCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
};

export default Header;