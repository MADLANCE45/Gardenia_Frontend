import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './product-details.css'; // Il tuo CSS originale

// --- INTERFACCE TYPESCRIPT ---
interface ProductImage {
  link: string;
}

interface Product {
  id: number;
  name: string;
  price: number;i
  stock: number;
  subcategoryId: number;
  isDeleted?: boolean;
  images?: ProductImage[];
}

interface Review {
  id?: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date?: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATO DEL PRODOTTO ---
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  // --- STATO INTERFACCIA (UI) ---
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false); // Semplificato per ora
  
  // Toasts & Modals
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [reviewIdToDelete, setReviewIdToDelete] = useState<number | null>(null);

  // --- STATO RECENSIONI ---
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState<number | null>(null);
  
  const [filterStars, setFilterStars] = useState(0);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [limit, setLimit] = useState(3);

  // --- LETTURA UTENTE LOGGATO ---
  const getUserName = () => {
    const rawData = localStorage.getItem('user'); // Adattato al tuo Login.tsx
    if (rawData) {
      const parsed = JSON.parse(rawData);
      return parsed.userName || parsed.username || parsed.email;
    }
    return null;
  };
  const userName = getUserName();
  const isLoggedIn = !!userName;

  // --- EFFETTI (Sostituisce ngOnInit) ---
  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      loadProduct(parseInt(id, 10));
      loadReviews(parseInt(id, 10));
      // Qui andrebbe anche il fetch della wishlist se implementato
    }
  }, [id]);

  // --- FETCH DATI ---
  const loadProduct = async (productId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/rest/product/id/${productId}`); // Adatta con il tuo URL
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        loadSuggestedProducts(data.subcategoryId, data.id);
      } else {
        setError('Unable to load product details');
      }
    } catch (err) {
      setError('Unable to load product details');
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestedProducts = async (subcategoryId: number, currentId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/rest/product/subcategory/${subcategoryId}`);
      if (res.ok) {
        const data: Product[] = await res.json();
        setSuggestedProducts(data.filter(p => p.id !== currentId && !p.isDeleted).slice(0, 4));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadReviews = async (productId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/rest/review/product/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- LOGICA UI E CARRELLO ---
  const notify = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleQtyChange = (val: number) => {
    const max = Math.min(10, product?.stock || 0);
    if (val < 1) setQuantity(1);
    else if (val > max) setQuantity(max);
    else setQuantity(val);
  };

  const addToCart = () => {
    if (!isLoggedIn) {
      setDialogMessage('To add products to your cart and complete your purchase, please log in.');
      setIsAuthDialogOpen(true);
      return;
    }
    // Simula l'aggiunta per ora (il prossimo step sarà il Context Globale!)
    setAddedToCart(true);
    notify('Product added to cart!');
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const toggleWishlist = () => {
    if (!isLoggedIn) {
      setDialogMessage('To add products to your wishlist and save them for later, please log in.');
      setIsAuthDialogOpen(true);
      return;
    }
    setIsFavorite(!isFavorite);
    notify(isFavorite ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  // --- LOGICA RECENSIONI ---
  const submitReview = async () => {
    if (!userName || !product || selectedRating === 0) return;

    const reviewData = {
      productId: product.id,
      userName: userName,
      rating: selectedRating,
      comment: reviewComment,
    };

    try {
      const url = isEditing && currentReviewId 
        ? `http://localhost:8080/rest/review/update/${currentReviewId}` 
        : `http://localhost:8080/rest/review/create`;
      const method = isEditing ? 'PUT' : 'POST'; // Verifica i metodi del tuo backend!

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });

      if (res.ok) {
        notify(isEditing ? 'Review updated!' : 'Review posted!');
        cancelEdit();
        loadReviews(product.id);
      }
    } catch (err) {
      notify('Error saving review');
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/rest/review/delete/${reviewId}`, { method: 'DELETE' });
      if (res.ok) {
        notify('Review deleted');
        loadReviews(product!.id);
      }
    } catch (err) {
      notify('Error deleting review');
    } finally {
      setReviewIdToDelete(null);
    }
  };

  const startEdit = (rev: Review) => {
    setIsEditing(true);
    setCurrentReviewId(rev.id || null);
    setSelectedRating(rev.rating);
    setReviewComment(rev.comment);
    document.getElementById('reviews-anchor')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedRating(0);
    setReviewComment('');
    setCurrentReviewId(null);
  };

  // --- PROPRIETÀ CALCOLATE (useMemo sostituisce i getter/computed di Angular) ---
  const images = useMemo(() => {
    if (product?.images && product.images.length > 0) {
      return product.images.map(img => ({
        url: img.link.startsWith('http') ? img.link : `http://localhost:8080/rest/image/file/${img.link}`,
        alt: product.name
      }));
    }
    return [{ url: '/assets/no-image.png', alt: 'No image' }]; // Attento al path in Vite
  }, [product]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return '0.0';
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const processedReviews = useMemo(() => {
    let list = [...reviews];
    if (filterStars > 0) list = list.filter(r => r.rating === filterStars);
    
    list.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
      return b.rating - a.rating;
    });
    return list.slice(0, limit);
  }, [reviews, filterStars, sortBy, limit]);

  // --- VIEW (JSX) ---
  return (
    <div className="product-wrap">
      {loading && <div className="loading-container"><p>Loading product details...</p></div>}
      {error && <div className="error-container"><p>{error}</p></div>}

      {!loading && !error && product && (
        <>
          <div className="gallery-col">
            <div className="thumbs-rail">
              {images.map((img, i) => (
                <button key={i} className={`thumb ${i === activeImageIndex ? 'is-active' : ''}`} onClick={() => setActiveImageIndex(i)}>
                  <img src={img.url} alt={img.alt} loading="lazy" />
                </button>
              ))}
            </div>

            <div className="main-img-box">
              <img className="main-img" src={images[activeImageIndex].url} alt={images[activeImageIndex].alt} />
              <div className="dots">
                {images.map((_, i) => (
                  <button key={i} className={`dot ${i === activeImageIndex ? 'is-active' : ''}`} onClick={() => setActiveImageIndex(i)}></button>
                ))}
              </div>
            </div>
          </div>

          <div className="info-col">
            <h1 className="product-title">{product.name}</h1>

            <div className="rating-summary-top" onClick={() => document.getElementById('reviews-anchor')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 0' }}>
              <div className="stars-display" style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className="star-small" style={{ color: s <= +averageRating ? '#f1c40f' : '#ccc', fontSize: '18px' }}>★</span>
                ))}
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{averageRating}</span>
              <span style={{ color: '#666', fontSize: '14px', textDecoration: 'underline' }}>
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <div className="price-block">
              <span className="price-original">€ {product.price.toFixed(2)}</span>
            </div>

            <hr className="divider" />

            <div className="buy-row">
              <div className="qty-box">
                <button className="qty-btn" onClick={() => handleQtyChange(quantity - 1)} disabled={quantity <= 1}>−</button>
                <input className="qty-input" type="number" value={quantity} onChange={(e) => handleQtyChange(parseInt(e.target.value))} />
                <button className="qty-btn" onClick={() => handleQtyChange(quantity + 1)} disabled={quantity >= 10 || quantity >= product.stock}>+</button>
              </div>

              <button className={`cart-btn ${addedToCart ? 'is-added' : ''}`} onClick={addToCart} disabled={product.stock <= 0}>
                {!addedToCart ? (
                  <>
                    <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39A2 2 0 0 0 9.64 16h9.72a2 2 0 0 0 1.97-1.67L23 6H6" />
                    </svg>
                    <span>Add to cart</span>
                  </>
                ) : (
                  <>
                    <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Added!</span>
                  </>
                )}
              </button>

              <button className="wishlist-btn" onClick={toggleWishlist}>
                <svg className={`heart-icon ${isFavorite ? 'is-favorite' : ''}`} viewBox="0 0 24 24" fill={isFavorite ? 'red' : 'none'} stroke={isFavorite ? 'red' : 'currentColor'} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            <p className="stock-status" style={{ color: product.stock > 0 ? '#2ecc71' : '#e74c3c' }}>
              {product.stock > 0 ? `Available: ${product.stock}` : 'Out of stock'}
            </p>

            <ul className="feature-list">
              <li><span>✓</span> Delivery throughout Italy within 24 hours</li>
              <li><span>✓</span> Plants in excellent health</li>
              <li><span>✓</span> Biodegradable packaging materials</li>
            </ul>
          </div>
        </>
      )}

      {/* Suggerimenti */}
      {suggestedProducts.length > 0 && (
        <section className="suggestions-section">
          <h2 className="suggestions-title">We also suggest...</h2>
          <div className="suggestions-grid">
            {suggestedProducts.map(p => (
              <Link key={p.id} className="suggestion-card" to={`/product/${p.id}`}>
                <div className="suggestion-img-wrap">
                  <img src={p.images?.[0]?.link.startsWith('http') ? p.images[0].link : `/no_image.png`} alt={p.name} loading="lazy" />
                </div>
                <div className="suggestion-info">
                  <p className="suggestion-name">{p.name}</p>
                  <p className="suggestion-price">€ {p.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recensioni */}
      <section className="suggestions-section" id="reviews-anchor">
        <h2 className="suggestions-title">Customer Reviews</h2>
        <div className="reviews-wrapper">
          
          {isLoggedIn ? (
            <div className="review-form">
              <h3>{isEditing ? 'Edit your review' : 'Write a review'}</h3>
              <div className="rating-input-container">
                <span className="rating-label">Your Rating:</span>
                <div className="stars-input-group" style={{ display: 'flex', gap: '5px' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} className={`star-input ${s <= selectedRating ? 'filled' : ''}`} onClick={() => setSelectedRating(s)}>★</span>
                  ))}
                </div>
              </div>
              <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="review-textarea" placeholder="Share your experience..." maxLength={1000} />
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#888' }}>{reviewComment.length} / 1000</div>
              <div className="form-actions">
                <button onClick={submitReview} className="btn-submit" disabled={selectedRating === 0}>
                  {isEditing ? 'Update' : 'Post Review'}
                </button>
                {(isEditing || selectedRating > 0 || reviewComment.length > 0) && (
                  <button onClick={cancelEdit} className="btn-cancel">Cancel</button>
                )}
              </div>
            </div>
          ) : (
            <div className="review-form" style={{ textAlign: 'center', border: '2px dashed #ddd', background: '#f9f9f9', padding: '20px' }}>
              <p style={{ color: '#666', margin: 0 }}>Log in to write a review and share your thoughts!</p>
            </div>
          )}

          {/* Filtri Recensioni */}
          <div className="reviews-controls">
            <div className="control-group">
              <span className="control-label">Sort by:</span>
              <button onClick={() => setSortBy('date')} className={`btn-filter ${sortBy === 'date' ? 'active-sort' : ''}`}>Date</button>
              <button onClick={() => setSortBy('rating')} className={`btn-filter ${sortBy === 'rating' ? 'active-sort' : ''}`}>Rating</button>
            </div>
            <div className="control-group" style={{ marginLeft: 'auto' }}>
              <span className="control-label">Filter:</span>
              {[5, 4, 3, 2, 1].map(s => (
                <button key={s} onClick={() => setFilterStars(s === filterStars ? 0 : s)} className={`btn-star-filter ${filterStars === s ? 'active-star' : ''}`}>{s} ★</button>
              ))}
              {filterStars > 0 && <button onClick={() => setFilterStars(0)} className="btn-reset-filter">Reset</button>}
            </div>
          </div>

          {/* Lista Recensioni */}
          <div className="reviews-list">
            {processedReviews.length > 0 ? processedReviews.map(rev => (
              <div key={rev.id} className="review-card">
                <div className="review-header">
                  <div className="user-info">
                    <span className="review-user">{rev.userName}</span>
                    <div className="stars-display" style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className={`star-small ${s <= rev.rating ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <span className="review-date">{rev.date ? new Date(rev.date).toLocaleDateString() : ''}</span>
                </div>
                {rev.comment && <p className="review-text">"{rev.comment}"</p>}
                {userName === rev.userName && (
                  <div className="review-actions">
                    <button onClick={() => startEdit(rev)} className="btn-edit">Edit</button>
                    <button onClick={() => setReviewIdToDelete(rev.id!)} className="btn-delete-chip">Delete</button>
                  </div>
                )}
              </div>
            )) : (
              <div className="empty-reviews"><p>No reviews found with these criteria.</p></div>
            )}
          </div>

          {reviews.length > limit && filterStars === 0 && (
            <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '20px' }}>
              <button onClick={() => setLimit(l => l + 5)} className="btn-show-more">Show More Reviews</button>
            </div>
          )}
        </div>
      </section>

      {/* --- MODALS (Simulano i <dialog> di Angular) --- */}
      
      {/* Modal Login/Register */}
      {isAuthDialogOpen && (
        <div className="modal-overlay">
          <div className="modal-content auth-modal">
            <h2>Login or Register</h2>
            <p>{dialogMessage} If you don't have an account, you can register for free.</p>
            <div className="modal-actions">
              <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
              <button className="btn-register" onClick={() => navigate('/register')}>Register</button>
            </div>
            <button className="btn-close" onClick={() => setIsAuthDialogOpen(false)}>Maybe later</button>
          </div>
        </div>
      )}

      {/* Modal Conferma Eliminazione Recensione */}
      {reviewIdToDelete !== null && (
        <div className="modal-overlay">
          <div className="cart-modal-content">
            <h2 className="modal-title" style={{ marginBottom: '10px' }}>Remove Review</h2>
            <p className="modal-text" style={{ marginBottom: '25px' }}>Are you sure you want to remove this review?</p>
            <div className="modal-actions-vertical">
              <button className="btn-confirm-delete" onClick={() => deleteReview(reviewIdToDelete)}>Remove</button>
              <button className="btn-cancel-flat" onClick={() => setReviewIdToDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div className={`custom-alert ${showToast ? 'active' : ''}`}>
        <div className="alert-body">
          <div className="alert-icon">✓</div>
          <div className="alert-text"><p>{toastMessage}</p></div>
          <button className="alert-close" onClick={() => setShowToast(false)}>✕</button>
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;