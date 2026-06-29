import { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <footer>
        <div className="container">
          <div className="footer-content">
            <Link to="/" className="footer-logo">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}>favorite</span>
              Anna & Lucas
            </Link>
            <div className="footer-links">
              <button 
                onClick={() => setShowContact(true)} 
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--on-surface)', cursor: 'pointer', font: 'inherit', textDecoration: 'none' }}
              >
                Contato
              </button>
            </div>
          </div>
          <div className="footer-divider" />
          <p className="footer-credit" style={{ textAlign: 'center' }}>
            Com amor, Anna & Lucas · 2026
          </p>
        </div>
      </footer>

      {showContact && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 'var(--space-md)' }} 
          onClick={() => setShowContact(false)}
        >
          <div 
            className="detail-card animate-in" 
            style={{ width: '100%', maxWidth: '320px', padding: 'var(--space-xl)', textAlign: 'center' }} 
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-headline-sm text-on-background" style={{ marginBottom: 'var(--space-md)' }}>Fale com a gente!</h3>
            
            <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <a href="https://wa.me/5581981091799" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                <span>Anninha</span>
                <span>(81) 98109-1799</span>
                <span>🟢</span>
              </a>
              
              <a href="https://wa.me/5565999976652" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                <span>Lucas</span>
                <span>(65) 99997-6652</span>
                <span>🟢</span>
              </a>
            </div>

            <button onClick={() => setShowContact(false)} className="btn-primary" style={{ width: '100%' }}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
