import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      let username = localStorage.getItem('username');
      if (!username) {
        const userData = localStorage.getItem('user_data');
        if (userData) username = JSON.parse(userData).username || JSON.parse(userData).userName;
      }

      if (!username) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/userorder/getByUser/${username}`);
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
  }, [navigate]);

  if (loading) return <div className="loading-message">Loading your orders...</div>;

  return (
    <div className="orders-container">
      <h2 className="page-title">My Orders</h2>
      <p className="page-subtitle">View and manage your order history.</p>

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
                  <span className="status-text">{order.statusDescription}</span>
                </div>
              </div>
              
              <div className="address-details">
                <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}<br />
                <strong>Total:</strong> {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(order.totalPrice)}
              </div>
              
              <div className="card-actions">
                <span 
                  className="action-link secondary" 
                  onClick={() => navigate(`/user/orders/${order.id}`)}
                >
                  View Details ➔
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