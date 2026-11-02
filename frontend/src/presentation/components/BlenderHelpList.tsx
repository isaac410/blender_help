import React from 'react';
import { BlenderHelp } from '../../domain/blender-help.model';
import { Trash2, HelpCircle, Edit3 } from 'lucide-react';

interface BlenderHelpListProps {
  items: BlenderHelp[];
  onDelete: (item: BlenderHelp) => void;
  onEdit: (item: BlenderHelp) => void;
  searchQuery: string;
  searchKeywords: string;
  searchVersion: string;
  hasSearched: boolean;
}

export const BlenderHelpList: React.FC<BlenderHelpListProps> = ({
  items,
  onDelete,
  onEdit,
  searchQuery,
  searchKeywords,
  searchVersion,
  hasSearched,
}) => {
  // Utility function to highlight search terms
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} style={{ backgroundColor: 'rgba(232, 125, 13, 0.3)', color: '#fff', borderRadius: '2px', padding: '0 2px' }}>
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const isKeywordMatched = (keyword: string, query: string, searchKeys: string) => {
    const cleanQuery = query.toLowerCase().trim();
    if (cleanQuery && keyword.toLowerCase().includes(cleanQuery)) {
      return true;
    }
    const keys = searchKeys
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k);
    return keys.some((k) => keyword.toLowerCase().includes(k));
  };

  const isVersionMatched = (version: string, filterVersion: string) => {
    if (!filterVersion.trim()) return false;
    return version.toLowerCase().includes(filterVersion.toLowerCase().trim());
  };

  return (
    <div className="shortcuts-grid">
      {items.map((item) => (
        <div key={item.id} className="shortcut-card">
          <div>
            <div className="shortcut-header">
              <h3 className="shortcut-question">
                {highlightText(item.question, searchQuery)}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                <span 
                  className="shortcut-version"
                  style={isVersionMatched(item.version, searchVersion) ? {
                    borderColor: 'rgba(232, 125, 13, 0.5)',
                    color: 'var(--accent-orange)',
                    backgroundColor: 'rgba(232, 125, 13, 0.08)'
                  } : {}}
                >
                  v{item.version}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', opacity: 0.7, whiteSpace: 'nowrap' }} title="Fecha de persistencia">
                  {new Date(item.updatedAt).toLocaleDateString('es-ES')} {new Date(item.updatedAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="shortcut-explanation">
              {item.explanation}
            </div>
          </div>

          <div className="shortcut-footer">
            <div className="shortcut-tags">
              {item.keywords.map((word, idx) => (
                <span 
                  key={idx} 
                  className={`tag ${isKeywordMatched(word, searchQuery, searchKeywords) ? 'tag-highlight' : ''}`}
                >
                  #{word}
                </span>
              ))}
              {item.keywords.length === 0 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Sin etiquetas
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => onEdit(item)}
                className="btn"
                style={{ padding: '0.4rem 0.6rem', backgroundColor: '#383838', border: '1px solid var(--border-color)' }}
                title="Editar atajo"
              >
                <Edit3 size={15} style={{ color: 'var(--text-primary)' }} />
              </button>
              <button
                onClick={() => onDelete(item)}
                className="btn btn-danger"
                style={{ padding: '0.4rem 0.6rem' }}
                title="Eliminar atajo"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="no-results">
          <HelpCircle size={48} style={{ color: 'var(--text-muted)' }} />
          <div>
            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>
              {!hasSearched ? 'Realiza una búsqueda' : 'No se encontraron atajos'}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {!hasSearched
                ? 'Escribe un texto o palabras clave arriba y presiona Enter o haz clic en "Buscar" para listar los atajos.'
                : 'Prueba ajustando los términos de búsqueda o palabras clave.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
