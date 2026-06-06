import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import './UserLayout.css'; // Ora questo file esiste e non darà errore!

const UserLayout: React.FC = () => {
  return (
    <div className="user-dashboard-container">
      <div className="dashboard-grid">
        <UserSidebar />
        <div className="content-box">
          {/* L'Outlet carica la pagina Ordini, Indirizzi, ecc. */}
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default UserLayout;