import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-content">
        <Link to="/" className="nav-logo">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '22px' }}>favorite</span>
          Anna & Lucas
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            A Lista
          </Link>
          <Link to="/rsvp" className={`nav-link ${location.pathname === '/rsvp' ? 'active' : ''}`}>
            Confirmar Presença
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Link to="/cart" aria-label="Shopping Cart" className="nav-cart-btn">
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span className="cart-badge" key={cartCount}>{cartCount}</span>
            )}
          </Link>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <Link to="/" className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>home</span>
          A Lista
        </Link>
        <Link to="/rsvp" className={`mobile-nav-link ${location.pathname === '/rsvp' ? 'active' : ''}`}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span>
          Confirmar Presença
        </Link>
        <Link to="/cart" className={`mobile-nav-link ${location.pathname === '/cart' ? 'active' : ''}`}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_bag</span>
          Carrinho {cartCount > 0 && `(${cartCount})`}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
