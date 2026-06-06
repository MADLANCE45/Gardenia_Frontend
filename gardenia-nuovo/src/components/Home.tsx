import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './Home.css'; 

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images?: { link: string }[];
  subcategory?: { id: number }; // Aggiunto per permettere il filtro
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const cartContext = useContext(CartContext);
  
  // Utilizziamo useSearchParams per leggere l'URL
  const [searchParams] = useSearchParams();
  const subId = searchParams.get('subcategoryId');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  
  useEffect(() => {
    fetch('http://localhost:8080/rest/product/list')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Errore fetch", err));
  }, []);

  const getImageUrl = (prod: any): string => {
    if (!prod.images || prod.images.length === 0) return '/logo.png'; 
    const link = prod.images[0].link;
    return link.startsWith('http') ? link : `http://localhost:8080/rest/image/file/${link}`;
  };

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); 
    const success = await cartContext.addToCart(product.id, 1, product.price);
    if (success) console.log("Prodotto aggiunto!");
  };

  // 1. Filtriamo i prodotti in base all'ID della sottocategoria presente nell'URL
  const filteredProducts = subId 
    ? products.filter(p => p.subcategory?.id === parseInt(subId))
    : products;

  // 2. Calcoliamo l'impaginazione SOLO sui prodotti filtrati (risolve l'errore di currentPage)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="home-container">
      
      <div className="banner-wrapper">
        <div className="banner-content">
          <span className="banner-text">Benvenuti in Gardenia</span>
        </div>
      </div>

      <div className="products-section">
        <div className="products-container">
          <div className="products-grid">
            {currentProducts.map(product => (
              <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
                <div className="product-image">
                  <img src={getImageUrl(product)} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">€ {(product.price || 0).toFixed(2)}</p>
                  <button 
                    className="btn w-100 fw-bold" 
                    style={{ backgroundColor: '#2e7d32', color: 'white' }}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    Aggiungi al Carrello
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <div className="pagination-info">
                Pagina {currentPage} di {totalPages}
              </div>
              <div className="pagination-row">
                <button 
                  className="nav-arrow" 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                
                <div className="page-numbers-row">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button 
                      key={number}
                      className={`page-num-btn ${currentPage === number ? 'active' : ''}`} 
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                <button 
                  className="nav-arrow" 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Home;