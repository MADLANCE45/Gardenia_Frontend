import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 1. Importa il context

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

    // Leggiamo l'oggetto Resp.java
    const result = await response.json();

    // Verifichiamo il campo 'rc' (reale successo del login nel backend)
    if (response.ok && result.rc === true) {
      // I dati dell'utente sono dentro result.data
      login({ ...result.data, userName: userName }); 
      navigate('/home');
    } else {
      // Mostriamo il messaggio d'errore inviato dal backend (campo 'msg')
      setError(result.msg || 'Credenziali non valide. Riprova.');
    }
  } catch (err) {
    setError('Errore di connessione al server.');
  }
};

  return (
    <div className="d-flex justify-content-center align-items-center w-100" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
        <h2 className="text-center mb-4 text-success fw-bold">Bentornato</h2>
        
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label fw-bold">Username</label>
            <input 
              type="text" 
              className="form-control"
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <label className="form-label fw-bold">Password</label>
            <input 
              type="password" 
              className="form-control"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-success mt-2 fw-bold" style={{ padding: '10px' }}>
            Accedi
          </button>
        </form>
        
        <p className="text-center mt-4">
          Non hai un account? <Link to="/register" className="text-success fw-bold">Registrati qui</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;