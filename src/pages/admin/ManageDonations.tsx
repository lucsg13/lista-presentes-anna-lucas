import { useState, useEffect, useCallback } from 'react';
import { Download, Loader2, Gift, XCircle } from 'lucide-react';
import { getDonations, deleteDonation, type Donation } from '../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ManageDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDonations = useCallback(async () => {
    try {
      const data = await getDonations();
      setDonations(data);
    } catch (err) {
      console.error('Failed to fetch donations', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Lista de Presentes Recebidos', 14, 22);
    
    // Info
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 32);
    doc.text(`Total de presentes: ${donations.length}`, 14, 40);

    // Table
    autoTable(doc, {
      startY: 50,
      head: [['Presente', 'Doador', 'Data']],
      body: donations.map(d => [
        d.present_name,
        d.donor_name,
        new Date(d.created_at).toLocaleDateString('pt-BR') + ' ' + new Date(d.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      ]),
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [79, 70, 187] },
    });

    doc.save('presentes-recebidos.pdf');
  };

  const handleDelete = async (donationId: string, presentId: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta doação? Isso liberará o presente novamente na lista dos convidados.')) return;
    try {
      await deleteDonation(donationId, presentId);
      fetchDonations();
    } catch (err) {
      console.error('Failed to delete donation', err);
    }
  };

  return (
    <div className="admin-page page-with-navbar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: '16px' }}>
        <h1 className="text-headline-md text-on-background">Presentes Recebidos</h1>
        {donations.length > 0 && (
          <button onClick={generatePDF} className="btn-primary">
            <Download style={{ width: '20px', height: '20px' }} />
            Baixar PDF
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: 'var(--space-xl)' }}>
        <div className="detail-card animate-in" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
          <Gift className="text-primary" style={{ width: '28px', height: '28px', margin: '0 auto 8px' }} />
          <div className="text-headline-md text-on-background">{donations.length}</div>
          <div className="text-label-sm text-on-surface-variant">Presentes Doados</div>
        </div>
      </div>

      {/* Table */}
      <div className="detail-card animate-in animate-in-delay-1" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div className="admin-loading"><Loader2 className="animate-spin text-primary" style={{ width: '32px', height: '32px', margin: '0 auto' }} /></div>
        ) : donations.length === 0 ? (
          <div className="admin-empty">Nenhum presente recebido ainda.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="text-label-md">Presente</th>
                  <th className="text-label-md">Doador</th>
                  <th className="text-label-md">Data</th>
                  <th className="text-label-md">Ações</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d.id}>
                    <td className="text-body-md text-on-background">{d.present_name}</td>
                    <td className="text-body-md text-on-background">{d.donor_name}</td>
                    <td className="text-body-sm text-on-surface-variant">
                      {new Date(d.created_at).toLocaleDateString('pt-BR')} {new Date(d.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <button onClick={() => handleDelete(d.id, d.present_id)} style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} title="Excluir/Liberar Presente">
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
    </div>
  );
}
