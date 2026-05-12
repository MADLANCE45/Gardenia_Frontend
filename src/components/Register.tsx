import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  // NOTA: I nomi devono essere uguali al tuo DTO UserReq.java
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    userName: '', 
    email: '',
    pwd: '', // Controlla se in UserReq.java si chiama 'pwd' o 'password'
    telefono: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Chiamata alla tua rotta Java
      const response = await fetch('http://localhost:8080/rest/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Registrazione completata! Ora puoi fare il login.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage('Errore durante la registrazione.');
      }
    } catch (error) {
      setMessage('Errore di connessione al server.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2>Registrati</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" name="nome" placeholder="Nome" onChange={handleChange} required />
        <input type="text" name="cognome" placeholder="Cognome" onChange={handleChange} required />
        <input type="text" name="userName" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        {/* Assicurati che il 'name' combaci con la variabile Java */}
        <input type="password" name="pwd" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="telefono" placeholder="Telefono" onChange={handleChange} />
        <button type="submit" style={{ background: '#2e7d32', color: 'white', padding: '10px' }}>Registrati</button>
      </form>
      <Link to="/login">Torna al Login</Link>
    </div>
  );
};

export default Register;