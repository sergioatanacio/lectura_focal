import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContainer } from '@/app/context/ContainerContext';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { EditUnitModal } from '../components/EditUnitModal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import type { ReadingViewDTO } from '../../application/dto/ReaderViewDTO';

export function ReadingPage() {
  const navigate = useNavigate();
  const { documentId } = useParams<{ documentId: string }>();
  const container = useContainer();

  const [readingView, setReadingView] = useState<ReadingViewDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  const loadCurrentUnit = async () => {
    if (!documentId) return;

    try {
      const view = await container.useCases.getCurrentUnit.execute(documentId);
      setReadingView(view);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      container.useCases.startReading
        .execute({ documentId, mode: 'ORACION' })
        .then((view) => {
          setReadingView(view);
          setLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Error al cargar');
          setLoading(false);
        });
    }
  }, [documentId]);

  const handleNext = async () => {
    if (!documentId || !readingView?.has_next) return;

    try {
      const view = await container.useCases.nextUnit.execute(documentId);
      setReadingView(view);
      await container.dbAdapter.persist();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  const handlePrev = async () => {
    if (!documentId || !readingView?.has_prev) return;

    try {
      const view = await container.useCases.prevUnit.execute(documentId);
      setReadingView(view);
      await container.dbAdapter.persist();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  const handleEdit = () => {
    if (readingView?.current_unit) {
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (readingView?.current_unit) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleSaveEdit = async (newText: string) => {
    if (!readingView?.current_unit) return;

    try {
      await container.useCases.updateUnitText.execute(
        readingView.current_unit.unit_id,
        newText
      );
      await container.dbAdapter.persist();
      setIsEditModalOpen(false);
      await loadCurrentUnit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  const handleConfirmDelete = async () => {
    if (!readingView?.current_unit) return;

    try {
      await container.useCases.deleteUnit.execute(
        readingView.current_unit.unit_id
      );
      await container.dbAdapter.persist();
      setIsDeleteModalOpen(false);
      await loadCurrentUnit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const handleAddComment = async () => {
    if (!readingView?.current_unit) return;

    if (!commentText.trim()) {
      setCommentError('El comentario no puede estar vacío');
      return;
    }

    try {
      await container.useCases.addComment.execute(
        readingView.current_unit.unit_id,
        commentText.trim()
      );
      await container.dbAdapter.persist();
      setCommentText('');
      setCommentError('');
      await loadCurrentUnit();
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : 'Error al añadir');
    }
  };

  const handleToggleFocus = async () => {
    if (!documentId || !readingView) return;

    try {
      await container.useCases.setFocusMode.execute(
        documentId,
        !readingView.focus_mode
      );
      await container.dbAdapter.persist();
      await loadCurrentUnit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  };

  useKeyboardNavigation(
    {
      onNext: handleNext,
      onPrev: handlePrev,
      onEdit: handleEdit,
      onDelete: handleDelete,
    },
    !isEditModalOpen && !isDeleteModalOpen
  );

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Cargando lectura...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
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
        <button onClick={() => navigate('/')}>Volver</button>
      </div>
    );
  }

  if (!readingView?.current_unit) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>No hay unidades para mostrar</h2>
        <button onClick={() => navigate('/')}>Volver</button>
      </div>
    );
  }

  const focusMode = readingView.focus_mode;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
            Lectura: {readingView.document_title || 'Sin título'}
          </h1>
          <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            {readingView.current_unit.position + 1} /{' '}
            {readingView.current_unit.total_units}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem' }}>
            Modo: {readingView.mode}
          </span>
          {focusMode && (
            <span
              style={{
                fontSize: '0.9rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '4px',
              }}
            >
              Enfoque: ON
            </span>
          )}
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            Salir
          </button>
        </div>
      </div>

      <div
        style={{
          padding: focusMode ? '4rem 2rem' : '2rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '2rem',
          minHeight: focusMode ? '300px' : '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: focusMode ? '1.5rem' : '1.2rem',
          textAlign: 'center',
        }}
      >
        "{readingView.current_unit.current_text}"
      </div>

      {!focusMode && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '2rem',
            }}
          >
            <button
              onClick={handlePrev}
              disabled={!readingView.has_prev}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: readingView.has_prev ? '#007bff' : '#ccc',
                color: 'white',
                cursor: readingView.has_prev ? 'pointer' : 'not-allowed',
              }}
            >
              &lt;&lt; Anterior
            </button>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleEdit}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                }}
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                }}
              >
                Eliminar
              </button>
              <button
                onClick={handleToggleFocus}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: focusMode ? '#007bff' : 'white',
                  color: focusMode ? 'white' : 'black',
                  cursor: 'pointer',
                }}
              >
                {focusMode ? 'Salir Enfoque' : 'Modo Enfoque'}
              </button>
            </div>

            <button
              onClick={handleNext}
              disabled={!readingView.has_next}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: readingView.has_next ? '#007bff' : '#ccc',
                color: 'white',
                cursor: readingView.has_next ? 'pointer' : 'not-allowed',
              }}
            >
              Siguiente &gt;&gt;
            </button>
          </div>

          <div
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              Comentarios ({readingView.current_unit.comments.length})
            </h3>

            {readingView.current_unit.comments.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {readingView.current_unit.comments.map((comment) => (
                  <li
                    key={comment.comment_id}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      marginBottom: '0.5rem',
                    }}
                  >
                    - "{comment.text}"
                  </li>
                ))}
              </ul>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <input
                type="text"
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  setCommentError('');
                }}
                placeholder="Añadir comentario..."
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <button
                onClick={handleAddComment}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '1rem',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: '#28a745',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Añadir
              </button>
            </div>

            {commentError && (
              <div
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#dc3545',
                }}
              >
                ERROR: {commentError}
              </div>
            )}
          </div>
        </>
      )}

      {focusMode && (
        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
          (Enter / →) Siguiente &nbsp;&nbsp;&nbsp; (←) Anterior
        </div>
      )}

      {!focusMode && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            fontSize: '0.9rem',
          }}
        >
          <strong>Atajos:</strong> Enter=Siguiente | ←/→ | E=Editar |
          Del=Eliminar
        </div>
      )}

      <EditUnitModal
        isOpen={isEditModalOpen}
        originalText={readingView.current_unit.original_text}
        currentText={readingView.current_unit.current_text}
        onSave={handleSaveEdit}
        onClose={() => setIsEditModalOpen(false)}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        unitText={readingView.current_unit.current_text}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
