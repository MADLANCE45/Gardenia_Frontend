import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './Product-details.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleAddToCart = async () => {
    if (product) {
      const safePrice = product.price || 0;
      const success = await addToCart(product.id, quantity, safePrice);
      
      if (success) {
        alert(`${quantity} unità di "${product.name}" aggiunte al carrello con successo!`);
      } else {
        alert("Errore durante l'aggiunta al carrello. Controlla la console.");
      }
    }
  };

  // Funzione recuperata dalla Home per mostrare l'immagine corretta
  const getImageUrl = (prod: any): string => {
    if (!prod || !prod.images || prod.images.length === 0) {
      return '/img/image.png'; // Immagine di default se non c'è
    }
    const link = prod.images[0].link;
    return link.startsWith('http') ? link : `http://localhost:8080/rest/image/file/${link}`;
  };

  if (loading) return <h2 className="text-center mt-5">Caricamento...</h2>;
  if (!product) return <h2 className="text-center mt-5 text-danger">Prodotto non trovato</h2>;

  return (
    <div className="container mt-5">
      {/* Bottone per tornare indietro */}
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        &larr; Torna indietro
      </button>

      <div className="row bg-white p-4 rounded shadow-sm">
        {/* Colonna Sinistra: Immagine */}
        <div className="col-md-6 mb-4">
          <img 
            src={getImageUrl(product)} 
            alt={product.name} 
            className="img-fluid rounded"
            style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }}
          />
        </div>

        {/* Colonna Destra: Dettagli Prodotto */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h1 className="display-5 fw-bold text-success mb-3">{product.name}</h1>
          
          {/* ECCO LA DESCRIZIONE! */}
          <p className="lead text-muted mb-4">{product.description}</p>
          
          <h3 className="fw-bold mb-4">€ {(product.price || 0).toFixed(2)}</h3>
          
          <div className="d-flex align-items-center gap-3 bg-light p-3 rounded border">
            <input 
              type="number" 
              className="form-control text-center fw-bold" 
              value={quantity} 
              min="1"
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
              style={{ width: '80px', height: '50px' }}
            />
            <button 
              onClick={handleAddToCart} 
              className="btn btn-success btn-lg w-100 fw-bold"
              style={{ height: '50px' }}
            >
              🛒 AGGIUNGI AL CARRELLO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;