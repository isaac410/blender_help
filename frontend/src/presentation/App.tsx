import React, { useMemo, useState } from 'react';
import { ApiBlenderHelpRepository } from '../adapters/api-blender-help.repository';
import { useBlenderHelp } from './hooks/useBlenderHelp';
import { SearchBar } from './components/SearchBar';
import { BlenderHelpForm } from './components/BlenderHelpForm';
import { BlenderHelpList } from './components/BlenderHelpList';
import { Sparkles, Library, CheckCircle } from 'lucide-react';
import { BlenderHelp } from '../domain/blender-help.model';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

export const App: React.FC = () => {
  const repository = useMemo(() => new ApiBlenderHelpRepository(), []);
  const {
    items,
    totalCount,
    loading,
    error,
    activeQuery,
    activeKeywords,
    activeVersion,
    hasSearched,
    lastQueryTime,
    lastQuerySummary,
    lastMutationTime,
    executeSearch,
    clearSearch,
    createItem,
    updateItem,
    deleteItem,
  } = useBlenderHelp(repository);

  const [editingItem, setEditingItem] = useState<BlenderHelp | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BlenderHelp | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCreate = async (input: any) => {
    await createItem(input);
    showToast('Atajo guardado correctamente');
  };

  const handleUpdate = async (id: string, input: any) => {
    await updateItem(id, input);
    setEditingItem(null);
    showToast('Atajo actualizado correctamente');
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleOpenDeleteModal = (item: BlenderHelp) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = async (password: string) => {
    if (!itemToDelete) return;
    await deleteItem(itemToDelete.id, password);
    if (editingItem && editingItem.id === itemToDelete.id) {
      setEditingItem(null);
    }
    showToast('Atajo eliminado correctamente');
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo-container">
          <svg className="logo-img" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#E87D0D"/>
          </svg>
          <span className="logo-text">Blender Help</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Library size={15} />
            <span>Resultados: {items.length} | Total guardados: {totalCount}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>
              Última consulta: {lastQueryTime ? (
                `${lastQueryTime.toLocaleDateString('es-ES')} ${lastQueryTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} ${lastQuerySummary || ''}`
              ) : 'Nunca'}
            </span>
            <span>Último cambio: {lastMutationTime ? `${lastMutationTime.toLocaleDateString('es-ES')} ${lastMutationTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : 'Nunca'}</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <SearchBar onSearch={executeSearch} onClear={clearSearch} loading={loading} />

        <BlenderHelpForm 
          onSubmit={handleCreate} 
          onUpdate={handleUpdate}
          editingItem={editingItem}
          onCancelEdit={handleCancelEdit}
        />

        <div className="panel results-panel">
          <h2 className="panel-title" style={{ justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-orange)' }} />
              {hasSearched ? 'Resultados de Búsqueda' : 'Todos los Atajos'}
            </span>
          </h2>

          {error && (
            <div style={{ color: 'var(--danger-color)', fontSize: '0.9rem', backgroundColor: 'rgba(217, 83, 79, 0.1)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(217, 83, 79, 0.2)' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <BlenderHelpList
              items={items}
              onDelete={handleOpenDeleteModal}
              onEdit={setEditingItem}
              searchQuery={activeQuery}
              searchKeywords={activeKeywords}
              searchVersion={activeVersion}
              hasSearched={hasSearched}
            />
          )}
        </div>
      </main>

      {toastMessage && (
        <div className="toast">
          <CheckCircle size={18} style={{ color: 'var(--accent-orange)' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        questionText={itemToDelete?.question || ''}
      />
    </div>
  );
};
