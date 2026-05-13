import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './EditProfile.css';

const EditProfile: React.FC = () => {
  const { user } = useContext(AuthContext);
  
  // Stati del form
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Stati di caricamento ed errore
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });

  // Al caricamento, recuperiamo i dati attuali (email e telefono) dal backend
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8080/rest/user/findByUserName?id=${user.userName}`)
        .then(res => res.json())
        .then(data => {
          setEmail(data.email || '');
          setPhone(data.phone || '');
        })
        .catch(err => console.error("Errore recupero dati utente", err));
    }
  }, [user]);

  const toggleVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPwd(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    // Validazioni
    if (password && !currentPassword) {
      return setMessage({ text: 'Inserisci la password corrente se vuoi cambiarla.', type: 'error' });
    }
    if (password && password !== confirmPassword) {
      return setMessage({ text: 'Le nuove password non coincidono.', type: 'error' });
    }

    setIsLoading(true);

    try {
      // 1. Se stiamo cambiando password, verifichiamo la password corrente
      if (password) {
        const loginRes = await fetch('http://localhost:8080/rest/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName: user?.userName, password: currentPassword })
        });
        
        if (!loginRes.ok) {
          throw new Error('La password corrente è errata.');
        }
      }

      // 2. Procediamo all'aggiornamento
      const payload: any = {
        userName: user?.userName,
        email: email,
        phone: phone,
      };
      if (password) payload.password = password;

      const updateRes = await fetch('http://localhost:8080/rest/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (updateRes.ok) {
        setMessage({ text: 'Profilo aggiornato con successo!', type: 'success' });
        // Puliamo i campi delle password
        setCurrentPassword('');
        setPassword('');
        setConfirmPassword('');
      } else {
        const errData = await updateRes.json().catch(() => ({}));
        throw new Error(errData.msg || "Errore durante l'aggiornamento.");
      }
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2 className="page-title">Edit Personal Details</h2>
        <p className="page-subtitle">Aggiorna le tue informazioni di contatto o cambia la password.</p>
      </div>

      <div className="profile-card">
        <form onSubmit={onSubmit} className="profile-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>

          <div className="section-label">
            Change Password <span className="optional">(optional)</span>
          </div>

          <div className="form-group pwd-group">
            <label>Current Password</label>
            <div className="input-with-icon">
              <input 
                type={showPwd.current ? "text" : "password"} 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)} 
              />
              <span className="eye-icon" onClick={() => toggleVisibility('current')}>
                {showPwd.current ? '👁️' : '🙈'}
              </span>
            </div>
          </div>

          <div className="form-group row">
            <div className="input-half pwd-group">
              <label>New Password <small>(Leave blank to keep current)</small></label>
              <div className="input-with-icon">
                <input 
                  type={showPwd.new ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
                <span className="eye-icon" onClick={() => toggleVisibility('new')}>
                  {showPwd.new ? '👁️' : '🙈'}
                </span>
              </div>
            </div>

            <div className="input-half pwd-group">
              <label>Confirm New Password</label>
              <div className="input-with-icon">
                <input 
                  type={showPwd.confirm ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                />
                <span className="eye-icon" onClick={() => toggleVisibility('confirm')}>
                  {showPwd.confirm ? '👁️' : '🙈'}
                </span>
              </div>
            </div>
          </div>

          {message.text && (
            <div className={`alert-message ${message.type === 'error' ? 'error-message' : 'success-message'}`}>
              {message.text}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;