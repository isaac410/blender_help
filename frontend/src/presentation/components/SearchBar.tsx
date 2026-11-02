import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, keywords: string, version: string) => void;
  onClear: () => void;
  loading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClear, loading }) => {
  const [query, setQuery] = useState('');
  const [keywords, setKeywords] = useState('');
  const [version, setVersion] = useState('');

  const handleSearch = () => {
    // Only search if at least one input has value
    if (query.trim() === '' && keywords.trim() === '' && version.trim() === '') {
      return;
    }
    onSearch(query, keywords, version);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line in textarea
      handleSearch();
    }
  };

  // Global keydown listener to clear inputs on Ctrl+X
  useEffect(() => {
    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'x') {
        e.preventDefault(); // Prevent default browser "Cut" behavior
        setQuery('');
        setKeywords('');
        setVersion('');
        onClear(); // Reset search results on clear
      }
    };
    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => window.removeEventListener('keydown', handleKeyDownGlobal);
  }, [onClear]);

  return (
    <div className="panel search-panel">
      <div className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <Search size={18} style={{ color: 'var(--accent-orange)' }} />
        Buscador de Atajos
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ flex: '2 1 300px' }}>
          <label className="form-label" htmlFor="search-query">Buscar en Preguntas / Tareas (Enter para buscar)</label>
          <textarea
            id="search-query"
            name="search-query"
            className="form-input search-textarea"
            style={{ minHeight: '44px', height: '44px', resize: 'none', padding: '0.6rem 0.75rem' }}
            placeholder="Ej: como ocultar (Ctrl+X para limpiar)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="form-group" style={{ flex: '1 1 200px' }}>
          <label className="form-label" htmlFor="search-keywords">Filtrar por Keywords (sep. por comas)</label>
          <input
            id="search-keywords"
            name="search-keywords"
            type="text"
            className="form-input"
            style={{ height: '44px', padding: '0.6rem 0.75rem' }}
            placeholder="Ej: edit_mode, arista"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="form-group" style={{ flex: '0 1 120px' }}>
          <label className="form-label" htmlFor="search-version">Versión de Blender</label>
          <input
            id="search-version"
            name="search-version"
            type="text"
            className="form-input"
            style={{ height: '44px', padding: '0.6rem 0.75rem' }}
            placeholder="Ej: 4.2"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{ height: '44px', minWidth: '100px' }}
            onClick={handleSearch}
            disabled={loading}
          >
            <Search size={16} />
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>
    </div>
  );
};
