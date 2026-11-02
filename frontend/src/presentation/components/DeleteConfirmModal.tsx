import React, { useState, useEffect, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  questionText: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  questionText,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(null);
      setLoading(false);
      // Auto focus the input after modal animation mounts
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('La contraseña es requerida');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await onConfirm(password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Contraseña incorrecta u ocurrió un error');
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="modal-title">Confirmar Eliminación</span>
          <button 
            type="button"
            onClick={onClose} 
            className="btn" 
            style={{ padding: '0.25rem', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <X size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'flex', gap: '0.75rem', backgroundColor: 'rgba(217, 83, 79, 0.1)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(217, 83, 79, 0.15)', color: 'var(--danger-color)', fontSize: '0.85rem', lineHeight: '1.4' }}>
              <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>¿Estás seguro de que deseas eliminar este atajo?</strong>
                <p style={{ marginTop: '0.25rem', wordBreak: 'break-all', opacity: 0.9 }}>
                  "{questionText}"
                </p>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <label className="form-label" htmlFor="delete-password">
                Contraseña de Confirmación
              </label>
              <input
                ref={inputRef}
                type="password"
                id="delete-password"
                className="form-input"
                placeholder="Ingresa la contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <div style={{ color: 'var(--danger-color)', fontSize: '0.8rem', marginTop: '0.25rem', fontWeight: 500 }}>
                {error}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn"
              disabled={loading}
              style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-danger"
              disabled={loading}
              style={{ backgroundColor: 'var(--danger-color)', color: 'white' }}
            >
              {loading ? 'Eliminando...' : 'Eliminar Atajo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
