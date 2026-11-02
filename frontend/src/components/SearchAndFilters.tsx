import React from 'react';
import { FilterParams } from '../types/blender-help';
import { TagBadge } from './TagBadge';

interface SearchAndFiltersProps {
  filters: FilterParams;
  availableVersions: string[];
  availableModes: string[];
  availableTags: string[];
  onChange: (newFilters: FilterParams) => void;
  onReset: () => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  filters,
  availableVersions,
  availableModes,
  availableTags,
  onChange,
  onReset,
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.version !== 'Todas' ||
    filters.mode !== 'Todos' ||
    filters.tag !== '';

  return (
    <div style={{
      background: '#1f1f23',
      border: '1px solid #333338',
      borderRadius: 12,
      padding: '20px 24px',
      marginBottom: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    }}>
      {/* Fila Principal: Buscador y Selectores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 14,
        alignItems: 'end',
      }}>
        {/* Buscador de texto */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#d4d4d8' }}>
            🔍 Buscar por acción, teclas o descripción:
          </label>
          <input
            type="text"
            placeholder="Ej. extrusión, Ctrl + B, bevel, rayos x..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            style={{
              background: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 14,
              color: '#fff',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#ea7600')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#3f3f46')}
          />
        </div>

        {/* Selector de Versión de Blender */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#d4d4d8' }}>
            🔷 Versión de Blender:
          </label>
          <select
            value={filters.version}
            onChange={(e) => onChange({ ...filters, version: e.target.value })}
            style={{
              background: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 13,
              color: '#fff',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="Todas">Todas las versiones</option>
            {availableVersions.map((v, i) => (
              <option key={i} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de Modo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#d4d4d8' }}>
            🛠️ Modo de Trabajo:
          </label>
          <select
            value={filters.mode}
            onChange={(e) => onChange({ ...filters, mode: e.target.value })}
            style={{
              background: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 13,
              color: '#fff',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="Todos">Todos los modos</option>
            {availableModes.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fila de Etiquetas Rápidas (Tag Cloud) */}
      <div style={{ borderTop: '1px solid #2d2d32', paddingTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#a1a1aa', fontWeight: 600 }}>
            🏷️ Filtrar por etiquetas clave:
          </span>
          {isFiltered && (
            <button
              onClick={onReset}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ea7600',
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Limpiar todos los filtros ✕
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {availableTags.map((t, idx) => (
            <TagBadge
              key={idx}
              tag={t}
              isSelected={filters.tag.toLowerCase() === t.toLowerCase()}
              onClick={(clickedTag) => {
                if (filters.tag.toLowerCase() === clickedTag.toLowerCase()) {
                  onChange({ ...filters, tag: '' }); // Toggle off
                } else {
                  onChange({ ...filters, tag: clickedTag });
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
