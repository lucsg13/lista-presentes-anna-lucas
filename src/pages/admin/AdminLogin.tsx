import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import { adminLogin } from '../../services/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await adminLogin(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Email ou senha incorretos');
      } else {
        setError(err.message || 'Erro ao fazer login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container page-with-navbar" style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100dvh - var(--navbar-height))', justifyContent: 'center', padding: 'var(--space-lg) var(--gutter)' }}>
      <div className="detail-card animate-in" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: 'var(--primary-container)', color: 'var(--on-primary-container)', borderRadius: '50%', marginBottom: 'var(--space-lg)' }}>
          <Lock style={{ width: '32px', height: '32px' }} />
        </div>
        
        <h1 className="text-headline-md text-on-background" style={{ marginBottom: '8px' }}>Acesso Restrito</h1>
        <p className="text-body-md text-on-surface-variant" style={{ marginBottom: 'var(--space-xl)' }}>
          Digite suas credenciais para acessar a área administrativa.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ textAlign: 'left' }}>
            <label className="text-label-md text-on-surface" style={{ display: 'block', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="admin@exemplo.com"
              required
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label className="text-label-md text-on-surface" style={{ display: 'block', marginBottom: '8px' }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Sua senha..."
              required
            />
          </div>

          {error && (
            <div className="text-body-sm text-error" style={{ textAlign: 'left', backgroundColor: 'var(--error-container)', padding: '12px', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !email || !password}
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
