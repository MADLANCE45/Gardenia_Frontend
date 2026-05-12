import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/rest/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, email, password, role: 'USER' }) // Aggiusta in base al tuo DTO Java
      });

      if (response.ok) {
        alert("Registrazione completata! Ora puoi accedere.");
        navigate('/login');
      } else {
        setError('Errore durante la registrazione. Forse l\'utente esiste già?');
      }
    } catch (err) {
      setError('Errore di connessione al server.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center w-100" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
        <h2 className="text-center mb-4 text-success fw-bold">Crea Account</h2>
        
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleRegister} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label fw-bold">Username</label>
            <input type="text" className="form-control" value={userName} onChange={(e) => setUserName(e.target.value)} required />
          </div>
          <div>
            <label className="form-label fw-bold">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="form-label fw-bold">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          
          <button type="submit" className="btn btn-success mt-2 fw-bold" style={{ padding: '10px' }}>
            Registrati
          </button>
        </form>
        
        <p className="text-center mt-4">
          Hai già un account? <Link to="/login" className="text-success fw-bold">Accedi</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;