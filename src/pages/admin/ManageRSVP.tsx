import { useState, useEffect, useCallback } from 'react';
import { Download, Loader2, Users, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { getRSVPs, deleteRSVP, type RSVP } from '../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ManageRSVP() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const fetchRSVPs = useCallback(async () => {
    try {
      const data = await getRSVPs();
      setRsvps(data);
    } catch (err) {
      console.error('Failed to fetch RSVPs', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRSVPs();
  }, [fetchRSVPs]);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Lista de Convidados Confirmados', 14, 22);
    
    // Info
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32);
    
    const confirmedRsvps = rsvps.filter(r => r.status === 'confirmed');
    doc.text(`Total confirmados: ${confirmedRsvps.length}`, 14, 40);

    // Table
    autoTable(doc, {
      startY: 50,
      head: [['Nome', 'Email', 'Telefone', 'Acompanhante', 'Mensagem']],
      body: confirmedRsvps.map(r => [
        r.name,
        r.email || '-',
        r.phone,
        r.companion === 'yes' ? r.companion_name || 'Sim' : 'Não',
        r.message || '-'
      ]),
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [79, 70, 187] },
    });

    doc.save('convidados-confirmados.pdf');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta confirmação?')) return;
    try {
      await deleteRSVP(id);
      fetchRSVPs();
    } catch (err) {
      console.error('Failed to delete RSVP', err);
    }
  };

  const confirmed = rsvps.filter(r => r.status === 'confirmed');
  const declined = rsvps.filter(r => r.status === 'declined');

  return (
    <div className="admin-page page-with-navbar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: '16px' }}>
        <h1 className="text-headline-md text-on-background">Lista de Convidados</h1>
        {rsvps.length > 0 && (
          <button onClick={generatePDF} className="btn-primary">
            <Download style={{ width: '20px', height: '20px' }} />
            Baixar PDF
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: 'var(--space-xl)' }}>
        <div className="detail-card animate-in" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
          <Users className="text-primary" style={{ width: '28px', height: '28px', margin: '0 auto 8px' }} />
          <div className="text-headline-md text-on-background">{rsvps.length}</div>
          <div className="text-label-sm text-on-surface-variant">Total</div>
        </div>
        <div className="detail-card animate-in animate-in-delay-1" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
          <CheckCircle className="text-secondary" style={{ width: '28px', height: '28px', margin: '0 auto 8px' }} />
          <div className="text-headline-md text-on-background">{confirmed.length}</div>
          <div className="text-label-sm text-on-surface-variant">Confirmados</div>
        </div>
        <div className="detail-card animate-in animate-in-delay-2" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
          <XCircle style={{ width: '28px', height: '28px', margin: '0 auto 8px', color: 'var(--error)' }} />
          <div className="text-headline-md text-on-background">{declined.length}</div>
          <div className="text-label-sm text-on-surface-variant">Recusados</div>
        </div>
      </div>

      {/* Table */}
      <div className="detail-card animate-in animate-in-delay-1" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div className="admin-loading"><Loader2 className="animate-spin text-primary" style={{ width: '32px', height: '32px', margin: '0 auto' }} /></div>
        ) : rsvps.length === 0 ? (
          <div className="admin-empty">Nenhuma confirmação de presença.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="text-label-md">Nome</th>
                  <th className="text-label-md">Contato</th>
                  <th className="text-label-md">Status</th>
                  <th className="text-label-md">Acompanhante</th>
                  <th className="text-label-md">Mensagem</th>
                  <th className="text-label-md">Ações</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map(r => (
                  <tr key={r.id}>
                    <td className="text-body-md text-on-background">{r.name}</td>
                    <td className="text-body-sm text-on-surface-variant">
                      {r.email && <div>{r.email}</div>}
                      <div>{r.phone}</div>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: r.status === 'confirmed' ? 'var(--secondary-container)' : 'var(--error-container)',
                        color: r.status === 'confirmed' ? 'var(--on-secondary-container)' : 'var(--on-error-container)',
                      }}>
                        {r.status === 'confirmed' ? 'Confirmado' : 'Recusou'}
                      </span>
                    </td>
                    <td className="text-body-sm text-on-surface-variant">
                      {r.companion === 'yes' ? r.companion_name || 'Sim' : 'Não'}
                    </td>
                    <td className="text-body-sm text-on-surface-variant" style={{ maxWidth: '200px' }}>
                      {r.message ? (
                        <div 
                          onClick={() => setSelectedMessage(r.message)}
                          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}
                          title="Clique para ler a mensagem completa"
                        >
                          <MessageCircle style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.message}</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleDelete(r.id)} style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} title="Remover">
                        <XCircle style={{ width: '20px', height: '20px' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="modal-content animate-in" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '24px', position: 'relative' }}>
            <button onClick={() => setSelectedMessage(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'var(--surface-variant)', color: 'var(--on-surface-variant)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <XCircle style={{ width: '20px', height: '20px' }} />
            </button>
            <h3 className="text-headline-sm text-on-background" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle className="text-primary" style={{ width: '24px', height: '24px' }} />
              Mensagem
            </h3>
            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
              <p className="text-body-md text-on-surface-variant" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {selectedMessage}
              </p>
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }} onClick={() => setSelectedMessage(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
