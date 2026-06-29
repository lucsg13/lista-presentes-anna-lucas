import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { config, categories } from '../config/data';
import Toast from '../components/Toast';
import { getPresents, claimPresent } from '../services/api';

interface Present {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  links: string[];
  image_url: string;
  status?: 'available' | 'claimed';
}

const SPECIAL_GIFT = {
  id: 'special-donation',
  title: 'Doe o que seu coraçãozinho mandar',
  description: 'Doe o que vc quiser e puder, não importa o valor, receberemos com muito carinho e prazer. Muito Obrigado! ',
  price: 0,
  category: 'Especial',
  imageUrl: '/doa.jpeg',
  links: [],
  status: 'available'
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [gifts, setGifts] = useState<any[]>([]);
  const [selectedGift, setSelectedGift] = useState<any | null>(null);
  const [modalStep, setModalStep] = useState<number>(1);
  const [isClaiming, setIsClaiming] = useState(false);
  const [pendingLink, setPendingLink] = useState('');

  useEffect(() => {
    getPresents()
      .then((data: Present[]) => {
        const formattedGifts = data.map(p => ({
          id: p.id.toString(),
          title: p.name,
          price: p.price,
          category: p.category || 'Geral',
          description: p.description,
          links: p.links,
          imageUrl: p.image_url || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop',
          status: p.status || 'available'
        }));
        setGifts([SPECIAL_GIFT, ...formattedGifts]);
      })
      .catch(err => console.error('Error fetching presents:', err));
  }, []);

  const filteredGifts = selectedCategory && selectedCategory !== 'Geral'
    ? gifts.filter(g => g.category === selectedCategory)
    : gifts;

  const displayedGifts = showAll ? filteredGifts : filteredGifts.slice(0, 4);

  const handleClaim = async () => {
    if (!selectedGift) return;
    setIsClaiming(true);
    try {
      await claimPresent(selectedGift.id);
      setGifts(gifts.map(g => g.id === selectedGift.id ? { ...g, status: 'claimed' } : g));
      setModalStep(3);
    } catch (err) {
      console.error(err);
      setToastMsg('Erro ao confirmar o presente. Tente novamente.');
      setToastVisible(true);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleOpenGift = (gift: any) => {
    if (gift.status === 'claimed') return;
    setSelectedGift(gift);
    setModalStep(1);
  };

  const handleLinkClick = (link: string) => {
    setPendingLink(link);
    setModalStep(4);
  };

  const copyPix = () => {
    navigator.clipboard.writeText(config.pixKey);
    setToastMsg('Chave PIX copiada!');
    setToastVisible(true);
  };

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-content-inner">
            <div className="hero-header-flex animate-in">
              <div className="hero-header-text">
                <span className="hero-badge animate-in">
                  ✦ Sejam bem-vindos!
                </span>
                <h1 className="text-headline-lg text-primary hero-title animate-in animate-in-delay-1">
                  📦 Mudança à vista!
                </h1>
              </div>
              <div className="hero-profile-container animate-in animate-in-delay-1">
                <img src="/couple.jpeg" alt="Anna & Lucas" className="hero-profile-image" />
              </div>
            </div>
            <div className="hero-divider animate-in animate-in-delay-2" />
            <div className="text-body-lg text-on-surface-variant hero-text animate-in animate-in-delay-2">
              <p>Família e amigos, finalmente estamos de malas prontas para começar nossa nova vida juntos! 🏠✨<br/>
              Para comemorar esse passo tão importante, vamos fazer um Chá de Casa Nova e queremos você lá com a gente!</p>
              
              <p><strong>🎁 Quer nos dar uma força?</strong><br/>
              Como começar do zero dá trabalho (e haja pano de prato!), montamos uma lista com coisinhas que vão deixar nosso lar com a nossa cara. Ajudem a gente com algum dos presentes abaixo!</p>
              
              <p>Aproveita e já confirma sua presença no final da página 💗</p>
            </div>
            <div className="hero-buttons animate-in animate-in-delay-3">
              <a href="#registry" className="btn-primary text-label-md">
                Ver Lista de Presentes
              </a>
              <Link to="/rsvp" className="btn-secondary text-label-md">
                Confirmar Presença
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-image-container">
          <img src="/hero.jpg" alt="Mudança à vista - Nosso Novo Lar" className="hero-image" />
        </div>
      </section>

      {/* ── DETAILS ── */}
      <section className="details-section" id="story">
        <div className="container">
          <div className="details-header">
            <h2 className="text-headline-md text-on-background">Os Detalhes</h2>
            <p className="text-body-md text-on-surface-variant">Tudo que você precisa saber para o nosso encontro.</p>
          </div>
          <div className="details-grid">
            <div className="detail-card animate-in">
              <div className="icon-container">
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
              <h3 className="text-headline-sm text-on-background detail-card-title">Quando</h3>
              <p className="text-body-md text-on-surface-variant">{config.events.date}</p>
              <p className="text-label-md text-secondary detail-card-subtitle">{config.events.time}</p>
            </div>
            <div className="detail-card animate-in animate-in-delay-1">
              <div className="icon-container">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <h3 className="text-headline-sm text-on-background detail-card-title">Onde</h3>
              <p className="text-body-md text-on-surface-variant">{config.events.locationName}</p>
              <a href={config.events.mapUrl} target="_blank" rel="noopener noreferrer" className="text-body-md text-on-surface-variant detail-card-address" style={{ textDecoration: 'underline', color: 'inherit', display: 'block', marginBottom: '12px' }}>
                {config.events.address}
              </a>
              <a href={config.events.mapUrl} target="_blank" rel="noopener noreferrer" className="text-label-md text-primary detail-card-link">
                Ver no Mapa <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── GIFT REGISTRY ── */}
      <section className="registry-section" id="registry">
        <div className="container">
          <div className="registry-header">
            <h2 className="text-headline-md text-on-background registry-title">Lista de Presentes</h2>
            <p className="text-body-md text-on-surface-variant registry-subtitle">
              Sua presença é o nosso maior presente! Mas se quiser nos ajudar a montar nossa casa, selecionamos alguns itens que precisamos.

              Ah, lembrando que você pode nos enviar pelo PIX ou até mesmo comprar o presente e entregar na festa (se for pequeno, exemplo Air Fryer, panelas, jogos de cama, luminária, decorações e etc...)
            </p>
            <div className="category-filters">
              <button
                className={`category-pill ${selectedCategory === null ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="gift-grid">
            {displayedGifts.map((gift, index) => (
              <div key={gift.id} className={`gift-card animate-in ${gift.status === 'claimed' ? 'gift-claimed' : ''}`} style={{ animationDelay: `${index * 0.08}s`, cursor: gift.status === 'claimed' ? 'default' : 'pointer' }} onClick={() => handleOpenGift(gift)}>
                <div className="gift-image-wrap">
                  <img
                    src={gift.imageUrl}
                    alt={gift.title}
                    className="gift-image"
                    style={gift.status === 'claimed' ? { filter: 'grayscale(80%)', opacity: 0.7 } : {}}
                  />
                  {gift.status === 'claimed' && (
                    <div className="claimed-overlay">
                      <span className="claimed-badge">
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        Já Presenteado
                      </span>
                    </div>
                  )}
                </div>
                <div className="gift-info" style={gift.status === 'claimed' ? { opacity: 0.5 } : {}}>
                  <span className="text-label-sm text-secondary">{gift.category}</span>
                  <h3 className="text-headline-sm text-on-background gift-title">{gift.title}</h3>
                  <p className="gift-price">{gift.price === 0 ? 'Valor à sua escolha' : `R$ ${gift.price.toFixed(2).replace('.', ',')}`}</p>

                  <div className="gift-actions">
                    {gift.status === 'available' ? (
                      <button className="btn-present" onClick={(e) => { e.stopPropagation(); handleOpenGift(gift); }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>redeem</span>
                        Presentear
                      </button>
                    ) : (
                      <button className="btn-present-disabled" disabled style={{ backgroundColor: 'transparent', color: 'var(--secondary)', border: 'none', padding: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>lock</span>
                        Esgotado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredGifts.length > 4 && (
            <div className="show-more-btn">
              <button className="btn-outline text-label-md" onClick={() => setShowAll(!showAll)}>
                {showAll ? 'Ver Menos' : 'Ver Todos os Itens'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── MODAL ── */}
      {selectedGift && (
        <div className="modal-overlay" onClick={() => setSelectedGift(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="modal-content animate-in" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setSelectedGift(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--surface-variant)', color: 'var(--on-surface-variant)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
            </button>
            
            {modalStep === 1 && (
              <>
                <img src={selectedGift.imageUrl} alt={selectedGift.title} style={{ width: '100%', height: '250px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
                <div style={{ padding: '24px' }}>
                  <span className="text-label-sm text-secondary">{selectedGift.category}</span>
                  <h3 className="text-headline-md text-on-background" style={{ margin: '8px 0' }}>{selectedGift.title}</h3>
                  <p className="text-headline-sm text-primary" style={{ marginBottom: '16px' }}>
                    {selectedGift.price === 0 ? 'Qualquer valor é bem-vindo!' : `R$ ${selectedGift.price.toFixed(2).replace('.', ',')}`}
                  </p>
                  
                  {selectedGift.description && (
                    <div style={{ marginBottom: '24px' }}>
                      <h4 className="text-label-lg text-on-background" style={{ marginBottom: '8px' }}>Descrição</h4>
                      <p className="text-body-md text-on-surface-variant" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{selectedGift.description}</p>
                    </div>
                  )}
                  
                  {selectedGift.links && selectedGift.links.length > 0 && selectedGift.links[0] !== '' && (
                    <div style={{ marginBottom: '24px' }}>
                      <h4 className="text-label-lg text-on-background" style={{ marginBottom: '8px' }}>Links Sugeridos</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedGift.links.map((link: string, i: number) => link.trim() !== '' && (
                          <button key={i} onClick={() => handleLinkClick(link)} className="btn-outline text-label-md" style={{ justifyContent: 'center', width: '100%' }}>
                            Ver Opção {i + 1} na Loja
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setModalStep(2)}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>volunteer_activism</span>
                    Presentear via PIX
                  </button>
                </div>
              </>
            )}

            {modalStep === 2 && (
              <div style={{ padding: '40px 24px 24px', textAlign: 'center' }}>
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '48px', marginBottom: '16px' }}>pix</span>
                <h3 className="text-headline-md text-on-background" style={{ marginBottom: '8px' }}>Fazer PIX</h3>
                <p className="text-body-md text-on-surface-variant" style={{ marginBottom: '24px' }}>
                  {selectedGift.price === 0 ? (
                    <>Envie o valor que seu coração mandar para a chave abaixo:</>
                  ) : (
                    <>Envie o valor de <strong>R$ {selectedGift.price.toFixed(2).replace('.', ',')}</strong> para a chave abaixo:</>
                  )}
                </p>
                
                <div style={{ backgroundColor: 'var(--surface-variant)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <p className="text-label-md text-on-background" style={{ marginBottom: '8px', fontWeight: 'bold' }}>QR Code</p>
                  <img src="/pix.png" alt="QR Code PIX" style={{ width: '150px', height: '150px', margin: '0 auto 16px', display: 'block', borderRadius: '8px', border: '4px solid white' }} />
                  
                  <p className="text-label-md text-on-background" style={{ marginBottom: '8px', fontWeight: 'bold' }}>Chave PIX</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <p className="text-body-lg text-primary" style={{ fontWeight: 'bold' }}>65 9 9997-6652</p>
                    <button onClick={copyPix} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', alignItems: 'center', padding: '4px' }} title="Copiar Chave PIX">
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>content_copy</span>
                    </button>
                  </div>
                  <p className="text-label-sm text-secondary" style={{ marginTop: '4px' }}>{config.pixName}</p>
                </div>
                
                <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)', marginBottom: '24px' }} />
                
                <p className="text-label-md text-on-surface-variant" style={{ marginBottom: '16px' }}>
                  Já fez o PIX ou vai entregar no dia?
                </p>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleClaim} disabled={isClaiming}>
                  {isClaiming ? 'Confirmando...' : 'Confirmar Presente'}
                </button>
                
                <button className="btn-text text-label-md" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} onClick={() => setModalStep(1)}>
                  Voltar
                </button>
              </div>
            )}

            {modalStep === 3 && (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(219, 193, 185, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </div>
                <h3 className="text-headline-md text-on-background" style={{ marginBottom: '16px' }}>Muito Obrigado!</h3>
                <p className="text-body-lg text-on-surface-variant" style={{ marginBottom: '32px', lineHeight: '1.5' }}>
                  Vocês são incríveis! Agradecemos de coração pelo <strong>{selectedGift.title}</strong>.<br/><br/>
                  Mal podemos esperar para comemorar juntos!
                </p>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setSelectedGift(null)}>
                  Fechar
                </button>
              </div>
            )}

            {modalStep === 4 && (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '48px', marginBottom: '16px' }}>storefront</span>
                <h3 className="text-headline-md text-on-background" style={{ marginBottom: '16px' }}>Indo para a loja!</h3>
                <p className="text-body-md text-on-surface-variant" style={{ marginBottom: '32px', lineHeight: '1.5' }}>
                  Você será redirecionado para a loja do produto.<br/><br/>
                  Deseja já <strong>reservar este presente</strong> na nossa lista (para ninguém comprar repetido) ou vai apenas dar uma olhadinha por enquanto?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => {
                    window.open(pendingLink, '_blank');
                    handleClaim();
                  }} disabled={isClaiming}>
                    {isClaiming ? 'Confirmando...' : 'Vou comprar e Confirmar Presente'}
                  </button>
                  
                  <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => {
                    window.open(pendingLink, '_blank');
                    setModalStep(1);
                  }}>
                    Apenas dar uma olhadinha
                  </button>
                  
                  <button className="btn-text text-label-md" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} onClick={() => setModalStep(1)}>
                    Voltar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Toast message={toastMsg} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </>
  );
};

export default Home;
