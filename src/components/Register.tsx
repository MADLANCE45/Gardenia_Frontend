import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css'; // Usiamo il CSS globale o creane uno specifico come register.css

const Register: React.FC = () => {
  const navigate = useNavigate();

  // 1. STATO DEL FORM (tutti i campi necessari per il tuo DTO UserReq in Java)
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    username: '',
    email: '',
    password: '',
    numeroTelefono: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 2. GESTIONE DELL'INSERIMENTO
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Aggiorna solo il campo che stiamo digitando, mantenendo intatti gli altri
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // 3. GESTIONE DEL SUBMIT (Chiamata POST al server)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Sostituisci questo URL con l'endpoint corretto del tuo UserController di Spring
      const response = await fetch('http://localhost:8080/api/users/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage('Registrazione completata con successo! Ora puoi accedere.');
        setTimeout(() => {
          navigate('/login'); // Dopo 2 secondi ti manda al login
        }, 2000);
      } else {
        setErrorMessage('Errore durante la registrazione. Forse l\'email esiste già?');
      }
    } catch (error) {
      console.error("Errore di connessione:", error);
      setErrorMessage('Impossibile contattare il server.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', color: '#2e7d32' }}>Crea un Account Gardenia</h2>
      
      {successMessage && <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label>Nome</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div>
          <label>Cognome</label>
          <input type="text" name="cognome" value={formData.cognome} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div>
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div>
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div>
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div>
          <label>Numero di Telefono</label>
          <input type="tel" name="numeroTelefono" value={formData.numeroTelefono} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <button type="submit" style={{ padding: '10px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Registrati
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Hai già un account? <Link to="/login">Accedi qui</Link>
      </p>
    </div>
  );
};

export default Register;