import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext); 

  // Leggiamo i dati veri dal Context
  const isLoggedIn = user !== null;
  const isAdmin = user?.ruolo === 'ADMIN';

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const categories = [
  { id: 1, name: 'Piante' },
  { id: 2, name: 'Alberi' },
  { id: 3, name: 'Strumenti' },
  { id: 4, name: 'Forniture' }
];
  const subcategoriesMap: Record<number, any[]> = {
    1: [{ id: 10, subcategoryName: 'Interno' }, { id: 11, subcategoryName: 'Esterno' }]
  };

  const toggleMenu = (name: string, e: React.MouseEvent) => {
    setActiveMenu(activeMenu === name ? null : name);
  };

  return (
    <header className="main-header">
      <div className="top-banner">
        <div className="container">
          <div className="carousel-wrapper">
             <p className="fade-text">Benvenuti su Gardenia! Scopri le nostre offerte.</p>
          </div>
        </div>
      </div>

      <div className="navbar-main">
        <div className="container navbar-content">
          
          <div className="logo">
            <Link to="/">
              <img src="/logo.png" alt="Logo" className="logo-img logo-small" />
            </Link>
          </div>

          <nav className="nav-menu">
            <ul>
              {categories.map((category) => (
                <li 
                  key={category.id} 
                  className={`has-dropdown ${activeMenu === category.name ? 'open' : ''}`}
                >
                  <div className="menu-container" onMouseLeave={() => setActiveMenu(null)}>
                    <a 
                      href="#" 
                      onMouseEnter={(e) => toggleMenu(category.name, e)}
                      onClick={(e) => e.preventDefault()}
                    >
                      {category.name} <span className="arrow">▼</span>
                    </a>
                    <ul className="submenu" onClick={(e) => e.stopPropagation()}>
                      {subcategoriesMap[category.id]?.map((sub) => (
                        <li key={sub.id}>
                          <Link to={`/category/${category.name}/${sub.subcategoryName}?subcategoryId=${sub.id}`}>
                            {sub.subcategoryName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}

              <li><Link to="/about-us">About Us</Link></li>
            </ul>
          </nav>
              
          <div className="user-actions">
  {/* Il blocco Wishlist è stato rimosso completamente */}

  <Link to="/carrello" className="action-link cart-link">
    <div className="icon-container">
      <i className="bi bi-cart3"></i>
      {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
    </div>
    <span>Cart</span>
  </Link>

  {isAdmin && (
    <Link to="/admin" className="action-link">
      <i className="bi bi-shield-lock"></i>
      <span>Admin</span>
    </Link>
  )}

  {isLoggedIn ? (
    <>
      <Link to="/user/overview" className="action-link text-decoration-none">
        <i className="bi bi-person-circle text-success fs-4"></i>
        {/* Usiamo user.nome che ora verrà popolato correttamente */}
        <span className="fw-bold" style={{ fontSize: '14px' }}>Ciao, {user?.nome}</span> 
      </Link>
      <button onClick={logout} className="action-link btn-logout">
        <i className="bi bi-box-arrow-right text-danger fs-5"></i>
        <span style={{ fontSize: '13px' }}>Logout</span>
      </button>
    </>
  ) : (
    <Link to="/login" className="action-link">
      <i className="bi bi-person"></i>
      <span>Accedi</span>
    </Link>
  )}
</div>
        </div>
      </div>
    </header>
  );
};

export default Header;