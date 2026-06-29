import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { config } from '../config/data';

const Cart = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 300);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container page-with-navbar">
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>shopping_bag</span>
          </div>
          <h2 className="text-headline-md text-on-background">
            Seu carrinho está vazio
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Explore nossa lista de presentes e escolha algo especial para nos ajudar a montar nosso novo lar!
          </p>
          <Link to="/" className="btn-primary text-label-md">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            Ver Lista de Presentes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-with-navbar cart-page">
      <div className="cart-header">
        <h1 className="text-headline-lg text-on-background animate-in">
          Seu Carrinho
        </h1>
        <p className="text-body-lg text-on-surface-variant animate-in animate-in-delay-1" style={{ maxWidth: '560px' }}>
          Obrigado por nos ajudar a montar nossa nova casa. Escolha como gostaria de contribuir.
        </p>
      </div>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items-list">
          {cartItems.map((item, index) => (
            <article
              key={item.id}
              className={`cart-item ${removingId === item.id ? 'removing' : ''}`}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="cart-item-body">
                <div className="cart-item-image">
                  <img src={item.imageUrl} alt={item.title} />
                </div>
                <div className="cart-item-details">
                  <div>
                    <div className="cart-item-header">
                      <div>
                        <span className="text-label-sm cart-item-category">
                          {item.category}
                        </span>
                        <h3 className="text-headline-sm text-on-background cart-item-title">{item.title}</h3>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="cart-item-remove"
                        aria-label={`Remover ${item.title}`}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-footer">
                    <div className="text-headline-sm text-primary cart-item-price">
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </div>
                    <div className="cart-qty-control">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="cart-qty-btn"
                        aria-label="Diminuir quantidade"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
                      </button>
                      <span className="text-label-md" style={{ width: '24px', textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="cart-qty-btn"
                        aria-label="Aumentar quantidade"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cart-item-actions">
                <button className="btn-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>payments</span>
                  Enviar Valor no Pix
                </button>
                <button className="btn-secondary">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>storefront</span>
                  Comprar Item Físico
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="cart-summary">
            <h2 className="text-headline-sm text-on-background cart-summary-title">
              Resumo
            </h2>
            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span className="text-body-md text-on-surface-variant">
                  Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} {cartItems.reduce((s, i) => s + i.quantity, 0) === 1 ? 'item' : 'itens'})
                </span>
                <span className="text-body-md text-on-surface-variant">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="cart-summary-row">
                <span className="text-body-md text-secondary">Taxa</span>
                <span className="text-body-md text-secondary">Grátis</span>
              </div>
            </div>
            <div className="cart-summary-total">
              <span className="text-body-lg text-on-background" style={{ fontWeight: 600 }}>Total</span>
              <span className="text-headline-md text-primary">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            </div>

            <button className="btn-primary" style={{ width: '100%', marginBottom: '12px', padding: '16px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>pix</span>
              Contribuir via PIX
            </button>
            <p className="text-label-sm text-on-surface-variant cart-pix-info">
              Chave PIX: <strong>{config.pixKey}</strong>
              <br />em nome de {config.pixName}
            </p>

            <div className="cart-back-link">
              <Link to="/" className="text-label-md text-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                Continuar Vendo a Lista
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
