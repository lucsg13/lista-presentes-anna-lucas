import { useState, type FormEvent } from 'react';
import { addRSVP } from '../services/api';

const RSVP = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendance, setAttendance] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companion, setCompanion] = useState<string>('no');
  const [companionName, setCompanionName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addRSVP({
        name,
        email,
        phone,
        status: attendance === 'yes' ? 'confirmed' : 'declined',
        companion,
        companion_name: companionName,
        message,
        created_at: new Date().toISOString()
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to submit RSVP', err);
      alert('Houve um erro ao enviar sua confirmação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rsvp-container page-with-navbar">
        <div className="rsvp-wrapper">
          <div className="rsvp-success">
            <div className="rsvp-success-icon">
              <span className="material-symbols-outlined" style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}>
                {attendance === 'yes' ? 'celebration' : 'favorite'}
              </span>
            </div>
            <h1 className="text-headline-md text-primary">
              {attendance === 'yes' ? 'Que alegria!' : 'Obrigado!'}
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              {attendance === 'yes'
                ? `${name ? name.split(' ')[0] + ', n' : 'N'}ão vemos a hora de celebrar com você! Nos vemos em breve.`
                : `${name ? name.split(' ')[0] + ', s' : 'S'}entiremos sua falta, mas agradecemos por avisar. Será sempre bem-vindo(a)!`}
            </p>
            <button
              className="btn-secondary text-label-md"
              onClick={() => {
                setSubmitted(false);
                setAttendance(null);
                setName('');
                setEmail('');
                setPhone('');
                setCompanion('no');
                setCompanionName('');
                setMessage('');
              }}
            >
              Enviar Outra Resposta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rsvp-container page-with-navbar">
      <div className="rsvp-wrapper">
        <div className="rsvp-header">
          <div className="rsvp-illustration">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX4J9aRlHJR0sBPkkLXdDSDO8OI0c-SLCR6wmmq4HiyKtc4ucC3x06sirJMrQRoy2nzwcuq3S-YxOv0wzKbF_6luCaRlHwX37LPNQvgmO7aX3-_yN0gzKU8D9RJIkOGBMUno-HUo_O2qf7A1rfL5XQoRaiqBIBcqJsV4cD4bnb6dZ3ex78v3xKLVAGe6qA_EJHMNcdb3-H63phfZ713I6syhInBuJBUcQVYx2iGK439kp8dods1hBd3s4gZ8v9QgXoCqgfUo_w7LA" alt="Ilustração" />
          </div>
          <h1 className="text-headline-lg text-primary rsvp-page-title">
            Confirmar Presença
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Mal podemos esperar para celebrar com você!
          </p>
        </div>

        <div className="rsvp-form">
          <form onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label htmlFor="fullName" className="text-label-md text-on-surface-variant">Nome Completo</label>
              <input
                type="text"
                id="fullName"
                placeholder="Digite seu nome completo"
                required
                className="input-field"
                style={{ backgroundColor: 'var(--surface-bright)' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="text-label-md text-on-surface-variant">E-mail</label>
              <input
                type="email"
                id="email"
                placeholder="seu.email@exemplo.com"
                className="input-field"
                style={{ backgroundColor: 'var(--surface-bright)' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber" className="text-label-md text-on-surface-variant">Telefone</label>
              <input
                type="tel"
                id="phoneNumber"
                placeholder="(00) 00000-0000"
                required
                className="input-field"
                style={{ backgroundColor: 'var(--surface-bright)' }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group-spaced">
              <label className="text-label-md text-on-surface-variant">Você vai comparecer?</label>
              <div className="radio-grid">
                <label className="radio-card">
                  <input
                    type="radio"
                    name="attendance"
                    value="yes"
                    required
                    onChange={() => setAttendance('yes')}
                    checked={attendance === 'yes'}
                  />
                  <div className="radio-card-content">
                    <span className="material-symbols-outlined radio-icon" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    <span className="text-label-md text-on-surface-variant" style={{ textAlign: 'center' }}>Com certeza!</span>
                  </div>
                </label>
                <label className="radio-card">
                  <input
                    type="radio"
                    name="attendance"
                    value="no"
                    onChange={() => setAttendance('no')}
                    checked={attendance === 'no'}
                  />
                  <div className="radio-card-content">
                    <span className="material-symbols-outlined radio-icon">mail</span>
                    <span className="text-label-md text-on-surface-variant" style={{ textAlign: 'center' }}>Infelizmente não</span>
                  </div>
                </label>
              </div>
            </div>

            {attendance === 'yes' && (
              <>
                <div className="form-group-spaced">
                  <label className="text-label-md text-on-surface-variant">Levará acompanhante?</label>
                  <div className="radio-grid">
                    <label className="radio-card">
                      <input
                        type="radio"
                        name="companion"
                        value="yes"
                        onChange={() => setCompanion('yes')}
                        checked={companion === 'yes'}
                      />
                      <div className="radio-card-content">
                        <span className="text-label-md text-on-surface-variant" style={{ textAlign: 'center' }}>Sim</span>
                      </div>
                    </label>
                    <label className="radio-card">
                      <input
                        type="radio"
                        name="companion"
                        value="no"
                        onChange={() => setCompanion('no')}
                        checked={companion === 'no'}
                      />
                      <div className="radio-card-content">
                        <span className="text-label-md text-on-surface-variant" style={{ textAlign: 'center' }}>Não</span>
                      </div>
                    </label>
                  </div>
                </div>

                {companion === 'yes' && (
                  <div className="form-group">
                    <label htmlFor="companionName" className="text-label-md text-on-surface-variant">Nome do Acompanhante</label>
                    <input
                      type="text"
                      id="companionName"
                      placeholder="Nome completo do acompanhante"
                      required
                      className="input-field"
                      style={{ backgroundColor: 'var(--surface-bright)' }}
                      value={companionName}
                      onChange={(e) => setCompanionName(e.target.value)}
                    />
                  </div>
                )}
              </>
            )}

            <div className="form-group">
              <label htmlFor="message" className="text-label-md text-on-surface-variant">Mensagem (Opcional)</label>
              <textarea
                id="message"
                placeholder="Deixe uma mensagem para os noivos"
                className="input-field"
                style={{ backgroundColor: 'var(--surface-bright)', minHeight: '100px', resize: 'vertical' }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="form-submit">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary text-label-md" 
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Resposta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RSVP;
