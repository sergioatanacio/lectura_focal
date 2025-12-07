import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContainer } from '@/app/context/ContainerContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import type { SegmentationModeValue } from '../../domain/values/SegmentationMode';

export function DocumentPage() {
  const navigate = useNavigate();
  const container = useContainer();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [mode, setMode] = useState<SegmentationModeValue>('ORACION');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');
  const [documentId, setDocumentId] = useState<string | null>(null);

  const handleTextChange = (newText: string) => {
    setText(newText);
    setIsDirty(newText.length > 0);
    setIsSaved(false);
    setError('');
  };

  const handleSave = async () => {
    try {
      if (!text.trim()) {
        setError('Debe ingresar texto antes de guardar');
        return;
      }

      const id = await container.useCases.createDocumentFromText.execute({
        title: title || undefined,
        rawText: text,
        segmentationMode: mode,
      });

      setDocumentId(id);
      setIsDirty(false);
      setIsSaved(true);
      setError('');

      await container.dbAdapter.persist();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  const handleRead = async () => {
    try {
      if (!documentId && text.trim()) {
        await handleSave();
      }

      if (!documentId && !text.trim()) {
        setError('Debe ingresar texto antes de iniciar lectura');
        return;
      }

      if (documentId) {
        navigate(`/reading/${documentId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar lectura');
    }
  };

  useKeyboardNavigation({
    onSave: handleSave,
    onRead: handleRead,
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ margin: 0 }}>Documento</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: isDirty ? '#ffc107' : '#28a745' }}>
            {isDirty ? 'Estado: *' : isSaved ? 'Estado: OK' : ''}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="title-input"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
        >
          Título (opcional):
        </label>
        <input
          id="title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título del documento"
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="text-area"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
        >
          Pegue aquí el texto completo:
        </label>
        <textarea
          id="text-area"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Texto..."
          style={{
            width: '100%',
            minHeight: '300px',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Segmentación:
        </label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="radio"
              name="mode"
              value="ORACION"
              checked={mode === 'ORACION'}
              onChange={(e) =>
                setMode(e.target.value as SegmentationModeValue)
              }
            />
            Oración
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="radio"
              name="mode"
              value="PARRAFO"
              checked={mode === 'PARRAFO'}
              onChange={(e) =>
                setMode(e.target.value as SegmentationModeValue)
              }
            />
            Párrafo
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#28a745',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Guardar
        </button>
        <button
          onClick={handleRead}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Leer
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}
        >
          ERROR: {error}
        </div>
      )}

      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '0.9rem',
        }}
      >
        <strong>Atajos:</strong> Ctrl+Enter = Leer | Ctrl+S = Guardar
      </div>

      {isDirty && (
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          * Cambios sin guardar
        </div>
      )}

      {isSaved && (
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#28a745' }}>
          Último guardado: {new Date().toLocaleString()}
        </div>
      )}
    </div>
  );
}
