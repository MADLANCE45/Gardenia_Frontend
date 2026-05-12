import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  // Variabili di stato necessarie per il form
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  // Funzione che gestisce la registrazione
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Qui andrà la chiamata fetch POST al tuo backend per la registrazione
    console.log("Dati di registrazione pronti:", { nome, cognome, email, password });
    
    // Dopo essersi registrato, lo rimandiamo al login
    navigate('/login');
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh', width: '100%', padding: '20px' }}>
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
        <h2 className="text-center mb-4" style={{ color: '#035826', fontWeight: 'bold' }}>Registrati</h2>
        
        {errorMsg && <div className="alert alert-danger py-2 text-center">{errorMsg}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nome</label>
              <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Cognome</label>
              <input type="text" className="form-control" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn w-100 fw-bold text-white" style={{ backgroundColor: '#035826', padding: '10px' }}>
            Crea Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;