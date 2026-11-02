import React, { useState, useEffect } from 'react';
import { BlenderHelp, CreateBlenderHelpInput } from '../../domain/blender-help.model';
import { KeywordInput } from './KeywordInput';
import { Save, X } from 'lucide-react';

interface BlenderHelpFormProps {
  onSubmit: (input: CreateBlenderHelpInput) => Promise<any>;
  onUpdate: (id: string, input: CreateBlenderHelpInput) => Promise<any>;
  editingItem: BlenderHelp | null;
  onCancelEdit: () => void;
}

export const BlenderHelpForm: React.FC<BlenderHelpFormProps> = ({
  onSubmit,
  onUpdate,
  editingItem,
  onCancelEdit,
}) => {
  const [question, setQuestion] = useState('');
  const [explanation, setExplanation] = useState('');
  const [version, setVersion] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with editing item
  useEffect(() => {
    if (editingItem) {
      setQuestion(editingItem.question);
      setExplanation(editingItem.explanation);
      setVersion(editingItem.version);
      setKeywords(editingItem.keywords);
      setKeywordInput('');
    } else {
      setQuestion('');
      setExplanation('');
      setVersion('');
      setKeywords([]);
      setKeywordInput('');
    }
  }, [editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !explanation.trim() || !version.trim()) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Auto-commit any remaining text in the keyword input box
      let finalKeywords = [...keywords];
      if (keywordInput.trim()) {
        const pendingKeys = keywordInput
          .split(',')
          .map((k) => k.trim().toLowerCase())
          .filter((k) => k && !finalKeywords.includes(k));
        finalKeywords = [...finalKeywords, ...pendingKeys];
      }
      
      const payload: CreateBlenderHelpInput = {
        question: question.trim(),
        explanation: explanation.trim(),
        version: version.trim(),
        keywords: finalKeywords,
      };

      if (editingItem) {
        await onUpdate(editingItem.id, payload);
      } else {
        await onSubmit(payload);
      }

      // Reset form states completely
      setQuestion('');
      setExplanation('');
      setVersion('');
      setKeywords([]);
      setKeywordInput('');
    } catch (err: any) {
      setError(err.message || 'Error al guardar el atajo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="panel create-panel" onSubmit={handleSubmit}>
      <h2 className="panel-title">
        <Save size={18} style={{ color: 'var(--accent-orange)' }} />
        {editingItem ? 'Editar Atajo' : 'Agregar Nuevo Atajo'}
      </h2>

      {error && (
        <div style={{ color: 'var(--danger-color)', fontSize: '0.9rem', backgroundColor: 'rgba(217, 83, 79, 0.1)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(217, 83, 79, 0.2)' }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="question">Pregunta / Tarea</label>
        <input
          id="question"
          name="question"
          type="text"
          className="form-input"
          placeholder="Ej: ¿Cómo ocultar objetos?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="explanation">Instrucciones / Explicación</label>
        <textarea
          id="explanation"
          name="explanation"
          className="form-textarea"
          placeholder="Ej: Selecciona los objetos y presiona la tecla 'H'..."
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="version">Versión de Blender</label>
        <input
          id="version"
          name="version"
          type="text"
          className="form-input"
          placeholder="Ej: 4.2 o 5.0"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          required
        />
      </div>

      <KeywordInput 
        keywords={keywords} 
        onChange={setKeywords} 
        inputValue={keywordInput}
        onInputChange={setKeywordInput}
      />

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ flex: 1 }} 
          disabled={submitting}
        >
          {submitting ? 'Guardando...' : editingItem ? 'Actualizar Atajo' : 'Guardar en Blender Help'}
        </button>
        {editingItem && (
          <button 
            type="button" 
            className="btn btn-danger" 
            style={{ width: '44px', padding: 0 }} 
            onClick={onCancelEdit}
            title="Cancelar edición"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </form>
  );
};
