import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css'; // Importiamo il CSS personalizzato!

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      
      {/* Sezione Introduttiva */}
      <div className="about-hero-section text-center">
        <h1 className="about-title text-success mb-3">Chi Siamo</h1>
        <p className="lead text-secondary mx-auto" style={{ maxWidth: '600px' }}>
          La tua oasi verde online, dedicata a portare la bellezza e la purezza della natura direttamente a casa tua.
        </p>
      </div>
      
      {/* Sezione Testo e Immagine */}
      <div className="row align-items-center mb-5 pb-5">
        <div className="col-lg-6 mb-5 mb-lg-0">
          <div className="about-image-wrapper text-center">
            <img 
              src="/logo.png" 
              alt="Gardenia Logo" 
              className="img-fluid"
              style={{ maxHeight: '280px', objectFit: 'contain' }}
            />
          </div>
        </div>
        
        <div className="col-lg-6 px-lg-5">
          <h2 className="fw-bold text-dark mb-4">Radici forti, idee verdi.</h2>
          <p className="about-text">
            Siamo un team di esperti e appassionati di botanica, dedicati a portare la bellezza delle piante, 
            la maestosità degli alberi e tutto l'occorrente per il giardinaggio a professionisti e amatori.
          </p>
          <p className="about-text">
            In <strong>Gardenia</strong> crediamo che ogni spazio, grande o piccolo, possa trasformarsi in un ecosistema rigoglioso. 
            Selezioniamo solo i prodotti migliori dai vivaisti di fiducia, garantendo attenzione all'ambiente 
            e spedizioni curate in ogni minimo dettaglio.
          </p>
        </div>
      </div>

      {/* Sezione Vantaggi / Feature */}
      <div className="row text-center g-4 mt-2 mb-5">
        <div className="col-md-4">
          <div className="about-feature-card">
            <div className="feature-icon-box">
              <i className="bi bi-tree text-success"></i>
            </div>
            <h4 className="fw-bold mb-3">Qualità Premium</h4>
            <p className="text-muted mb-0">Specie botaniche e attrezzature selezionate dai migliori vivaisti.</p>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="about-feature-card">
            <div className="feature-icon-box">
              <i className="bi bi-box-seam text-success"></i>
            </div>
            <h4 className="fw-bold mb-3">Spedizioni Sicure</h4>
            <p className="text-muted mb-0">Imballaggi ecologici studiati per proteggere la vitalità delle piante.</p>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="about-feature-card">
            <div className="feature-icon-box">
              <i className="bi bi-headset text-success"></i>
            </div>
            <h4 className="fw-bold mb-3">Supporto Esperti</h4>
            <p className="text-muted mb-0">Siamo sempre a disposizione per consigli su rinvasi e potature.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center pt-4 mb-5">
        <button 
          className="btn btn-success btn-lg px-5 py-3 fw-bold shadow-sm rounded-pill" 
          onClick={() => navigate('/')}
        >
          Esplora il Negozio <i className="bi bi-arrow-right ms-2"></i>
        </button>
      </div>

    </div>
  );
};

export default AboutUs;