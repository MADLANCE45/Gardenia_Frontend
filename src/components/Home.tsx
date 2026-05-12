import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './Home.css'; 

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  images?: { link: string }[];
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { categoryName, subcategoryName } = useParams();
  const [searchParams] = useSearchParams();
  const subcategoryId = searchParams.get('subcategoryId');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = subcategoryId 
          ? `http://localhost:8080/rest/product/findBySubcategory?subcategoryId=${subcategoryId}`
          : `http://localhost:8080/rest/product/list`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setError('Errore nel caricamento prodotti.');
        }
      } catch (err) {
        setError('Errore di connessione al backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName, subcategoryName, subcategoryId]);

  // FUNZIONE PER LE IMMAGINI RIPRISTINATA
  const getImageUrl = (prod: Product): string => {
    if (!prod || !prod.images || prod.images.length === 0) {
      return '/img/image.png'; 
    }
    const link = prod.images[0].link;
    return link.startsWith('http') ? link : `http://localhost:8080/rest/image/file/${link}`;
  };

  if (loading) return <p style={{textAlign: 'center', marginTop: '50px'}}>Caricamento...</p>;
  if (error) return <p style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>{error}</p>;

  return (
    <div className="home-container">
      <div className="products-grid">
        {products.map(product => (
          <div 
            key={product.id} 
            className="product-card" 
            onClick={() => navigate(`/product/${product.id}`)}
            style={{ cursor: 'pointer' }}
          >
            {/* IMMAGINE RIPRISTINATA */}
            <div className="product-image">
              <img 
                src={getImageUrl(product)} 
                alt={product.name} 
                className="card-image" 
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
            </div>
            <div className="product-info" style={{ padding: '10px' }}>
              <h3>{product.name}</h3>
              {/* Controllo di sicurezza sul prezzo */}
              <p>€ {(product.price || 0).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;