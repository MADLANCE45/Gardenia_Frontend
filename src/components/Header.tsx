import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; // Importiamo il Context

const Header: React.FC = () => {
  // Leggiamo il cartCount globalmente dal Context, non più dalle props!
  const { cartCount } = useContext(CartContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1b5e20', padding: '10px 5%' }}>
      <div className="container-fluid p-0">
        <Link className="navbar-brand d-flex align-items-center gap-3" to="/home">
          <img 
            src="/logo.png" 
            alt="Logo Gardenia" 
            style={{ 
              height: '60px', 
              width: '60px', 
              objectFit: 'contain',
              borderRadius: '50%',
              backgroundColor: 'white',
              padding: '2px'
            }} 
          />
          <span className="fw-bold fs-2 text-white" style={{ letterSpacing: '1px' }}>Gardenia</span>
        </Link>
        
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link fs-5 text-white" to="/login">Accedi</Link>
            </li>
            <li className="nav-item ms-4">
              <Link className="btn btn-light text-success fw-bold position-relative" to="/carrello" style={{ borderRadius: '25px', padding: '10px 25px' }}>
                🛒 Carrello
                {/* Usiamo cartCount dal context */}
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;