import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './Home.css'; 

// Definiamo il tipo per TypeScript (come avevi in Angular)
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

  // Stato (equivalente a signal() in Angular)
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const pageSize = 10;
  const isHome = !(categoryName && subcategoryName);

  // Caricamento dei prodotti (equivalente a ngOnInit)
  useEffect(() => {
    setPageIndex(0); // Resetta la pagina quando cambi categoria

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // ROTTE AGGIORNATE IN BASE AL TUO PRODUCTCONTROLLER JAVA
        const url = subcategoryId 
          ? `http://localhost:8080/rest/product/findBySubcategory?subcategoryId=${subcategoryId}`
          : `http://localhost:8080/rest/product/list`;

        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          // Il tuo backend dovrebbe restituire direttamente la lista o un oggetto Resp.
          // Se la griglia è vuota dopo aver caricato, potresti dover scrivere: setProducts(data.object || data);
          setProducts(data);
        } else {
          setError('Impossibile caricare i prodotti dal server.');
        }
      } catch (err) {
        console.error(err);
        setError('Errore di connessione. Il backend Spring Boot è acceso?');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName, subcategoryName, subcategoryId]);

  // Funzioni di supporto
  const navigateToProductDetails = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const getImageUrl = (product: Product): string => {
    if (!product || !product.images || product.images.length === 0) {
      return '/img/image.png'; // Immagine di fallback (assumendo che sia nella cartella public/img)
    }
    const link = product.images[0].link;
    return link.startsWith('http') ? link : `http://localhost:8080/rest/image/file/${link}`;
  };

  const handlePageChange = (newIndex: number) => {
    setPageIndex(newIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Paginazione
  const totalPagesCount = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  return (
    <div className="home-container">
      {/* Mostra il banner solo se siamo nella vera Home */}
      {isHome && (
        <div className="banner-wrapper">
          <div className="banner-container">
            <div className="banner-content">
              <span className="banner-text">Welcome to</span>
              {/* Usa il logo dalla cartella public di Vite */}
              <img src="/img/image3.png" alt="Gardenia Logo" className="banner-logo" /> 
            </div>
          </div>
        </div>
      )}

      <section className="products-section">
        <div className="products-container">
          
          {/* Gestione Stato: Caricamento, Errore, Vuoto */}
          {loading ? (
            <div className="loading-message"><p>Caricamento prodotti in corso...</p></div>
          ) : error ? (
            <div className="error-message" style={{color: 'red', textAlign: 'center'}}><p>{error}</p></div>
          ) : products.length === 0 ? (
            <div className="empty-message"><p>Nessun prodotto trovato in questa categoria.</p></div>
          ) : (
            <>
              {/* Griglia Prodotti */}
              <div className="products-grid">
                {paginatedProducts.map((product) => (
                  <div className="product-card" key={product.id}>
                    <div className="product-image" onClick={() => navigateToProductDetails(product.id)} style={{cursor: 'pointer'}}>
                      <img src={getImageUrl(product)} alt={product.name} className="card-image" />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name" onClick={() => navigateToProductDetails(product.id)} style={{cursor: 'pointer'}}>
                        {product.name}
                      </h3>
                      <p className="product-price">€{product.price.toFixed(2)}</p>
                      <p className={`product-stock ${product.stock < 5 ? 'low-stock' : ''}`} style={{color: product.stock < 5 ? 'red' : 'green'}}>
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginazione */}
              {products.length > pageSize && (
                <div className="pagination-wrapper" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button disabled={pageIndex === 0} onClick={() => handlePageChange(pageIndex - 1)}>
                    Precedente
                  </button>
                  <span>Pagina {pageIndex + 1} di {totalPagesCount}</span>
                  <button disabled={pageIndex >= totalPagesCount - 1} onClick={() => handlePageChange(pageIndex + 1)}>
                    Successiva
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </div>
  );
};

export default Home;