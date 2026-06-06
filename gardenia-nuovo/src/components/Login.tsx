import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 1. Importa il context
import './Auth.css';
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // 2. Estrai la funzione login dal context
  const { login } = useContext(AuthContext); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/rest/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: userName, password: password }) 
      });

      const result = await response.json();

      // Il backend imposta status 200 OK se ha successo, 400 se fallisce.
      // Quindi response.ok è sufficiente!
      if (response.ok) {
        // Il backend invia l'oggetto utente DIRETTAMENTE, non dentro "data"
        login({ ...result, userName: userName }); 
        navigate('/home');
      } else {
        // Se c'è un errore (es. BAD_REQUEST), il backend invia la classe Resp con "msg"
        setError(result.msg || 'Credenziali non valide. Riprova.');
      }
    } catch (err) {
      setError('Errore di connessione al server.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Bentornato</h2>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="auth-btn">
            Accedi
          </button>
        </form>
        
        <div className="auth-footer">
          Non hai un account? <Link to="/register">Registrati qui</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
