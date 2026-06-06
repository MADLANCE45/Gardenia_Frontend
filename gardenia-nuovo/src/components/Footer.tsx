import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-content">
          
          <div className="footer-column">
            <h3>Menu</h3>
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/user/orders">My Orders</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><i className="bi bi-facebook"></i></a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><i className="bi bi-instagram"></i></a>
              <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer"><i className="bi bi-tiktok"></i></a>
              <a href="https://www.youtube.com/" target="_blank" rel="noreferrer"><i className="bi bi-youtube"></i></a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Gardenia Shop - All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;