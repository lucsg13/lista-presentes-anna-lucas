import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <Link to="/" className="footer-logo">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}>favorite</span>
            Anna & Lucas
          </Link>
          <div className="footer-links">
            <a href="mailto:contato@anna-lucas.com">Contato</a>
            <a href="#">Dúvidas</a>
          </div>
        </div>
        <div className="footer-divider" />
        <p className="footer-credit" style={{ textAlign: 'center' }}>
          Com amor, Anna & Lucas · 2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;
