import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// INTERFACCIA AGGIORNATA: Ora i nomi combaciano con ShoppingCartDTO.java
interface CartItem {
  id: number;
  nome: string;       // Prima era productName
  amount: number;
  price: number;
  immagine?: string;  // Aggiunto dal tuo DTO
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
        const response = await fetch(`http://localhost:8080/rest/shoppingCart/activeCart/${user.userName}`);
        if (response.ok) {
          const data = await response.json();
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

  // Funzione per mostrare l'immagine nel carrello
  const getImageUrl = (img?: string): string => {
    if (!img) return 'https://via.placeholder.com/50x50?text=No+Img';
    return img.startsWith('http') ? img : `http://localhost:8080/rest/image/file/${img}`;
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.amount), 0);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Caricamento carrello...</h2>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ color: '#2e7d32', borderBottom: '2px solid #2e7d32', paddingBottom: '10px' }}>Il Tuo Carrello 🛒</h1>
      
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <h3>Il tuo carrello è vuoto.</h3>
          <button onClick={() => navigate('/home')} style={{ padding: '10px 20px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
            Torna allo Shop
          </button>
        </div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', background: '#f9f9f9' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Immagine</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Prodotto</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Quantità</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Prezzo unitario</th>
                <th style={{ textAlign: 'right', padding: '12px' }}>Totale</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                  {/* Colonna Immagine */}
                  <td style={{ padding: '12px' }}>
                    <img 
                      src={getImageUrl(item.immagine)} 
                      alt={item.nome} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  </td>
                  {/* Colonna Nome (Corretta) */}
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.nome}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{item.amount}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>€ {item.price.toFixed(2)}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#2e7d32' }}>
                    € {(item.price * item.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ textAlign: 'right', marginTop: '30px', padding: '20px', background: '#f1f8e9', borderRadius: '8px' }}>
            <h2 style={{ margin: '0 0 15px 0' }}>Totale Ordine: € {total.toFixed(2)}</h2>
            <button style={{ background: '#2e7d32', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
              PROCEDI ALL'ACQUISTO
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrello;