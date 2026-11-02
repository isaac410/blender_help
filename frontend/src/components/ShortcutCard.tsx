import React, { useState } from 'react';
import { BlenderHelp } from '../types/blender-help';
import { VersionBadge } from './VersionBadge';
import { TagBadge } from './TagBadge';

interface ShortcutCardProps {
  item: BlenderHelp;
  selectedTag: string;
  onTagClick: (tag: string) => void;
  onDelete: (id: string) => void;
}

export const ShortcutCard: React.FC<ShortcutCardProps> = ({ item, selectedTag, onTagClick, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.shortcut);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  // Convertir atajo como "Ctrl + Alt + E" en teclas separadas para <kbd>
  const keys = item.shortcut.split('+').map(k => k.trim());

  return (
    <div
      style={{
        background: '#242428',
        border: '1px solid #38383f',
        borderRadius: 10,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
        position: 'relative',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = '#52525e';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = '#38383f';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header: Modo & Versión */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <VersionBadge version={item.blenderVersion} />
          <span style={{
            background: 'rgba(34, 116, 165, 0.15)',
            color: '#70b6e5',
            border: '1px solid rgba(34, 116, 165, 0.4)',
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
          }}>
            {item.mode}
          </span>
        </div>

        <button
          onClick={() => onDelete(item.id)}
          title="Eliminar este atajo"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#71717a',
            fontSize: 16,
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: 4,
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
          onMouseOut={(e) => (e.currentTarget.style.color = '#71717a')}
        >
          ✕
        </button>
      </div>

      {/* Titulo */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f4f4f5', marginBottom: 4 }}>
          {item.title}
        </h3>
        <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.45 }}>
          {item.description}
        </p>
      </div>

      {/* Teclas <kbd> & Botón Copiar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#18181b',
        border: '1px solid #2f2f35',
        borderRadius: 8,
        padding: '8px 12px',
        marginTop: 4,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {keys.map((k, idx) => (
            <React.Fragment key={idx}>
              <kbd
                style={{
                  background: 'linear-gradient(180deg, #2f2f36 0%, #202026 100%)',
                  border: '1px solid #4a4a55',
                  boxShadow: '0 2px 0 #121215',
                  borderRadius: 5,
                  padding: '3px 8px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#fbbf24',
                  letterSpacing: '0.02em',
                }}
              >
                {k}
              </kbd>
              {idx < keys.length - 1 && <span style={{ color: '#71717a', fontSize: 12, fontWeight: 600 }}>+</span>}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={handleCopy}
          style={{
            background: copied ? '#10b981' : '#27272a',
            color: copied ? '#fff' : '#d4d4d8',
            border: `1px solid ${copied ? '#059669' : '#3f3f46'}`,
            borderRadius: 5,
            padding: '4px 10px',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {copied ? '✓ ¡Copiado!' : '📋 Copiar'}
        </button>
      </div>

      {/* Tip / Consejo rápido (si existe) */}
      {item.tip && (
        <div style={{
          background: 'rgba(234, 118, 0, 0.08)',
          borderLeft: '3px solid #ea7600',
          padding: '8px 10px',
          borderRadius: '0 6px 6px 0',
          fontSize: 12,
          color: '#e4e4e7',
          display: 'flex',
          gap: 6,
          lineHeight: 1.4,
        }}>
          <span style={{ fontSize: 14 }}>💡</span>
          <div>
            <strong style={{ color: '#ea7600' }}>Tip:</strong> {item.tip}
          </div>
        </div>
      )}

      {/* Etiquetas / Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto', paddingTop: 6 }}>
        {item.tags.map((t, idx) => (
          <TagBadge
            key={idx}
            tag={t}
            isSelected={selectedTag.toLowerCase() === t.toLowerCase()}
            onClick={onTagClick}
          />
        ))}
      </div>
    </div>
  );
};
