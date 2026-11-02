import React, { useState } from 'react';
import { CreateBlenderHelpPayload } from '../types/blender-help';

interface CreateShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateBlenderHelpPayload) => Promise<void>;
}

export const CreateShortcutModal: React.FC<CreateShortcutModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [shortcut, setShortcut] = useState('');
  const [description, setDescription] = useState('');
  const [blenderVersion, setBlenderVersion] = useState('4.2 LTS');
  const [mode, setMode] = useState('Edit Mode');
  const [category, setCategory] = useState('Modelado');
  const [tagsInput, setTagsInput] = useState('');
  const [tip, setTip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortcut.trim() || !description.trim()) {
      alert('Por favor completa al menos el título, la combinación de teclas y la descripción.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        shortcut: shortcut.trim(),
        description: description.trim(),
        blenderVersion: blenderVersion.trim(),
        mode: mode.trim(),
        category: category.trim(),
        tags: tags.length > 0 ? tags : ['general'],
        tip: tip.trim() || undefined,
      });

      // Limpiar formulario y cerrar
      setTitle('');
      setShortcut('');
      setDescription('');
      setTagsInput('');
      setTip('');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error guardando el atajo. Revisa la consola.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 16,
    }}>
      <div style={{
        background: '#242428',
        border: '1px solid #4a4a55',
        borderRadius: 12,
        width: '100%',
        maxWidth: 580,
        boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Header Modal */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #38383f',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>➕</span> Agregar Nuevo Atajo / Ayuda
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a1a1aa',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Título */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#d4d4d8' }}>
              Título / Acción *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Inset Faces (Insertar Caras)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Atajo / Teclas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#d4d4d8' }}>
              Atajo / Teclas *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. I  o  Ctrl + Shift + B"
              value={shortcut}
              onChange={(e) => setShortcut(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Versión y Modo en 2 columnas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#d4d4d8' }}>
                Versión de Blender *
              </label>
              <select
                value={blenderVersion}
                onChange={(e) => setBlenderVersion(e.target.value)}
                style={inputStyle}
              >
                <option value="All">All (Todas las versiones)</option>
                <option value="5.2 LTS">5.2 LTS (Reciente)</option>
                <option value="5.0">5.0</option>
                <option value="4.2 LTS">4.2 LTS</option>
                <option value="4.0">4.0</option>
                <option value="3.6 LTS">3.6 LTS</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#d4d4d8' }}>
                Modo de Trabajo *
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                style={inputStyle}
              >
                <option value="Edit Mode">Edit Mode</option>
                <option value="Object Mode">Object Mode</option>
                <option value="Sculpt Mode">Sculpt Mode</option>
                <option value="UV Editor">UV Editor</option>
                <option value="Shader Editor">Shader Editor</option>
                <option value="Graph Editor">Graph Editor</option>
                <option value="All">All</option>
              </select>
            </div>
          </div>

          {/* Categoría y Etiquetas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#d4d4d8' }}>
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={inputStyle}
              >
                <option value="Modelado">Modelado</option>
                <option value="Escultura">Escultura</option>
                <option value="Rigging">Rigging</option>
                <option value="Animación">Animación</option>
                <option value="UV Mapping">UV Mapping</option>
                <option value="Viewport">Viewport</option>
                <option value="Materiales">Materiales</option>
                <option value="General">General</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#d4d4d8' }}>
                Etiquetas (separadas por coma) *
              </label>
              <input
                type="text"
                placeholder="ej: caras, inset, mesh, geometria"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Descripción */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#d4d4d8' }}>
              Descripción *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Explica qué hace la herramienta y cómo funciona..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Tip Opcional */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#d4d4d8' }}>
              Tip / Consejo Rápido (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Pulsa dos veces 'I' para insertar caras individuales."
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#27272a',
                color: '#d4d4d8',
                border: '1px solid #3f3f46',
                borderRadius: 6,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: '#ea7600',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 20px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Atajo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  background: '#18181b',
  border: '1px solid #3f3f46',
  borderRadius: 6,
  padding: '8px 12px',
  color: '#fff',
  fontSize: 13,
  outline: 'none',
};
