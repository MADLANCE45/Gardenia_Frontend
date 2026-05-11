import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Product-details.css';
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  images?: { link: string }[];
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchProduct = async () => {
      // FIX: Se l'ID non c'è, fermiamo subito il caricamento e mostriamo l'errore
      if (!id || isNaN(Number(id))) {
        setError("ID prodotto non valido o mancante nell'URL. Usa ad esempio /product/1");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);

      try {
        // Chiamata al tuo backend Spring Boot usando @RequestParam id
        const response = await fetch(`http://localhost:8080/rest/product/findById?id=${id}`);
        
        if (response.ok) {
          const data = await response.json();
          // Se il backend risponde con un oggetto Resp, usa data.object
          setProduct(data); 
        } else {
          setError(`Prodotto con ID ${id} non trovato nel database.`);
        }
      } catch (err) {
        console.error(err);
        setError('Errore di connessione. Assicurati che il backend Spring Boot sia acceso.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0); 
  }, [id]);

  // Gestione della visualizzazione durante il caricamento o errore
  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}><h3>Caricamento dettagli...</h3></div>;
  if (error) return (
    <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
      <h3>{error}</h3>
      <button onClick={() => navigate('/home')} style={{marginTop: '20px', cursor: 'pointer'}}>Torna alla Home</button>
    </div>
  );
  if (!product) return null;

  // --- RENDERING DEI DETTAGLI (Il tuo template precedente) ---
  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px', display: 'flex', gap: '40px' }}>
       {/* ... (resto del codice della view) ... */}
       <div style={{ flex: 1 }}>
          <h1 style={{ color: '#2e7d32' }}>{product.name}</h1>
          <p>Prezzo: € {product.price.toFixed(2)}</p>
          <p>Disponibilità: {product.stock}</p>
          <button onClick={() => navigate('/home')}>← Indietro</button>
       </div>
    </div>
  );
};

export default ProductDetails;