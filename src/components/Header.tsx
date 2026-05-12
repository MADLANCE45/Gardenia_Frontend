import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; 

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { cartCount } = useContext(CartContext);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <nav className="navbar navbar-dark" style={{ backgroundColor: '#1b5e20', padding: '10px 5%' }}>
      {/* d-flex e justify-content-between forzano la separazione destra/sinistra */}
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* GRUPPO SINISTRA: Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-3" to="/home">
          <img 
            src="/logo.jpg" 
            alt="Logo Gardenia" 
            style={{ 
              height: '55px', width: '55px', objectFit: 'cover', 
              borderRadius: '50%', border: '2px solid white'
            }} 
          />
          <span className="fw-bold fs-3 text-white">Gardenia</span>
        </Link>

        {/* GRUPPO DESTRA: Utente e Carrello */}
        <div className="d-flex align-items-center gap-4">
          
          {/* Sezione Profilo Utente */}
          {user ? (
            <div className="d-flex align-items-center gap-3 text-white">
              <span className="d-none d-sm-inline">Ciao, <strong>{user.userName}</strong></span>
              <button onClick={handleLogout} className="btn btn-outline-light btn-sm" style={{ borderRadius: '20px' }}>
                Logout
              </button>
            </div>
          ) : (
            <Link className="nav-link text-white fw-bold" to="/login">Accedi</Link>
          )}

          {/* Tasto Carrello */}
          <Link 
            className="btn btn-light text-success fw-bold position-relative d-flex align-items-center gap-2" 
            to="/carrello" 
            style={{ borderRadius: '25px', padding: '8px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
          >
            <span>🛒</span>
            <span className="d-none d-md-inline">Carrello</span>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Header;