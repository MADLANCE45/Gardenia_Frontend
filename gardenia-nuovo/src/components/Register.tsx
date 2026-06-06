import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Se hai un file Register.css, assicurati di importarlo, ad esempio:
// import './Register.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Mappiamo esattamente i dati che vuole Spring Boot / Swagger
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    userName: '',
    password: '',
    confirmPassword: '', // Questo serve solo al frontend per controllo
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Controllo password coincidenti
    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }

    setIsLoading(true);

    // 2. Prepariamo il JSON perfetto da inviare al backend
    const userToCreate = {
      userName: formData.userName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: 'USER' // Impostiamo di default il ruolo USER
    };

    try {
      // Controlla che questo URL sia quello giusto del tuo UserController!
      // Di solito è /rest/user/create o /rest/user/register
      const response = await fetch('http://localhost:8080/rest/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userToCreate) 
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.rc !== false) {
        // Registrazione completata, rimandiamo al login
        alert('Registrazione avvenuta con successo! Ora puoi accedere.');
        navigate('/login');
      } else {
        setError(result.msg || 'Errore durante la registrazione. Forse l\'username o l\'email esistono già?');
      }
    } catch (err) {
      setError('Errore di connessione al server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <h2 className="auth-title">Crea un Account</h2>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          
          <div className="auth-row">
            <div className="auth-col">
              <label>Nome (First Name)</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="auth-col">
              <label>Cognome (Last Name)</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>

          <div className="auth-row">
            <div className="auth-col">
              <label>Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="auth-col">
              <label>Telefono (Phone)</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              name="userName"
              value={formData.userName} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="auth-row">
            <div className="auth-col">
              <label>Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="auth-col">
              <label>Conferma Password</label>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>
          
          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? 'Creazione in corso...' : 'Registrati'}
          </button>
        </form>
        
        <div className="auth-footer">
          Hai già un account? <Link to="/login">Accedi qui</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

