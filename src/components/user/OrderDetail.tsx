import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Orders.css'; // Possiamo riutilizzare lo stile degli ordini

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

  if (!order) return <div className="container mt-5">Caricamento...</div>;

  return (
    <div className="order-detail-container p-4">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate('/user/orders')}>
        ← Torna ai miei ordini
      </button>
      
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">Dettaglio Ordine #{order.id}</h4>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <p><strong>Data:</strong> {order.date}</p>
              <p><strong>Stato:</strong> <span className="badge bg-info text-dark">{order.status}</span></p>
            </div>
            <div className="col-md-6 text-end">
              <h5>Totale: € {order.totalPrice?.toFixed(2)}</h5>
            </div>
          </div>

          <h5 className="border-bottom pb-2">Prodotti Acquistati</h5>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Prodotto</th>
                  <th>Prezzo</th>
                </tr>
              </thead>
              <tbody>
                {/* Nota: Assicurati che il tuo DTO restituisca la lista prodotti o chiamali separatamente */}
                {order.products?.map((p: any) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>€ {p.price?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;