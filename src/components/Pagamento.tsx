import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; // Assicurati che il path sia corretto
import './Pagamento.css';

const Pagamento: React.FC = () => {
  // Sostituisce CartService e Router di Angular
  const { cartItems, clearCart } = useContext(CartContext) as any; 
  const navigate = useNavigate();

  // Sostituisce i signal() di Angular 16+
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isError, setIsError] = useState(false);
  
  const [shippingCost] = useState(0);
  const [metodoScelto, setMetodoScelto] = useState('carta');

  // Calcoli derivati
  const subtotale = cartItems.reduce((acc: any, item: any) => acc + item.price * item.amount, 0);
  const totale = subtotale + shippingCost;

  const impostaMetodo = (metodo: string) => {
    setMetodoScelto(metodo);
  };

  const notify = (msg: string, errorState: boolean = false) => {
    setToastMessage(msg);
    setIsError(errorState);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const completaAcquisto = async () => {
    if (cartItems.length === 0) return;
    
    setLoading(true);
    let userIdentifier: string | null = null;

    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsed = JSON.parse(userData);
        userIdentifier = parsed.userName || parsed.username;
      }
      if (!userIdentifier) userIdentifier = localStorage.getItem('username');
    }

    if (!userIdentifier) {
      notify('Please log in to confirm the order.', true);
      setLoading(false);
      return;
    }

    const ordineDaInviare = {
      userId: userIdentifier,
      wharehouse: 'Main', // Mantenuto il typo originale del tuo codice Angular
      isPaid: true,
      statusDescription: 'PAID',
      date: new Date().toISOString().split('T')[0],
      totalPrice: totale,
    };

    try {
      // Chiamata API verso Spring Boot (sostituisce UserorderService)
      // Modifica la porta o l'URL base in base a come hai configurato Axios/Vite
      const response = await fetch('http://localhost:8080/api/userorder/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Decommenta se usi JWT in Spring Security
        },
        body: JSON.stringify(ordineDaInviare)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error during payment. Please check product availability.');
      }

      // Successo
      clearCart(); // Svuota il carrello tramite Context
      setLoading(false);
      notify('Order placed successfully! Redirecting...');
      
      setTimeout(() => navigate('/user/orders'), 2000);

    } catch (err: any) {
      setLoading(false);
      notify(err.message || 'Server connection error', true);
      console.error('Order failed details:', err);
    }
  };

  // Helper per formattare la valuta come la pipe "currency" di Angular
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <>
      <div className="checkout-container">
        <div className="checkout-header">
          <h2>Secure Checkout</h2>
          <p>Complete your order by entering the details below.</p>
        </div>

        <div className="checkout-content">
          <div className="form-section">
            <h3>Shipping Details</h3>
            <div className="form-group">
              <input type="text" placeholder="Full Name" className="input-field" />
            </div>
            <div className="form-group">
              <input type="text" placeholder="Address (Street and Number)" className="input-field" />
            </div>
            <div className="form-group row">
              <input type="text" placeholder="City" className="input-field half" />
              <input type="text" placeholder="ZIP Code" className="input-field half" />
            </div>

            <h3 className="mt-30">Payment Method</h3>
            <div className="payment-methods">
              <button
                className={`payment-btn ${metodoScelto === 'carta' ? 'active' : ''}`}
                onClick={() => impostaMetodo('carta')}
              >
                💳 Credit Card
              </button>
              <button
                className={`payment-btn ${metodoScelto === 'paypal' ? 'active' : ''}`}
                onClick={() => impostaMetodo('paypal')}
              >
                📱 PayPal
              </button>
            </div>

            {metodoScelto === 'carta' && (
              <div className="card-details">
                <div className="form-group">
                  <input type="text" placeholder="Card Number" className="input-field" />
                </div>
                <div className="form-group row">
                  <input type="text" placeholder="Expiry (MM/YY)" className="input-field half" />
                  <input type="text" placeholder="CVV" className="input-field half" />
                </div>
              </div>
            )}

            {metodoScelto === 'paypal' && (
              <div className="paypal-details">
                <p>You will be redirected to PayPal's website to complete the payment securely.</p>
              </div>
            )}
          </div>

          <div className="summary-section">
            <h3>Order Summary</h3>

            <div className="summary-item">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotale)}</span>
            </div>
            
            <div className="summary-item">
              <span>Shipping</span>
              {shippingCost === 0 ? (
                <span className="free">Free</span>
              ) : (
                <span>{formatCurrency(shippingCost)}</span>
              )}
            </div>

            <div className="divider"></div>

            <div className="summary-item total">
              <span>Total</span>
              <span>{formatCurrency(totale)}</span>
            </div>

            <button
              className="pay-btn"
              onClick={completaAcquisto}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? 'Processing...' : 'Confirm and Pay'}
            </button>

            <div className="secure-badge">
              🔒 Encrypted and secure payment
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification Custom */}
      <div 
        className={`custom-alert ${showToast ? 'active' : ''} ${isError ? 'error-theme' : 'success-theme'}`}
      >
        <div className="alert-body">
          <p style={{ margin: 0 }}>{toastMessage}</p>
        </div>
      </div>
    </>
  );
};

export default Pagamento;