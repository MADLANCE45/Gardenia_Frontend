import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Overview.css';

const Overview: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2 className="page-header">Welcome back, {user?.nome}!</h2>
      <p className="page-desc">From your account dashboard you can view your recent orders and manage your account details.</p>
      
      <div className="info-card">
        <h3 className="info-card-title">Profile Info</h3>
        <div className="info-content">
          <strong>Name:</strong>
          <p>{user?.nome} {user?.cognome}</p>
          
          <strong>Username:</strong>
          <p>{user?.userName}</p>
          
          <strong>Role:</strong>
          <p>{user?.ruolo}</p>
          
          {/* Questo bottone ti porterà in futuro al form di modifica profilo */}
          <Link to="/user/profile" className="edit-btn-text">
            Edit Profile ➔
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Overview;