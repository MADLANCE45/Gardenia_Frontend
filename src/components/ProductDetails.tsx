import React, { useState, useEffect, useContext } from 'react'; // Aggiungi useContext
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext'; // Importa il context
import './Product-details.css';

// ... (tieni le interfacce e il resto dello stato) ...

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Usiamo la funzione addToCart del Context
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState<any | null>(null);
  // ... (tieni gli altri stati loading, error, quantity) ...
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ... (tieni lo useEffect per il fetch) ...
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/rest/product/findById?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.object ? data.object : data);
        } else {
          setError("Prodotto non trovato.");
        }
      } catch (err) {
        setError("Errore di connessione.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  // FUNZIONE AGGIORNATA
  // FUNZIONE AGGIORNATA PER IL DATABASE
  const handleAddToCart = async () => {
    if (product) {
      const safePrice = product.price || 0;
      
      // Ora passiamo ID, Quantità e PREZZO!
      const success = await addToCart(product.id, quantity, safePrice);
      
      if (success) {
        alert(`${quantity} unità di "${product.name}" aggiunte al carrello con successo!`);
      } else {
        alert("Errore durante l'aggiunta al carrello. Controlla la console.");
      }
    }
  };

  if (loading) return <h2>Caricamento...</h2>;
  if (!product) return <h2>Prodotto non trovato</h2>;

  return (
    <div className="product-wrap">
      {/* ... resto del tuo HTML ... */}
      <h1>{product.name}</h1>
      <p>Prezzo: € {product.price}</p>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(parseInt(e.target.value))} 
          style={{ width: '50px' }}
        />
        {/* COLLEGA LA NUOVA FUNZIONE AL CLICK */}
        <button onClick={handleAddToCart} style={{ background: '#2e7d32', color: 'white', padding: '10px' }}>
          AGGIUNGI AL CARRELLO
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;