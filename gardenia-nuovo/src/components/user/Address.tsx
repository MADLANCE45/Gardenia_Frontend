import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Address.css';

// 1. INTERFACCIA AGGIORNATA CON I CAMPI ESATTI DEL TUO SPRING BOOT
interface Indirizzo {
  id?: number;
  country: string;
  city: string;
  postalCode: string | number;
  street: string;
  number: string | number;
}

const Address: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [addresses, setAddresses] = useState<Indirizzo[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Indirizzo>({ 
    country: 'Italia', // Default per comodità
    city: '', 
    postalCode: '', 
    street: '', 
    number: '' 
  });

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:8080/rest/address/myAddresses?userName=${user.userName}`);
      if (response.ok) {
        const data = await response.json();
        setAddresses(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Errore recupero indirizzi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setFormData({ country: 'Italia', city: '', postalCode: '', street: '', number: '' });
    setIsModalOpen(true);
  };

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Usiamo l'endpoint corretto con i campi esatti
      const response = await fetch(`http://localhost:8080/rest/address/create?userName=${user.userName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Convertiamo in numero se necessario, altrimenti Spring Boot andrà in errore
          ...formData,
          number: Number(formData.number),
          postalCode: Number(formData.postalCode)
        }) 
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchAddresses(); 
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(errData.msg || "Errore durante il salvataggio dell'indirizzo");
      }
    } catch (error) {
      console.error("Errore salvataggio:", error);
    }
  };

  const deleteAddress = async (id: number | undefined) => {
    // 1. Controllo di sicurezza se l'ID non esiste
    if (id === undefined) {
      alert("Errore: Impossibile trovare l'ID di questo indirizzo.");
      return;
    }

    if (!window.confirm("Sei sicuro di voler eliminare questo indirizzo?")) return;
    
    try {
      // 2. Forza la conversione a numero (per evitare che venga inviato come stringa "1" invece di 1)
      const idNumber = Number(id);

      const response = await fetch(`http://localhost:8080/rest/address/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(idNumber) 
      });

      if (response.ok) {
        fetchAddresses(); // Aggiorna la lista se va a buon fine
      } else {
        // 3. Se fallisce, leggiamo e mostriamo L'ERRORE ESATTO che ci manda Spring Boot
        const errData = await response.json().catch(() => ({}));
        alert("Il server ha rifiutato l'eliminazione. Errore: " + (errData.msg || response.statusText));
      }
    } catch (error) {
      console.error("Errore eliminazione:", error);
      alert("Errore di connessione al server durante l'eliminazione.");
    }
  };

  if (loading) return <div className="loading-message">Caricamento indirizzi...</div>;

  return (
    <div className="address-container">
      <div className="address-header-row">
        <div>
          <h2 className="page-title">My Addresses</h2>
          <p className="page-subtitle">Gestisci gli indirizzi di spedizione e fatturazione.</p>
        </div>
        <button className="add-address-btn" onClick={openAddModal}>
          + Aggiungi Indirizzo
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="empty-state">
          <p>Non hai ancora aggiunto nessun indirizzo di spedizione.</p>
        </div>
      ) : (
        <div className="address-list">
          {addresses.map((addr, index) => (
            <div key={addr.id || index} className="address-card">
              <div className="card-header">
                <div className="user-name">{user?.firstName} {user?.lastName}</div>
                {index === 0 && <div className="badge-shipping">Principale</div>}
              </div>
              
              {/* STAMPIAMO I DATI CON I NUOVI NOMI */}
              <div className="address-details">
                {addr.street}, {addr.number} <br />
                {addr.postalCode} {addr.city} ({addr.country})
              </div>
              
              <div className="card-actions">
                <span className="action-link text-danger" onClick={() => deleteAddress(addr.id)}>
                  Elimina 🗑️
              </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Nuovo Indirizzo</h3>
            <form onSubmit={saveAddress}>
              <div className="form-group row">
                <div className="input-half">
                  <label>Via / Piazza (Street)</label>
                  {/* name="street" */}
                  <input type="text" name="street" value={formData.street} onChange={handleInputChange} required />
                </div>
                <div className="input-half">
                  <label>Civico (Number)</label>
                  {/* name="number" */}
                  <input type="number" name="number" value={formData.number} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group row">
                <div className="input-half">
                  <label>Città (City)</label>
                  {/* name="city" */}
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div className="input-half">
                  <label>CAP (Postal Code)</label>
                  {/* name="postalCode" */}
                  <input type="number" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Nazione (Country)</label>
                {/* name="country" */}
                <input type="text" name="country" value={formData.country} onChange={handleInputChange} required />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Annulla</button>
                <button type="submit" className="btn-save">Salva Indirizzo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;