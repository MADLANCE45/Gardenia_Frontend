import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Admin.css';

const Admin: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Gestione flessibile del ruolo (stringa "ADMIN" o numero 0)
  const isAdmin = user?.role === 'ADMIN' || String(user?.role) === '0';

  const [activeView, setActiveView] = useState<'users' | 'products' | 'orders'>('users');
  
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [pendingStatusChanges, setPendingStatusChanges] = useState<{ [orderId: number]: string }>({});

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: 0, stock: 0, subcategoryId: 1, imageUrl: ''
  });

  // Caricamento dati basato sulla vista attiva
  useEffect(() => {
    if (!isAdmin) return;

    if (activeView === 'users') loadUsers();
    if (activeView === 'products') loadProducts();
    if (activeView === 'orders') loadOrders();
  }, [activeView, isAdmin]);

  // --- API CALLS (CORRETTE CON rest/order) ---
  const loadUsers = () => fetch('http://localhost:8080/rest/user/list').then(res => res.json()).then(setUsers);
  const loadProducts = () => fetch('http://localhost:8080/rest/product/list').then(res => res.json()).then(setProducts);
  
  // URL CORRETTO: rest/order/list
  const loadOrders = () => {
    fetch('http://localhost:8080/rest/order/list')
      .then(res => res.json())
      .then(data => {
        console.log("Ordini ricevuti:", data);
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Errore caricamento ordini:", err));
  };

  const deleteUser = (username: string) => {
    if (window.confirm(`Eliminare l'utente ${username}?`)) {
      fetch(`http://localhost:8080/rest/user/delete?userName=${username}`, { method: 'DELETE' })
        .then(res => res.ok ? loadUsers() : alert("Errore eliminazione utente."));
    }
  };

  const deleteProduct = (id: number) => {
    if (window.confirm(`Eliminare prodotto ID ${id}?`)) {
      fetch(`http://localhost:8080/rest/product/delete?id=${id}`, { method: 'DELETE' })
        .then(res => res.ok ? loadProducts() : alert("Errore o prodotto in uso (verrà fatto Soft Delete)."));
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingProduct?.id || null,
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      subcategoryId: Number(productForm.subcategoryId),
      isDeleted: false
    };

    const url = editingProduct ? 'http://localhost:8080/rest/product/update' : 'http://localhost:8080/rest/product/create';
    const res = await fetch(url, {
      method: editingProduct ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      if (productForm.imageUrl) {
        const data = await res.json();
        const pId = editingProduct?.id || data.id;
        await fetch('http://localhost:8080/rest/image/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: pId, link: productForm.imageUrl })
        });
      }
      setShowProductModal(false);
      loadProducts();
    }
  };

  const confirmOrderStatus = (order: any) => {
    const newStatus = pendingStatusChanges[order.id];
    if (!newStatus) return;
    fetch('http://localhost:8080/rest/order/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...order, status: newStatus })
    }).then(() => {
      alert("Stato aggiornato!");
      loadOrders();
    });
  };

  if (!isAdmin) return <div className="text-center mt-5"><h1>Accesso Negato</h1></div>;

  return (
    <div className="admin-container">
      <div className="admin-layout">
        
        {/* SIDEBAR: Usa button, NO link href per evitare ricariche */}
        <aside className="admin-sidebar">
          <h2 className="admin-title">Admin Panel</h2>
          <nav className="admin-nav">
            <button className={`nav-btn ${activeView === 'users' ? 'active' : ''}`} onClick={() => setActiveView('users')}>Utenti</button>
            <button className={`nav-btn ${activeView === 'products' ? 'active' : ''}`} onClick={() => setActiveView('products')}>Prodotti</button>
            <button className={`nav-btn ${activeView === 'orders' ? 'active' : ''}`} onClick={() => setActiveView('orders')}>Ordini</button>
          </nav>
        </aside>

        <div className="admin-content-wrapper">
          <div className="admin-welcome-header d-flex align-items-center mb-4">
            <div className="admin-logo-circle"><i className="bi bi-shield-lock-fill"></i></div>
            <div className="ms-3"><h1 className="m-0">Dashboard Amministratore</h1></div>
          </div>

          {/* VISTA UTENTI */}
          {activeView === 'users' && (
            <div className="admin-section">
              <h2>Lista Utenti</h2>
              <table className="admin-table">
                <thead><tr><th>Nome</th><th>Username</th><th>Email</th><th>Azioni</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.userName}>
                      <td>{u.firstName} {u.lastName}</td><td>{u.userName}</td><td>{u.email}</td>
                      <td><button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.userName)}>Elimina</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VISTA PRODOTTI */}
          {activeView === 'products' && (
            <div className="admin-section">
              <div className="d-flex justify-content-between mb-3">
                <h2>Prodotti</h2>
                <button className="btn btn-success" onClick={() => { setEditingProduct(null); setProductForm({name:'', description:'', price:0, stock:0, subcategoryId:1, imageUrl:''}); setShowProductModal(true); }}>+ Nuovo</button>
              </div>
              <table className="admin-table">
                <thead><tr><th>ID</th><th>Nome</th><th>Prezzo</th><th>Stock</th><th>Azioni</th></tr></thead>
                <tbody>
                  {products.filter(p => !p.isDeleted).map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td><td>{p.name}</td><td>€{p.price?.toFixed(2)}</td><td>{p.stock}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => { setEditingProduct(p); setProductForm({name:p.name, description:p.description, price:p.price, stock:p.stock, subcategoryId: p.subcategory?.id || 1, imageUrl: p.images?.[0]?.link || ''}); setShowProductModal(true); }}>Modifica</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(p.id)}>Elimina</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VISTA ORDINI - CORRETTA */}
          {activeView === 'orders' && (
            <div className="admin-section">
              <h2>Lista Ordini Ricevuti</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Utente</th>
                    <th>Data</th>
                    <th>Totale</th>
                    <th>Status</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{o.userName}</td>
                      <td>{o.date}</td>
                      <td>€{o.totalPrice?.toFixed(2)}</td>
                      <td>
                        <select 
                          className="form-select form-select-sm" 
                          value={pendingStatusChanges[o.id] || o.status} 
                          onChange={(e) => setPendingStatusChanges({...pendingStatusChanges, [o.id]: e.target.value})}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-primary" disabled={!pendingStatusChanges[o.id] || pendingStatusChanges[o.id] === o.status} onClick={() => confirmOrderStatus(o)}>Salva</button>
                          {/* Bottone dettagli per admin */}
                          <button className="btn btn-sm btn-outline-info" onClick={() => navigate(`/user/orders/${o.id}`)}>Dettagli</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan={6} className="text-center">Nessun ordine presente.</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODALE PRODOTTO (Stesso di prima) */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingProduct ? 'Modifica' : 'Nuovo'} Prodotto</h3>
            <form onSubmit={handleProductSubmit} className="modal-form">
              <div className="form-group"><label>Nome</label><input type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required /></div>
              <div className="form-group"><label>Descrizione</label><textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required /></div>
              <div className="form-group"><label>Immagine (URL)</label><input type="text" value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} /></div>
              <div className="d-flex gap-2">
                <div className="form-group"><label>Prezzo</label><input type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} required /></div>
                <div className="form-group"><label>Stock</label><input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} required /></div>
              </div>
              <div className="modal-actions mt-3">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>Chiudi</button>
                <button type="submit" className="btn btn-success">Salva</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;