import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pagamento.css';

interface CartItem {
  id: number;
  nome: string;
  amount: number;
  price: number;
}

const Pagamento: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [metodoScelto, setMetodoScelto] = useState('carta');

  // 1. Recuperiamo il carrello all'apertura della pagina
  useEffect(() => {
    const fetchCart = async () => {
      const userString = localStorage.getItem('user');
      if (!userString) {
        navigate('/login');
        return;
      }
      
      const user = JSON.parse(userString);
      try {
        const response = await fetch(`http://localhost:8080/rest/shoppingCart/activeCart/${user.userName}`);
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        }
      } catch (error) {
        console.error("Errore recupero carrello per pagamento:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const subtotale = cartItems.reduce((acc, item) => acc + (item.price * item.amount), 0);
  const totale = subtotale; // + shipping se lo aggiungi

  const notify = (msg: string, errorState: boolean = false) => {
    setToastMessage(msg);
    setIsError(errorState);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const completaAcquisto = async () => {
    if (cartItems.length === 0) return;
    
    setLoading(true);
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);

    // RICREIAMO IL PAYLOAD ESATTO DI ANGULAR
    // Questi sono i campi esatti che il tuo Spring Boot si aspetta!
    const ordineDaInviare = {
      userId: user.userName,
      wharehouse: 'Main', 
      isPaid: true,
      statusDescription: 'PAID',
      date: new Date().toISOString().split('T')[0],
      totalPrice: totale,
    };

    try {
      // ATTENZIONE ALL'URL: ho messo "userorder" tutto minuscolo. 
      // Nelle API Spring Boot di solito non si usa il CamelCase per i path.
      const response = await fetch('http://localhost:8080/rest/order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(ordineDaInviare)
});

      // Leggiamo la risposta (il tuo backend usa sempre Resp.java o qualcosa di simile)
      const result = await response.json().catch(() => ({})); 

      if (response.ok && result.rc !== false) {
        setLoading(false);
        notify('Order placed successfully! Redirecting...');
        setTimeout(() => navigate('/user/orders'), 2000);
      } else {
        throw new Error(result.msg || 'Errore durante la creazione dell\'ordine');
      }
    } catch (err: any) {
      setLoading(false);
      notify(err.message || 'Errore di connessione al server', true);
    }
  };

  if (fetching) return <div className="loading-message">Loading checkout...</div>;

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
              <input type="text" placeholder="Address" className="input-field" />
            </div>
            <div className="form-group row">
              <input type="text" placeholder="City" className="input-field half" />
              <input type="text" placeholder="ZIP Code" className="input-field half" />
            </div>

            <h3 className="mt-30">Payment Method</h3>
            <div className="payment-methods">
              <button 
                className={`payment-btn ${metodoScelto === 'carta' ? 'active' : ''}`}
                onClick={() => setMetodoScelto('carta')}
              >
                💳 Credit Card
              </button>
              <button 
                className={`payment-btn ${metodoScelto === 'paypal' ? 'active' : ''}`}
                onClick={() => setMetodoScelto('paypal')}
              >
                📱 PayPal
              </button>
            </div>

            {metodoScelto === 'carta' && (
              <div className="card-details">
                <input type="text" placeholder="Card Number" className="input-field" />
                <div className="form-group row mt-10">
                  <input type="text" placeholder="MM/YY" className="input-field half" />
                  <input type="text" placeholder="CVV" className="input-field half" />
                </div>
              </div>
            )}
          </div>

          <div className="summary-section">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span>Total</span>
              <span className="total">€ {totale.toFixed(2)}</span>
            </div>
            <button 
              className="pay-btn" 
              onClick={completaAcquisto}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? 'Processing...' : 'Confirm and Pay'}
            </button>
            <div className="secure-badge">🔒 Encrypted and secure payment</div>
          </div>
        </div>
      </div>

      <div className={`custom-alert ${showToast ? 'active' : ''} ${isError ? 'error-theme' : 'success-theme'}`}>
        <p>{toastMessage}</p>
      </div>
    </>
  );
};

export default Pagamento;