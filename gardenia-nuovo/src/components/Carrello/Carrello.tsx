import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Carrello.css';

interface CartItem {
  id: number;
  idProduct?: number; 
  nome: string;
  amount: number;
  price: number;
  immagine?: string;
}

const Carrello: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      let username = localStorage.getItem('username');
      if (!username) {
        const userData = localStorage.getItem('user_data');
        if (userData) username = JSON.parse(userData).username || JSON.parse(userData).userName;
      }
      if (!username) username = JSON.parse(localStorage.getItem('user') || '{}').userName;

      if (!username) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:8080/rest/shoppingCart/activeCart/${username}`);
        if (response.ok) {
          const data = await response.json();
          
          // LA MAGIA: Raggruppiamo i prodotti doppi in una singola riga!
          const groupedCart = data.reduce((acc: CartItem[], current: CartItem) => {
            const existing = acc.find(item => item.nome === current.nome);
            if (existing) {
              existing.amount += current.amount; // Somma le quantità invece di creare una nuova riga
            } else {
              acc.push({ ...current });
            }
            return acc;
          }, []);

          setCartItems(groupedCart);
        }
      } catch (error) {
        console.error("Errore recupero carrello:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const getImageUrl = (img?: string): string => {
    if (!img) return 'https://via.placeholder.com/80x80?text=No+Img';
    return img.startsWith('http') ? img : `http://localhost:8080/rest/image/file/${img}`;
  };

  // Aggiorna la quantità visivamente nel frontend (poi andrà collegato al backend)
  const cambiaQuantita = (itemToChange: CartItem, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.nome === itemToChange.nome) {
        const newAmount = Math.max(1, item.amount + delta);
        return { ...item, amount: newAmount };
      }
      return item;
    }));
  };

  // Rimuove la riga dal frontend (poi andrà collegato al backend)
  const rimuoviTutto = (itemToRemove: CartItem) => {
    setCartItems(prev => prev.filter(item => item.nome !== itemToRemove.nome));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.amount), 0);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Caricamento carrello...</div>;

  return (
    <div className="cart-page-container">
      <div className="cart-header">
        <h2>Your Shopping Cart</h2>
      </div>

      {cartItems.length > 0 ? (
        <>
          <div className="cart-items">
            {cartItems.map((item, idx) => (
              <div className="cart-item" key={idx}>
                
                <Link to={`/product/${item.idProduct || item.id}`} className="img-link">
                  <img src={getImageUrl(item.immagine)} alt={item.nome} className="product-img" />
                </Link>

                <div className="item-details">
                  <Link to={`/product/${item.idProduct || item.id}`} className="title-link">
                    <h4>{item.nome}</h4>
                  </Link>

                  <div className="controls-wrapper">
                    <div className="quantity-controls">
                      <button onClick={() => cambiaQuantita(item, -1)} disabled={item.amount <= 1}>
                        -
                      </button>
                      <span className="amount-badge">{item.amount}</span>
                      <button onClick={() => cambiaQuantita(item, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="item-price">
                  {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(item.price * item.amount)}
                </div>

                <button className="remove-all-btn" onClick={() => rimuoviTutto(item)} title="Remove item">
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <div className="subtotal-container">
              <span className="subtotal-label">Order Total:</span>
              <span className="subtotal-amount">
                {new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(subtotal)}
              </span>
            </div>

            <button className="checkout-btn" onClick={() => navigate('/pagamento')}>
              Go to Payment ➔
            </button>
          </div>
        </>
      ) : (
        <div className="empty-cart">
          <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" className="empty-cart-img" />
          <h3>Your cart feels a bit light!</h3>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button className="go-shop-btn" onClick={() => navigate('/home')}>
            Go Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Carrello;