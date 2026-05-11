import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './home.css'; // Il tuo CSS originale!

// Opzionale: definire l'interfaccia base per il Prodotto (TypeScript)
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  images?: { link: string }[];
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. GESTIONE DELL'URL (Sostituisce ActivatedRoute)
  const { categoryName, subcategoryName } = useParams();
  const [searchParams] = useSearchParams();
  const subcategoryId = searchParams.get('subcategoryId');

  // 2. STATO DEL COMPONENTE (Sostituiscono i signal di Angular)
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const pageSize = 10;
  const isHome = !(categoryName && subcategoryName); // Se non ci sono categorie nell'URL, siamo nella Home vera e propria

  // 3. EFFETTO: CARICAMENTO DATI (Sostituisce ngOnInit)
  useEffect(() => {
    // Quando cambia la categoria, resettiamo la pagina a 0
    setPageIndex(0);

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Verifica con il tuo controller Spring Boot i path esatti!
        // Presumo che se c'è subcategoryId chiami un endpoint, altrimenti chiami la lista completa
        let url = 'http://localhost:8080/rest/product/list'; // Sostituisci con il tuo VERO endpoint "getAllProducts"
        
        if (subcategoryId) {
          url = `http://localhost:8080/rest/product/subcategory/${subcategoryId}`; // Sostituisci con il tuo VERO endpoint per le sottocategorie
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          // Se il tuo backend restituisce l'array dentro un oggetto (es. data.object),
          // assicurati di estrarlo correttamente. Ad esempio: setProducts(data.object);
          setProducts(data);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load products. Server unreachable.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, subcategoryName, subcategoryId]); // L'effetto riparte se questi cambiano

  // 4. LOGICA DI SUPPORTO (Metodi e Getters)
  const navigateToProductDetails = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const getImageUrl = (product: Product): string => {
    if (!product || !product.images || product.images.length === 0) {
      return '/assets/no-image.png'; // Attenzione al path in React (dentro la cartella public)
    }
    const link = product.images[0].link;
    return link.startsWith('http') ? link : `http://localhost:8080/rest/image/file/${link}`;
  };

  const handlePageChange = (newIndex: number) => {
    setPageIndex(newIndex);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Proprietà calcolate per la paginazione
  const totalPagesCount = Math.ceil(products.length / pageSize);

  const getVisiblePages = () => {
    const total = totalPagesCount;
    const current = pageIndex;
    const maxVisible = 5;

    let start = Math.max(0, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible);

    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }

    const pages = [];
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();
  const paginatedProducts = products.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  // 5. VIEW (Il template JSX)
  return (
    <div className="home-container">
      {/* Banner */}
      {isHome && (
        <div className="banner-wrapper">
          <div className="banner-container">
            <div className="banner-content">
              <span className="banner-text">Welcome to</span>
              <img src="/img/image3.png" alt="Gardenia Logo" className="banner-logo" />
            </div>
          </div>
        </div>
      )}

      {/* Sezione Prodotti */}
      <section className="products-section">
        <div className="products-container">
          
          {loading ? (
            <div className="loading-message"><p>Loading products...</p></div>
          ) : error ? (
            <div className="error-message"><p>{error}</p></div>
          ) : products.length === 0 ? (
            <div className="empty-message"><p>No products found</p></div>
          ) : (
            <>
              {/* Griglia Prodotti */}
              <div className="products-grid">
                {paginatedProducts.map((product) => (
                  <div className="product-card" key={product.id}>
                    <div className="product-image" onClick={() => navigateToProductDetails(product.id)}>
                      <img src={getImageUrl(product)} alt={product.name} className="card-image" />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name" onClick={() => navigateToProductDetails(product.id)}>
                        {product.name}
                      </h3>
                      <p className="product-price">€{product.price.toFixed(2)}</p>
                      <p className={`product-stock ${product.stock < 5 ? 'low-stock' : ''}`}>
                        Stock: {product.stock}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginazione */}
              {products.length > pageSize && (
                <div className="pagination-wrapper">
                  <div className="pagination-row">
                    <button className="nav-arrow" disabled={pageIndex === 0} onClick={() => handlePageChange(0)}>
                      <span className="material-icons">first_page</span>
                    </button>

                    <button className="nav-arrow" disabled={pageIndex === 0} onClick={() => handlePageChange(pageIndex - 1)}>
                      <span className="material-icons">chevron_left</span>
                    </button>

                    <div className="page-numbers-row">
                      {visiblePages[0] > 0 && <span className="dots">...</span>}

                      {visiblePages.map((n) => (
                        <button
                          key={n}
                          className={`page-num-btn ${n === pageIndex ? 'active' : ''}`}
                          onClick={() => handlePageChange(n)}
                        >
                          {n + 1}
                        </button>
                      ))}

                      {visiblePages[visiblePages.length - 1] < totalPagesCount - 1 && <span className="dots">...</span>}
                    </div>

                    <button className="nav-arrow" disabled={pageIndex >= totalPagesCount - 1} onClick={() => handlePageChange(pageIndex + 1)}>
                      <span className="material-icons">chevron_right</span>
                    </button>

                    <button className="nav-arrow" disabled={pageIndex >= totalPagesCount - 1} onClick={() => handlePageChange(totalPagesCount - 1)}>
                      <span className="material-icons">last_page</span>
                    </button>
                  </div>

                  <div className="pagination-info">
                    {pageIndex * pageSize + 1} – {Math.min((pageIndex + 1) * pageSize, products.length)}{' '}
                    <span className="total-count">of {products.length}</span>
                  </div>
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