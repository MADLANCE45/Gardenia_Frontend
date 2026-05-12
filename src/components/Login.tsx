import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState(''); // Nota: controlla se in LoginReq.java si chiama 'password' o 'pwd'
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Chiamata al tuo backend
      const response = await fetch('http://localhost:8080/rest/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: userName, password: password }) 
      });

      if (response.ok) {
        const data = await response.json();
        // Salviamo l'utente nel LocalStorage per ricordarci che è loggato!
        // Ci assicuriamo di salvare anche lo userName perché ci serve per il carrello
        localStorage.setItem('user', JSON.stringify({ ...data, userName: userName }));
        
        // Lo mandiamo alla home
        navigate('/home');
      } else {
        setError('Credenziali non valide. Riprova.');
      }
    } catch (err) {
      setError('Errore di connessione al server.');
    }
  };

  return (
  <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
    <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
      <h2 className="text-center mb-4 text-success">Bentornato</h2>
      { }
    
    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Username</label>
          <input 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        <button type="submit" style={{ padding: '10px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Non hai un account? <Link to="/register">Registrati qui</Link>
      </p>
    </div>
    </div>
  
  );
};

export default Login;