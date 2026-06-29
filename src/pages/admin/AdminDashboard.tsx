import { Link, useNavigate } from 'react-router-dom';
import { Settings, Gift, Users, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="admin-dashboard page-with-navbar">
      <div className="admin-logout-row">
        <button onClick={handleLogout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogOut style={{ width: '20px', height: '20px' }} />
          Sair
        </button>
      </div>
      <div className="admin-dashboard-header">
        <Settings className="text-primary animate-in admin-dashboard-icon" />
        <h1 className="text-headline-md text-on-background animate-in" style={{ marginBottom: '16px' }}>Painel de Administração</h1>
        <p className="text-body-md text-on-surface-variant animate-in">Gerencie os presentes e a lista de convidados do casamento.</p>
      </div>

      <div className="admin-dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <Link to="/admin/presents" className="detail-card animate-in animate-in-delay-1" style={{ display: 'block' }}>
          <Gift className="text-primary" style={{ width: '48px', height: '48px', marginBottom: '16px' }} />
          <h2 className="text-headline-sm text-on-background detail-card-title">Gerenciar Presentes</h2>
          <p className="text-body-md text-on-surface-variant">Adicione, edite ou remova os itens da lista de presentes. Os links buscarão imagens automaticamente.</p>
        </Link>

        <Link to="/admin/rsvp" className="detail-card animate-in animate-in-delay-2" style={{ display: 'block' }}>
          <Users className="text-primary" style={{ width: '48px', height: '48px', marginBottom: '16px' }} />
          <h2 className="text-headline-sm text-on-background detail-card-title">Lista de Convidados (RSVP)</h2>
          <p className="text-body-md text-on-surface-variant">Veja quem confirmou presença, gerencie acompanhantes e gere listas em PDF.</p>
        </Link>

        <Link to="/admin/donations" className="detail-card animate-in animate-in-delay-3" style={{ display: 'block' }}>
          <Heart className="text-primary" style={{ width: '48px', height: '48px', marginBottom: '16px' }} />
          <h2 className="text-headline-sm text-on-background detail-card-title">Presentes Recebidos</h2>
          <p className="text-body-md text-on-surface-variant">Visualize quem deu qual presente, acompanhe os nomes e baixe relatórios das doações em PDF.</p>
        </Link>
      </div>
    </div>
  );
}
