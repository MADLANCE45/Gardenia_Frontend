import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  cartCounter: number;
}

const Header: React.FC<HeaderProps> = ({ cartCounter }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1b5e20', padding: '15px 5%' }}>
      <div className="container-fluid">
        
        {/* LOGO E TITOLO AGGIORNATI QUI */}
        <Link className="navbar-brand d-flex align-items-center gap-3" to="/">
          <img 
            src="/logo.jpg" /* Se l'hai messa in public/img/logo.jpg, scrivi /img/logo.jpg */
            alt="Logo Gardenia" 
            style={{ 
              height: '55px', 
              width: '55px', 
              objectFit: 'cover', 
              borderRadius: '50%', /* Questo rende l'immagine rotonda. Se la vuoi quadrata, cancella questa riga */
              border: '2px solid white', /* Bordino bianco elegante per farla staccare dal verde scuro */
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)' /* Piccola ombra */
            }} 
          />
          <span className="fw-bold fs-3 text-white" style={{ letterSpacing: '1px' }}>Gardenia</span>
        </Link>
        
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link fs-5 text-white" to="/login">Accedi</Link>
            </li>
            <li className="nav-item ms-3">
              <Link className="btn btn-light text-success fw-bold position-relative" to="/carrello" style={{ borderRadius: '25px', padding: '8px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                🛒 Carrello
                {cartCounter > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCounter}
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