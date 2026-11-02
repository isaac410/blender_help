import React from 'react';

interface NavbarProps {
  totalCount: number;
  filteredCount: number;
  onOpenCreate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ totalCount, filteredCount, onOpenCreate }) => {
  return (
    <header style={{
      background: '#1f1f23',
      borderBottom: '1px solid #333338',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        {/* Logo & Titulo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #ea7600 0%, #d85d00 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(234, 118, 0, 0.4)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" fill="#ffffff" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
                Blender Help & Shortcuts
              </h1>
              <span style={{
                background: 'rgba(234, 118, 0, 0.15)',
                color: '#ea7600',
                border: '1px solid rgba(234, 118, 0, 0.3)',
                fontSize: 11,
                fontWeight: 600,
                padding: '1px 7px',
                borderRadius: 10,
              }}>
                v2.0
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#a1a1aa' }}>
              Base de conocimiento rápido por versión y etiquetas
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Contador */}
          <div style={{
            fontSize: 12,
            color: '#a1a1aa',
            background: '#27272a',
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #3f3f46',
          }}>
            Mostrando <strong style={{ color: '#fff' }}>{filteredCount}</strong> de <strong style={{ color: '#ea7600' }}>{totalCount}</strong> ayudas
          </div>

          {/* Swagger link */}
          <a
            href="http://localhost:4000/api/docs"
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: 'none',
              fontSize: 12,
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.1)',
              padding: '7px 12px',
              borderRadius: 6,
              border: '1px solid rgba(56, 189, 248, 0.3)',
              fontWeight: 500,
            }}
          >
            📘 Swagger API
          </a>

          {/* Botón Nuevo Atajo */}
          <button
            onClick={onOpenCreate}
            style={{
              background: '#ea7600',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '7px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 6px rgba(234, 118, 0, 0.3)',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#ff8c1a')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#ea7600')}
          >
            <span>+</span> Agregar Atajo / Ayuda
          </button>
        </div>
      </div>
    </header>
  );
};
