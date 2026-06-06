import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Orders.css';

const OrderDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/rest/order/getById?id=${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Ordine non trovato");
        return res.json();
      })
      .then(data => setOrder(data))
      .catch(err => console.error("Errore recupero dettagli ordine:", err));
  }, [id]);

  if (!order) return <div className="container mt-5 text-center"><h5>Caricamento...</h5></div>;

  return (
    <div className="order-detail-container p-4">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate('/user/orders')}>
        <i className="bi bi-arrow-left me-2"></i> Torna ai miei ordini
      </button>
      
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-success text-white py-3">
          <h4 className="mb-0"><i className="bi bi-receipt me-2"></i> Riepilogo Ordine #{order.id}</h4>
        </div>
        <div className="card-body bg-light">
          <div className="row align-items-center">
            <div className="col-md-8">
              <p className="mb-1 text-muted">Data d'acquisto: <strong>{order.date}</strong></p>
              <p className="mb-0 text-muted">
                Stato spedizione: <span className="badge bg-info text-dark px-3 py-2 ms-1">{order.statusDescription || 'IN ELABORAZIONE'}</span>
              </p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <p className="mb-0 text-muted">Totale Pagato</p>
              <h3 className="text-success fw-bold m-0">€ {order.totalPrice?.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      <h5 className="mb-3 fw-bold text-secondary">Prodotti Acquistati</h5>
      
      {/* VISTA A CARD PER I PRODOTTI */}
      <div className="row g-3">
        {order.items?.map((item: any) => (
          <div className="col-12 col-lg-6" key={item.id}>
            <div className="card h-100 shadow-sm border-0 product-order-card">
              <div className="card-body d-flex flex-row align-items-center">
                
                {/* Immagine prodotto più grande */}
                <div className="flex-shrink-0">
                  {item.immagine ? (
                    <img 
                      src={item.immagine} 
                      alt={item.nome} 
                      className="rounded" 
                      style={{width: '90px', height: '90px', objectFit: 'cover', border: '1px solid #eee'}} 
                    />
                  ) : (
                    <div className="bg-light rounded d-flex align-items-center justify-content-center border" style={{width: '90px', height: '90px'}}>
                      <i className="bi bi-image text-muted fs-2"></i>
                    </div>
                  )}
                </div>

                {/* Dettagli prodotto a destra */}
                <div className="flex-grow-1 ms-3">
                  <h6 className="fw-bold mb-1 text-dark">{item.nome}</h6>
                  
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="badge bg-light text-dark border">
                      Quantità: {item.amount}
                    </span>
                    <span className="text-muted small">
                      Prezzo unitario: €{item.price?.toFixed(2)}
                    </span>
                  </div>
                  
                  <hr className="my-2" />
                  
                  <div className="text-end">
                    <span className="text-muted small me-2">Subtotale:</span>
                    <strong className="text-success">€ {(item.price * item.amount).toFixed(2)}</strong>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default OrderDetail;