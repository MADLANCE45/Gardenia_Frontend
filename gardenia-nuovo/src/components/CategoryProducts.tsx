import React, { useEffect, useState, useContext } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './Home.css'; // Importiamo lo stesso identico CSS della Home!

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images?: { link: string }[];
}

const CategoryProducts: React.FC = () => {
  const { categoryName, subcategoryName } = useParams();
  const [searchParams] = useSearchParams();
  const subcategoryId = searchParams.get('subcategoryId');
  
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subcategoryId) {
      setLoading(true);
      fetch(`http://localhost:8080/rest/product/findBySubcategory?subcategoryId=${subcategoryId}`)
        .then((response) => response.json())
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Errore nel recupero dei prodotti:", error);
          setLoading(false);
        });
    }
  }, [subcategoryId]);

  // Stessa logica della Home per recuperare l'immagine corretta
  const getImageUrl = (prod: any): string => {
    if (!prod.images || prod.images.length === 0) return '/logo.png'; 
    const link = prod.images[0].link;
    return link.startsWith('http') ? link : `http://localhost:8080/rest/image/file/${link}`;
  };

  // Stessa logica della Home per il carrello
  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); 
    const success = await cartContext.addToCart(product.id, 1, product.price);
    if (success) console.log("Prodotto aggiunto!");
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center" style={{ minHeight: '60vh' }}>
        <h2>Caricamento prodotti in corso...</h2>
      </div>
    );
  }

  return (
    <div className="home-container">
      
      {/* Banner in stile Home ma con il nome della Sottocategoria */}
      <div className="banner-wrapper" style={{ padding: '40px 20px' }}>
        <div className="banner-content">
          <span className="banner-text" style={{ fontSize: '36px' }}>
            {subcategoryName} <span style={{ fontSize: '20px', opacity: 0.8 }}>({categoryName})</span>
          </span>
        </div>
      </div>

      <div className="products-section" style={{ minHeight: '50vh' }}>
        <div className="products-container">
          
          {products.length > 0 ? (
            <div className="products-grid">
              {/* Usa le stesse identiche card della Home */}
              {products.map((product) => (
                <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                  <div className="product-image">
                    <img src={getImageUrl(product)} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    {/* Aggiungiamo la descrizione in piccolo */}
                    <p className="text-muted" style={{ fontSize: '13px', marginBottom: '10px' }}>
                      {product.description}
                    </p>
                    <p className="product-price">€ {(product.price || 0).toFixed(2)}</p>
                    <button 
                      className="btn w-100 fw-bold" 
                      style={{ backgroundColor: '#2e7d32', color: 'white', marginTop: 'auto' }}
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      Aggiungi al Carrello
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-12 text-center mt-5">
              <h4 style={{ color: '#555' }}>Nessun prodotto disponibile in questa sezione.</h4>
              <button className="btn btn-outline-success mt-3" onClick={() => navigate('/')}>
                Torna alla Home
              </button>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;