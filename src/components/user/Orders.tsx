import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Orders.css';

interface Order {
  id: number;
  date: string;
  totalPrice: number;
  statusDescription: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); // Usiamo il Context invece del localStorage manuale
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      // Se l'utente non è nel context, aspettiamo un attimo (magari sta caricando)
      // Se dopo il caricamento non c'è, allora mandiamo al login
      if (!user) {
        const stored = localStorage.getItem('user');
        if (!stored) {
          navigate('/login');
          return;
        }
        return; // L'AuthContext lo caricherà a breve
      }

      try {
        // Usiamo l'URL esatto del tuo UserOrderController.java
        const response = await fetch(`http://localhost:8080/rest/order/listByUser?userName=${user.userName}`);
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Errore recupero ordini:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) return <div className="loading-message">Loading your orders...</div>;

  return (
    <div className="orders-container">
      <h2 className="page-title">My Orders</h2>
      <p className="page-subtitle">Manage and track your recent purchases.</p>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="address-card">
              <div className="card-header">
                <div className="user-name">Order #{order.id}</div>
                <div className="badge-shipping">
                   Status: <span className="status-text">{order.statusDescription || 'PAID'}</span>
                </div>
              </div>
              
              <div className="address-details">
                <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> € {order.totalPrice.toFixed(2)}</p>
              </div>
              
              <div className="card-actions">
                <span 
                  className="action-link secondary" 
                  onClick={() => navigate(`/user/orders/${order.id}`)}
                >
                  View Order Details ➔
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;