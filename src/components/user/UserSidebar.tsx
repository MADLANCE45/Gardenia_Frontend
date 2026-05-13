import React from 'react';
import { NavLink } from 'react-router-dom';
import './UserSidebar.css';

const UserSidebar: React.FC = () => {
  return (
    <div className="sidebar-box">
      <h3 className="welcome-msg">My Account</h3>
      <nav className="nav-menu">
       <NavLink to="/user/orders" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
  📦      My Orders
        </NavLink>
        <NavLink to="/user/address" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          📍 My Addresses
        </NavLink>
        
        <NavLink to="/user/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          👤 Edit Profile
        </NavLink>
        {/* Pulsante Logout di design */}
        <div className="nav-item logout" style={{ cursor: 'pointer' }}>
          🚪 Logout
        </div>
      </nav>
    </div>
  );
};

export default UserSidebar;