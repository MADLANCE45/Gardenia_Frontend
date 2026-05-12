import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: number;
  productName: string;
  amount: number;
  price: number;
}

const Carrello: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const userString = localStorage.getItem('user');
      if (!userString) {
        navigate('/login');
        return;
      }
      
      const user = JSON.parse(userString);
      try {
        // Chiamata all'endpoint del tuo backend per il carrello attivo
        const response = await fetch(`http://localhost:8080/rest/shoppingCart/activeCart/${user.userName}`);
        if (response.ok) {
          const data = await response.json();
          // Il tuo mapper restituisce una lista di ShoppingCartDTO
          setCartItems(data);
        }
      } catch (error) {
        console.error("Errore recupero carrello:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.amount), 0);

  if (loading) return <h2 style={{ textAlign: 'center' }}>Caricamento carrello...</h2>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ color: '#2e7d32' }}>Il Tuo Carrello 🛒</h1>
      
      {cartItems.length === 0 ? (
        <p>Il carrello è vuoto. <button onClick={() => navigate('/home')}>Vai allo shop</button></p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #2e7d32' }}>
                <th style={{ textAlign: 'left', padding: '10px' }}>Prodotto</th>
                <th style={{ textAlign: 'center', padding: '10px' }}>Quantità</th>
                <th style={{ textAlign: 'right', padding: '10px' }}>Prezzo unitario</th>
                <th style={{ textAlign: 'right', padding: '10px' }}>Totale</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{item.productName}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{item.amount}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>€ {item.price.toFixed(2)}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>€ {(item.price * item.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <h2>Totale Ordine: € {total.toFixed(2)}</h2>
            <button style={{ background: '#2e7d32', color: 'white', padding: '15px 30px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              PROCEDI ALL'ORDINE
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrello;