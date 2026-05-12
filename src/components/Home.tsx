import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images?: { link: string }[];
}

interface HomeProps {
  setCartCounter: React.Dispatch<React.SetStateAction<number>>;
}

const Home: React.FC = () => { 
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    fetch('http://localhost:8080/rest/product/list')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Errore fetch", err));
  }, []);

 const getImageUrl = (prod: any) => {
  if (!prod.images || prod.images.length === 0) return '/image.png'; // Immagine di riserva in public/
  const link = prod.images[0].link;
  // Se è un link esterno (inizia con http), lo usiamo direttamente
  return link.startsWith('http') ? link : `http://localhost:8080/rest/image/file/${link}`;
};

  const addToCart = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation(); // Evita che cliccando il bottone si apra la pagina dettaglio
    // ... qui andrà la logica della chiamata POST al tuo DB per il carrello
    
  };

  return (
    /* STESSA STRUTTURA DEL TUO ANGULAR: home-container -> products-grid -> product-card */
    <div className="home-container">
      <h1 className="mb-5 text-center" style={{ color: '#1b5e20', fontWeight: 'bold' }}>Le Nostre Piante</h1>
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
            
            <div className="product-image">
              <img src={getImageUrl(product)} alt={product.name} />
            </div>
            
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-price">€ {(product.price || 0).toFixed(2)}</p>
              
              <button 
                className="btn w-100 fw-bold" 
                style={{ backgroundColor: '#2e7d32', color: 'white' }}
                onClick={(e) => addToCart(e, product.id)}
              >
                Aggiungi al Carrello
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;