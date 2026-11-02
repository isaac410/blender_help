import React, { KeyboardEvent } from 'react';
import { Plus, X } from 'lucide-react';

interface KeywordInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
}

export const KeywordInput: React.FC<KeywordInputProps> = ({
  keywords,
  onChange,
  inputValue,
  onInputChange,
}) => {

  const addKeyword = () => {
    if (!inputValue.trim()) return;
    
    // Split by comma to support multiple keywords added at once
    const newKeys = inputValue
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k && !keywords.includes(k));
      
    if (newKeys.length > 0) {
      onChange([...keywords, ...newKeys]);
    }
    onInputChange(''); // Clear input
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const removeKeyword = (indexToRemove: number) => {
    const updated = keywords.filter((_, index) => index !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="form-group">
      <label className="form-label" htmlFor="keyword-input">Palabras Clave (Keywords)</label>
      <div className="keyword-input-wrapper">
        <input
          id="keyword-input"
          name="keyword-input"
          type="text"
          className="form-input"
          style={{ flex: 1 }}
          placeholder="Ej: viewport, ocultar, mesh (Presiona Enter)"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: '0.75rem' }}
          onClick={addKeyword}
          title="Agregar palabra(s) clave"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="keywords-container">
        {keywords.map((word, index) => (
          <span key={index} className="chip">
            {word}
            <span
              className="chip-remove"
              onClick={() => removeKeyword(index)}
              title="Quitar"
            >
              <X size={10} />
            </span>
          </span>
        ))}
        {keywords.length === 0 && (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            No se han añadido palabras clave
          </span>
        )}
      </div>
    </div>
  );
};
