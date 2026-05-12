import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  // Queste sono le variabili che mancavano e che causavano l'errore
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Questa è la funzione che gestisce il click su "Entra"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:8080/rest/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pwd: password })
      });

      if (!response.ok) {
        throw new Error('Credenziali non valide');
      }

      const data = await response.json(); 
      login(data);
      navigate('/home'); 

    } catch (error: any) {
      setErrorMsg("Errore di connessione o credenziali errate. Riprova.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', width: '100%' }}>
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px', border: '1px solid #eee' }}>
        <h2 className="text-center mb-4" style={{ color: '#035826', fontWeight: 'bold' }}>Accedi</h2>
        
        {errorMsg && <div className="alert alert-danger py-2 text-center">{errorMsg}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn w-100 fw-bold text-white" style={{ backgroundColor: '#035826', padding: '10px' }}>
            Entra
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;