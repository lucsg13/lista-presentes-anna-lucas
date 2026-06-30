import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, Image as ImageIcon, Link as LinkIcon, Loader2, X } from 'lucide-react';
import { getPresents, addPresent, updatePresent, deletePresent, type Present } from '../../services/api';
import { categories } from '../../config/data';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';
export default function ManagePresents() {
  const [presents, setPresents] = useState<Present[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: categories[0] || '',
    description: '',
    links: [''],
    image_url: '',
    status: 'available' as 'available' | 'claimed'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchPresents = useCallback(async () => {
    try {
      const data = await getPresents();
      setPresents(data);
    } catch (err) {
      console.error('Failed to fetch presents', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPresents();
  }, [fetchPresents]);

  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return '';
    const cents = parseInt(cleanValue, 10);
    return (cents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;
    if (name === 'price') {
      value = formatCurrency(value);
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = value;
    setFormData({ ...formData, links: newLinks });
  };

  const addLinkField = () => {
    setFormData({ ...formData, links: [...formData.links, ''] });
  };

  const removeLinkField = (index: number) => {
    if (formData.links.length > 1) {
      const newLinks = formData.links.filter((_, i) => i !== index);
      setFormData({ ...formData, links: newLinks });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId && !imageFile && !formData.image_url) {
      alert('Por favor, selecione uma foto para o presente.');
      return;
    }

    const parsedPrice = parseFloat(formData.price.replace(/\./g, '').replace(',', '.'));
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('Por favor, insira um preço válido.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        const fileRef = ref(storage, `presents/${Date.now()}_${imageFile.name}`);
        await uploadBytes(fileRef, imageFile);
        finalImageUrl = await getDownloadURL(fileRef);
      }

      const payload = {
        name: formData.name,
        price: parsedPrice,
        category: formData.category,
        description: formData.description,
        links: formData.links.filter(l => l.trim() !== ''),
        image_url: finalImageUrl,
        status: formData.status
      };

      if (editingId) {
        await updatePresent(editingId, payload);
      } else {
        await addPresent(payload);
      }
      
      setFormData({ name: '', price: '', category: categories[0] || '', description: '', links: [''], image_url: '', status: 'available' });
      setImageFile(null);
      setEditingId(null);
      fetchPresents();
    } catch (err) {
      console.error('Failed to save present', err);
      alert('Erro ao salvar presente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (p: Present) => {
    setEditingId(p.id);
    const formattedPrice = p.price.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    setFormData({
      name: p.name,
      price: formattedPrice,
      category: p.category || categories[0] || '',
      description: p.description || '',
      links: p.links && p.links.length > 0 ? p.links : [''],
      image_url: p.image_url,
      status: p.status || 'available'
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este presente?')) return;
    try {
      await deletePresent(id);
      fetchPresents();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', category: categories[0] || '', description: '', links: [''], image_url: '', status: 'available' });
    setImageFile(null);
  };

  return (
    <div className="admin-page page-with-navbar">
      <h1 className="text-headline-md text-on-background" style={{ marginBottom: 'var(--space-lg)' }}>Gerenciar Presentes</h1>
      
      <div className="admin-form-card">
        <div className="detail-card animate-in">
          <h2 className="text-headline-sm text-on-background" style={{ marginBottom: 'var(--space-lg)' }}>{editingId ? 'Editar Presente' : 'Adicionar Novo Presente'}</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            <div>
              <label className="text-label-md text-on-surface-variant" style={{ display: 'block', marginBottom: '8px' }}>Nome do Presente *</label>
              <input 
                required 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className="input-field" 
              />
            </div>
            <div>
              <label className="text-label-md text-on-surface-variant" style={{ display: 'block', marginBottom: '8px' }}>Preço (R$) *</label>
              <input 
                required 
                type="text" 
                name="price" 
                value={formData.price} 
                onChange={handleInputChange} 
                className="input-field" 
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="text-label-md text-on-surface-variant" style={{ display: 'block', marginBottom: '8px' }}>Categoria *</label>
              <select
                required
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                </select>
              </div>
              
              <div>
                <label className="text-label-md text-on-surface-variant" style={{ display: 'block', marginBottom: '8px' }}>Status *</label>
                <select
                  required
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="available">Disponível</option>
                  <option value="claimed">Esgotado (Já Presenteado)</option>
                </select>
              </div>
            <div>
              <label className="text-label-md text-on-surface-variant" style={{ display: 'block', marginBottom: '8px' }}>Foto do Produto {editingId && formData.image_url ? '(Opcional se mantida)' : '*'}</label>
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml, image/*"
                onChange={handleFileChange} 
                className="input-field"
                required={!editingId && !formData.image_url}
              />
              {editingId && formData.image_url && !imageFile && (
                <p className="text-label-sm text-secondary" style={{ marginTop: '4px' }}>Imagem atual mantida.</p>
              )}
            </div>
            <div className="admin-form-full">
              <label className="text-label-md text-on-surface-variant" style={{ display: 'block', marginBottom: '8px' }}>Descrição *</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field"
                rows={3}
                placeholder="Detalhes sobre o produto..."
              />
            </div>
            <div className="admin-form-full">
              <label className="text-label-md text-on-surface-variant" style={{ display: 'block', marginBottom: '8px' }}>Links do Produto *</label>
              {formData.links.map((link, index) => (
                <div key={index} className="admin-input-icon" style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                  <LinkIcon style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input 
                    required={index === 0}
                    type="url" 
                    value={link} 
                    onChange={(e) => handleLinkChange(index, e.target.value)} 
                    className="input-field"
                    placeholder="https://..."
                    style={{ paddingLeft: '40px', flexGrow: 1 }}
                  />
                  {formData.links.length > 1 && (
                    <button type="button" onClick={() => removeLinkField(index)} className="btn-outline" style={{ padding: '8px', border: 'none' }} title="Remover Link">
                      <X style={{ width: '20px', height: '20px', color: 'var(--error)' }} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addLinkField} className="btn-outline text-label-md" style={{ marginTop: '4px' }}>
                <Plus style={{ width: '16px', height: '16px', marginRight: '4px' }} /> Adicionar outro link
              </button>
            </div>
            <div className="admin-form-actions">
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="btn-outline">
                  Cancelar
                </button>
              )}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? <Loader2 className="animate-spin" style={{ width: '20px', height: '20px' }} /> : <Plus style={{ width: '20px', height: '20px' }} />}
                {editingId ? 'Salvar Alterações' : 'Adicionar Presente'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="detail-card animate-in animate-in-delay-1" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div className="admin-loading"><Loader2 className="animate-spin text-primary" style={{ width: '32px', height: '32px', margin: '0 auto' }} /></div>
        ) : presents.length === 0 ? (
          <div className="admin-empty">Nenhum presente cadastrado.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="text-label-md">Imagem</th>
                  <th className="text-label-md">Nome</th>
                  <th className="text-label-md">Preço</th>
                  <th className="text-label-md">Ações</th>
                </tr>
              </thead>
              <tbody>
                {presents.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="admin-table-img" />
                      ) : (
                        <div className="admin-table-placeholder">
                          <ImageIcon style={{ width: '24px', height: '24px', color: 'var(--outline)' }} />
                        </div>
                      )}
                    </td>
                    <td className="text-body-md text-on-background">
                      {p.name}
                      <span className="text-label-sm text-secondary" style={{ display: 'block', marginTop: '4px' }}>{p.category}</span>
                      {p.links && p.links.length > 0 && p.links[0] !== '' && (
                        <a href={p.links[0]} target="_blank" rel="noreferrer" className="text-label-sm text-primary" style={{ display: 'block', marginTop: '4px' }}>{p.links.length} Link(s)</a>
                      )}
                      {p.status === 'claimed' && (
                        <span style={{ display: 'inline-block', marginTop: '6px', padding: '2px 8px', backgroundColor: 'var(--surface-variant)', color: 'var(--secondary)', borderRadius: '12px', fontSize: '11px', fontWeight: 600, border: '1px solid var(--outline-variant)' }}>
                          Esgotado / Presenteado
                        </span>
                      )}
                    </td>
                    <td className="text-body-md text-on-surface-variant">R$ {p.price.toFixed(2)}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button onClick={() => handleEdit(p)} style={{ color: 'var(--primary)' }} title="Editar">
                          <Edit2 style={{ width: '20px', height: '20px' }} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} style={{ color: 'var(--error)' }} title="Remover">
                          <Trash2 style={{ width: '20px', height: '20px' }} />
                        </button>
                      </div>
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
