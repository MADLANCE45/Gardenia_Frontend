import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Admin.css';

const Admin: React.FC = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.ruolo === 0 || user?.role === 'ADMIN';

  const [activeView, setActiveView] = useState<'users' | 'products' | 'orders'>('users');
  
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [pendingStatusChanges, setPendingStatusChanges] = useState<{ [orderId: number]: string }>({});

  // --- STATI PER IL MODALE DEI PRODOTTI ---
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Ho aggiunto 'imageUrl' per gestire il link dell'immagine
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: 0, stock: 0, subcategoryId: 1, imageUrl: ''
  });

  useEffect(() => {
    if (!isAdmin) return;
    if (activeView === 'users') loadUsers();
    else if (activeView === 'products') loadProducts();
    else if (activeView === 'orders') loadOrders();
  }, [activeView, isAdmin]);

  // --- FETCH DATI ---
  const loadUsers = () => fetch('http://localhost:8080/rest/user/list').then(res => res.json()).then(setUsers);
  const loadProducts = () => fetch('http://localhost:8080/rest/product/list').then(res => res.json()).then(setProducts);
  const loadOrders = () => fetch('http://localhost:8080/rest/userorder/list').then(res => res.json()).then(setOrders);

  // --- ELIMINAZIONE UTENTE ---
  const deleteUser = (username: string) => {
    if (window.confirm(`Sei sicuro di voler eliminare l'utente ${username}?`)) {
      // Usiamo ?userName= come si aspetta Spring Boot solitamente
      fetch(`http://localhost:8080/rest/user/delete?userName=${username}`, { method: 'DELETE' })
        .then(res => {
          if(res.ok) {
            alert("Utente eliminato con successo.");
            loadUsers();
          } else {
            alert("Impossibile eliminare l'utente (potrebbe avere ordini collegati).");
          }
        })
        .catch(err => console.error(err));
    }
  };

  // --- ELIMINAZIONE PRODOTTO ---
  const deleteProduct = (id: number) => {
    if (window.confirm(`Sei sicuro di voler eliminare il prodotto ID ${id}?`)) {
      // Usiamo ?id= invece di /id
      fetch(`http://localhost:8080/rest/product/delete?id=${id}`, { method: 'DELETE' })
        .then(async res => {
          if(res.ok) {
            alert("Prodotto eliminato!");
            loadProducts();
          } else {
            // Fallback al Soft Delete se ci sono chiavi esterne (ordini vecchi)
            alert("Impossibile eliminare definitivamente. Uso il Soft Delete per nasconderlo.");
            await fetch('http://localhost:8080/rest/product/softDelete', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: id })
            });
            loadProducts();
          }
        });
    }
  };

  // --- MODALE: APRI CREAZIONE ---
  const openCreateModal = () => {
    setEditingProduct(null);
    setProductForm({ name: '', description: '', price: 0, stock: 0, subcategoryId: 1, imageUrl: '' });
    setShowProductModal(true);
  };

  // --- MODALE: APRI MODIFICA ---
  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      subcategoryId: product.subcategory?.id || product.subcategoryId || 1,
      // Precompiliamo l'immagine se esiste già
      imageUrl: product.images && product.images.length > 0 ? product.images[0].link : ''
    });
    setShowProductModal(true);
  };

  // --- SALVATAGGIO PRODOTTO & IMMAGINE ---
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      id: editingProduct ? editingProduct.id : null,
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      subcategoryId: Number(productForm.subcategoryId),
      isDeleted: false
    };

    const url = editingProduct ? 'http://localhost:8080/rest/product/update' : 'http://localhost:8080/rest/product/create';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Recuperiamo i dati restituiti per avere l'ID del nuovo prodotto creato
        const savedData = await res.json().catch(() => ({}));
        const productId = editingProduct ? editingProduct.id : (savedData.id || savedData.data?.id);

        // Se c'è un'immagine da salvare e abbiamo l'id del prodotto
        if (productForm.imageUrl && productId) {
          await fetch('http://localhost:8080/rest/image/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: productId, link: productForm.imageUrl })
          }).catch(err => console.log("Immagine non salvata:", err));
        }

        alert(`Prodotto salvato con successo!`);
        setShowProductModal(false);
        loadProducts();
      } else {
        alert("Errore durante il salvataggio.");
      }
    } catch (err) {
      console.error(err);
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
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedOrder)
    }).then(() => {
      alert("Stato aggiornato!"); loadOrders();
    });
  };

  if (!isAdmin) {
    return (
      <div className="access-denied text-center mt-5" style={{ minHeight: '60vh' }}>
        <h1 className="text-danger">Accesso Negato</h1>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-layout">
        
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
            <div className="ms-3">
              <h1 className="m-0" style={{ fontSize: '24px' }}>Dashboard Amministratore</h1>
            </div>
          </div>

          {activeView === 'users' && (
            <div className="admin-section">
              <h2>Lista Utenti</h2>
              <table className="admin-table">
                <thead><tr><th>Nome</th><th>Username</th><th>Email</th><th>Ruolo</th><th>Azioni</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.userName}>
                      <td>{u.firstName} {u.lastName}</td><td>{u.userName}</td><td>{u.email}</td><td>{u.role}</td>
                      <td><button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.userName)}>Elimina</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeView === 'products' && (
            <div className="admin-section">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Lista Prodotti</h2>
                <button className="btn btn-success" onClick={openCreateModal}>+ Nuovo Prodotto</button>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>ID</th><th>Nome</th><th>Prezzo</th><th>Stock</th><th>Sottocategoria</th><th>Azioni</th></tr></thead>
                  <tbody>
                    {products.filter(p => !p.deleted && !p.isDeleted).map(p => (
                      <tr key={p.id}>
                        <td>{p.id}</td><td>{p.name}</td><td>€ {(p.price || 0).toFixed(2)}</td>
                        <td className={p.stock < 5 ? 'text-danger fw-bold' : ''}>{p.stock}</td>
                        <td>{p.subcategory?.name || p.subcategoryId}</td>
                        <td>
                          <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(p)}>Modifica</button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(p.id)}>Elimina</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'orders' && (
            <div className="admin-section">
              <h2>Lista Ordini</h2>
              <table className="admin-table">
                <thead><tr><th>ID Ordine</th><th>ID Utente</th><th>Data</th><th>Totale</th><th>Status</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>{o.id}</td><td>{o.user?.userName || o.userId}</td><td>{o.date}</td><td>€ {(o.totalPrice || 0).toFixed(2)}</td>
                      <td>
                        <div className="d-flex gap-2 align-items-center">
                          <select className="form-select form-select-sm" value={pendingStatusChanges[o.id] || o.status} onChange={(e) => onStatusChange(o.id, e.target.value)}>
                            <option value="PENDING">PENDING</option><option value="CONFIRMED">CONFIRMED</option>
                            <option value="SHIPPED">SHIPPED</option><option value="DELIVERED">DELIVERED</option>
                          </select>
                          <button className="btn btn-sm btn-primary" disabled={!pendingStatusChanges[o.id] || pendingStatusChanges[o.id] === o.status} onClick={() => confirmOrderStatus(o)}>Conferma</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODALE PER CREARE/MODIFICARE PRODOTTI */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingProduct ? 'Modifica Prodotto' : 'Nuovo Prodotto'}</h3>
            <form className="modal-form" onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label>Nome Prodotto</label>
                <input type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Descrizione</label>
                <textarea rows={2} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required />
              </div>
              
              {/* NUOVO CAMPO: LINK IMMAGINE */}
              <div className="form-group">
                <label>Link Immagine (URL)</label>
                <input 
                  type="text" 
                  placeholder="https://esempio.com/immagine.jpg" 
                  value={productForm.imageUrl} 
                  onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} 
                />
              </div>

              <div className="d-flex gap-3 mb-3">
                <div className="form-group flex-grow-1">
                  <label>Prezzo (€)</label>
                  <input type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})} required />
                </div>
                <div className="form-group flex-grow-1">
                  <label>Stock</label>
                  <input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: parseInt(e.target.value)})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Sottocategoria (ID)</label>
                <select value={productForm.subcategoryId} onChange={e => setProductForm({...productForm, subcategoryId: parseInt(e.target.value)})} required>
                  <optgroup label="Piante (1-3)">
                    <option value={1}>1 - Da Esterno</option><option value={2}>2 - Da Interno</option><option value={3}>3 - Fiori</option>
                  </optgroup>
                  <optgroup label="Alberi (4-6)">
                    <option value={4}>4 - Ornamentali</option><option value={5}>5 - Da Frutto</option><option value={6}>6 - Forestali</option>
                  </optgroup>
                  <optgroup label="Strumenti (7-9)">
                    <option value={7}>7 - Da Potatura</option><option value={8}>8 - Elettroutensili</option><option value={9}>9 - Scavo</option>
                  </optgroup>
                  <optgroup label="Forniture (10-12)">
                    <option value={10}>10 - Tavoli</option><option value={11}>11 - Panchine</option><option value={12}>12 - Gazebo</option>
                  </optgroup>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>Annulla</button>
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