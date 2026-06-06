import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './UserSidebar.css';

const UserSidebar: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="sidebar-box shadow-sm border-0 rounded-4 bg-white p-4 d-flex flex-column h-100">
      <div className="text-center mb-4 pb-3 border-bottom">
         <h4 className="fw-bold text-success mb-0">Il Mio Account</h4>
      </div>
      
      <nav className="nav-menu d-flex flex-column gap-2 mb-4">
        <NavLink to="/user/orders" className={({ isActive }) => `nav-item btn btn-light text-start fw-semibold py-3 px-3 ${isActive ? 'active-nav-btn border-success border-2 border-start' : ''}`}>
          <i className="bi bi-box-seam fs-5 me-3 text-success"></i> I Miei Ordini
        </NavLink>
        
        <NavLink to="/user/address" className={({ isActive }) => `nav-item btn btn-light text-start fw-semibold py-3 px-3 ${isActive ? 'active-nav-btn border-success border-2 border-start' : ''}`}>
          <i className="bi bi-geo-alt fs-5 me-3 text-success"></i> I Miei Indirizzi
        </NavLink>
        
        <NavLink to="/user/profile" className={({ isActive }) => `nav-item btn btn-light text-start fw-semibold py-3 px-3 ${isActive ? 'active-nav-btn border-success border-2 border-start' : ''}`}>
          <i className="bi bi-person-gear fs-5 me-3 text-success"></i> Modifica Profilo
        </NavLink>
      </nav>

      {/* Pulsante Logout Testuale Minimale */}
      <div className="mt-auto text-center border-top pt-3">
        <span onClick={handleLogout} className="logout-simple-text">
          Logout
        </span>
      </div>
    </div>
  );
};

export default UserSidebar;