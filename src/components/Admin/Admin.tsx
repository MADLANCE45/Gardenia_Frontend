import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Admin.css';

const Admin: React.FC = () => {
  const { user } = useContext(AuthContext);
  
  // Modifica qui per usare il numero 0
  const isAdmin = user?.role === 'ADMIN';

  // ... resto del codice ...

  const [activeView, setActiveView] = useState<'users' | 'products' | 'orders'>('users');
  
  // Stati per memorizzare i dati dal backend
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Stato per gestire i cambiamenti di status degli ordini prima della conferma
  const [pendingStatusChanges, setPendingStatusChanges] = useState<{ [orderId: number]: string }>({});

  // Usa useEffect per caricare i dati ogni volta che cambi vista
  useEffect(() => {
    if (!isAdmin) return;

    if (activeView === 'users') loadUsers();
    else if (activeView === 'products') loadProducts();
    else if (activeView === 'orders') loadOrders();
  }, [activeView, isAdmin]);

  // --- FUNZIONI DI FETCH ---
  const loadUsers = () => {
    fetch('http://localhost:8080/rest/user/list')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Errore utenti:", err));
  };

  const loadProducts = () => {
    fetch('http://localhost:8080/rest/product/list')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Errore prodotti:", err));
  };

  const loadOrders = () => {
    fetch('http://localhost:8080/rest/userorder/list')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Errore ordini:", err));
  };

  // --- AZIONI SEMPLIFICATE ---
  const deleteUser = (username: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare l'utente ${username}?`)) {
      console.log("Eliminazione utente:", username);
      // Scommenta questa riga quando il backend per eliminare l'utente è pronto
      // fetch(`http://localhost:8080/rest/user/delete/${username}`, { method: 'DELETE' }).then(loadUsers);
    }
  };

  const deleteProduct = (id: number) => {
    if (window.confirm(`Sei sicuro di voler eliminare il prodotto ID ${id}?`)) {
      fetch(`http://localhost:8080/rest/product/delete/${id}`, { method: 'DELETE' })
        .then(() => loadProducts());
    }
  };

  const onStatusChange = (orderId: number, newStatus: string) => {
    setPendingStatusChanges(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const confirmOrderStatus = (order: any) => {
    const newStatus = pendingStatusChanges[order.id];
    if (!newStatus) return;

    const updatedOrder = { ...order, status: newStatus };
    fetch('http://localhost:8080/rest/userorder/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedOrder)
    })
    .then(() => {
      alert("Stato aggiornato con successo!");
      loadOrders();
      // Rimuovi dalla lista dei pendenti
      const newPendings = {...pendingStatusChanges};
      delete newPendings[order.id];
      setPendingStatusChanges(newPendings);
    })
    .catch(err => console.error("Errore update ordine:", err));
  };

  // Se non è admin, mostra la schermata di errore
  if (!isAdmin) {
    return (
      <div className="access-denied text-center mt-5" style={{ minHeight: '60vh' }}>
        <h1 className="text-danger">Accesso Negato</h1>
        <p>Devi avere i privilegi di amministratore per accedere a questa pagina.</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-layout">
        
        {/* SIDEBAR ADMIN (A Sinistra) */}
        <aside className="admin-sidebar">
          <h2 className="admin-title">Admin Panel</h2>
          <nav className="admin-nav">
            <button className={`nav-btn ${activeView === 'users' ? 'active' : ''}`} onClick={() => setActiveView('users')}>Utenti</button>
            <button className={`nav-btn ${activeView === 'products' ? 'active' : ''}`} onClick={() => setActiveView('products')}>Prodotti</button>
            <button className={`nav-btn ${activeView === 'orders' ? 'active' : ''}`} onClick={() => setActiveView('orders')}>Ordini</button>
          </nav>
        </aside>

        {/* CONTENUTO PRINCIPALE (A Destra) */}
        <div className="admin-content-wrapper">
          
          {/* HEADER INTERNO CON LOGO SCUDO */}
          <div className="admin-welcome-header d-flex align-items-center mb-4">
            <div className="admin-logo-circle">
              <i className="bi bi-shield-lock-fill"></i>
            </div>
            <div className="ms-3">
              <h1 className="m-0" style={{ fontSize: '24px' }}>Dashboard Amministratore</h1>
              <p className="text-muted m-0">Gestione totale del sistema Gardenia</p>
            </div>
          </div>

          {/* SEZIONE UTENTI */}
          {activeView === 'users' && (
            <div className="admin-section">
              <h2>Lista Utenti</h2>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nome</th><th>Username</th><th>Email</th><th>Ruolo</th><th>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                        <tr key={u.userName}>
                        {/* Usiamo firstName e lastName invece di nome e cognome */}
                        <td>{u.firstName} {u.lastName}</td>
                        <td>{u.userName}</td>
                        <td>{u.email}</td>
                         {/* Usiamo role invece di ruolo */}
                        <td>{u.role}</td>
                        <td>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.userName)}>Elimina</button>
                        </td>
                        </tr>
                             ))}
                        {users.length === 0 && <tr><td colSpan={5} className="text-center">Nessun utente trovato</td></tr>}

                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SEZIONE PRODOTTI */}
          {activeView === 'products' && (
            <div className="admin-section">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Lista Prodotti</h2>
                <button className="btn btn-success" onClick={() => alert("Funzione Crea Prodotto da implementare!")}>+ Nuovo Prodotto</button>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>Nome</th><th>Prezzo</th><th>Stock</th><th>Sottocategoria</th><th>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>€ {(p.price || 0).toFixed(2)}</td>
                        <td className={p.stock < 5 ? 'text-danger fw-bold' : ''}>{p.stock}</td>
                        <td>{p.subcategory?.name || p.subcategoryName}</td>
                        <td>
                          <button className="btn btn-sm btn-warning me-2" onClick={() => alert("Modifica in sviluppo")}>Modifica</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(p.id)}>Elimina</button>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && <tr><td colSpan={6} className="text-center">Nessun prodotto trovato</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SEZIONE ORDINI */}
          {activeView === 'orders' && (
            <div className="admin-section">
              <h2>Lista Ordini</h2>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID Ordine</th><th>ID Utente</th><th>Data</th><th>Totale</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{o.user?.id || o.userId}</td>
                        <td>{o.date}</td>
                        <td>€ {(o.totalPrice || 0).toFixed(2)}</td>
                        <td>
                          <div className="d-flex gap-2 align-items-center">
                            <select 
                              className="form-select form-select-sm"
                              value={pendingStatusChanges[o.id] || o.status}
                              onChange={(e) => onStatusChange(o.id, e.target.value)}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                            </select>
                            <button 
                              className="btn btn-sm btn-primary"
                              disabled={!pendingStatusChanges[o.id] || pendingStatusChanges[o.id] === o.status}
                              onClick={() => confirmOrderStatus(o)}
                            >
                              Conferma
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && <tr><td colSpan={5} className="text-center">Nessun ordine trovato</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Admin;