import React, { useState, useEffect, useMemo } from 'react';
import { BlenderHelp, CreateBlenderHelpPayload, FilterParams } from './types/blender-help';
import { fetchShortcuts, createShortcut, deleteShortcut, fallbackShortcuts } from './services/api';
import { Navbar } from './components/Navbar';
import { SearchAndFilters } from './components/SearchAndFilters';
import { ShortcutCard } from './components/ShortcutCard';
import { CreateShortcutModal } from './components/CreateShortcutModal';
import './App.css';

export const App: React.FC = () => {
  const [items, setItems] = useState<BlenderHelp[]>(fallbackShortcuts);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterParams>({
    version: 'Todas',
    tag: '',
    mode: 'Todos',
    category: '',
    search: '',
  });

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchShortcuts();
      if (data && data.length > 0) {
        setItems(data);
      }
    } catch (e) {
      console.error('Error cargando atajos:', e);
    } finally {
      setLoading(false);
    }
  };

  // Versiones disponibles dinámicamente
  const availableVersions = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => {
      if (i.blenderVersion && i.blenderVersion !== 'All') {
        set.add(i.blenderVersion);
      }
    });
    set.add('All');
    return Array.from(set).sort();
  }, [items]);

  // Modos de trabajo disponibles
  const availableModes = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => {
      if (i.mode && i.mode !== 'All') {
        set.add(i.mode);
      }
    });
    return Array.from(set).sort();
  }, [items]);

  // Etiquetas disponibles
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => {
      i.tags.forEach(t => set.add(t.toLowerCase().trim()));
    });
    return Array.from(set).sort();
  }, [items]);

  // Filtrado reactivo en cliente (instantáneo y ultra rápido)
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Filtro por Versión
      if (filters.version !== 'Todas') {
        const itemVer = item.blenderVersion.toLowerCase();
        const filterVer = filters.version.toLowerCase();
        const matches = itemVer.includes(filterVer) || itemVer === 'all' || filterVer === 'all';
        if (!matches) return false;
      }

      // Filtro por Modo
      if (filters.mode !== 'Todos') {
        if (item.mode.toLowerCase() !== filters.mode.toLowerCase() && item.mode.toLowerCase() !== 'all') {
          return false;
        }
      }

      // Filtro por Etiqueta (Tag)
      if (filters.tag) {
        const hasTag = item.tags.some(t => t.toLowerCase() === filters.tag.toLowerCase());
        if (!hasTag) return false;
      }

      // Búsqueda por texto (Search)
      if (filters.search) {
        const s = filters.search.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(s);
        const matchShortcut = item.shortcut.toLowerCase().includes(s);
        const matchDesc = item.description.toLowerCase().includes(s);
        const matchTip = item.tip ? item.tip.toLowerCase().includes(s) : false;
        const matchTag = item.tags.some(t => t.toLowerCase().includes(s));
        if (!matchTitle && !matchShortcut && !matchDesc && !matchTip && !matchTag) {
          return false;
        }
      }

      return true;
    });
  }, [items, filters]);

  // Crear nuevo atajo
  const handleCreate = async (payload: CreateBlenderHelpPayload) => {
    const created = await createShortcut(payload);
    setItems(prev => [created, ...prev]);
  };

  // Eliminar atajo
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este atajo?')) return;
    await deleteShortcut(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // Resetear filtros
  const handleResetFilters = () => {
    setFilters({
      version: 'Todas',
      tag: '',
      mode: 'Todos',
      category: '',
      search: '',
    });
  };

  return (
    <div className="blender-app-container">
      {/* Barra superior de navegación */}
      <Navbar
        totalCount={items.length}
        filteredCount={filteredItems.length}
        onOpenCreate={() => setIsModalOpen(true)}
      />

      {/* Contenido Principal */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 60px 24px' }}>
        {/* Buscador y Filtros por Versión / Modo / Etiquetas */}
        <SearchAndFilters
          filters={filters}
          availableVersions={availableVersions}
          availableModes={availableModes}
          availableTags={availableTags}
          onChange={setFilters}
          onReset={handleResetFilters}
        />

        {/* Lista de Atajos */}
        {filteredItems.length === 0 ? (
          <div style={{
            background: '#1f1f23',
            border: '1px dashed #3f3f46',
            borderRadius: 12,
            padding: '48px 24px',
            textAlign: 'center',
            color: '#a1a1aa',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontSize: 18, color: '#fff', marginBottom: 6 }}>
              No se encontraron atajos con los filtros aplicados
            </h3>
            <p style={{ fontSize: 13, marginBottom: 16 }}>
              Prueba cambiando la versión de Blender, quitando la etiqueta seleccionada o limpiando la búsqueda.
            </p>
            <button
              onClick={handleResetFilters}
              style={{
                background: '#ea7600',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Restablecer todos los filtros
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: 18,
          }}>
            {filteredItems.map(item => (
              <ShortcutCard
                key={item.id}
                item={item}
                selectedTag={filters.tag}
                onTagClick={(tag) => setFilters(prev => ({ ...prev, tag }))}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal para Crear Atajo */}
      <CreateShortcutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default App;
