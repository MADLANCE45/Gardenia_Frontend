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
  const getImageUrl = (prod: any) => {
  if (!prod.images || prod.images.length === 0) return '/image.png'; // Immagine di riserva in public/
  const link = prod.images[0].link;
  // Se è un link esterno (inizia con http), lo usiamo direttamente
  return link.startsWith('http') ? link : `http://localhost:8080/rest/image/file/${link}`;
}
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
          
          {/* ---- DA QUI INIZIA LA PARTE MODIFICATA ---- */}
          <div className="add-to-cart-container d-flex align-items-center gap-3 mt-2">
            
            {/* Selettore Quantità con i bottoni + e - */}
            <div className="quantity-selector d-flex align-items-center border rounded-3 overflow-hidden" style={{ height: '48px', backgroundColor: '#f8f9fa' }}>
              <button 
                className="btn border-0 h-100 px-3 fw-bold" 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                style={{ backgroundColor: 'transparent' }}
              >
                -
              </button>
              <span className="px-3 fw-bold">{quantity}</span>
              <button 
                className="btn border-0 h-100 px-3 fw-bold" 
                onClick={() => setQuantity(q => q + 1)}
                style={{ backgroundColor: 'transparent' }}
              >
                +
              </button>
            </div>

            {/* Bottone Verde Lineare */}
            <button 
              onClick={handleAddToCart} 
              className="btn btn-success flex-grow-1 h-100 d-flex justify-content-center align-items-center gap-2 fw-bold rounded-3 shadow-sm"
              style={{ height: '48px', fontSize: '16px', backgroundColor: '#28a745', borderColor: '#28a745' }}
            >
              Aggiungi al Carrello
            </button>
          </div>
          {/* ---- FINE PARTE MODIFICATA ---- */}

        </div>
      </div>
    </div>
  );
  
};

export default ProductDetails;