import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useContainer } from '@/app/context/ContainerContext';
import type { LecturaViewDTO } from '../../application/dto/FragmentoViewDTO';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { CommentModal } from '../components/CommentModal';

export function LecturaPage() {
  const { textoLecturaId } = useParams<{ textoLecturaId: string }>();
  const container = useContainer();
  const [view, setView] = useState<LecturaViewDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [showFullText, setShowFullText] = useState(false);
  const [fullText, setFullText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textoLecturaId) {
      loadView();
    }
  }, [textoLecturaId]);

  const loadView = async () => {
    if (!textoLecturaId) return;

    try {
      setLoading(true);
      const newView = await container.useCases.getFragmentoView.execute(
        textoLecturaId
      );
      setView(newView);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error cargando fragmento'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!textoLecturaId) return;
    const newView = await container.useCases.nextFragmento.execute(
      textoLecturaId
    );
    setView(newView);
    setIsEditing(false);
  };

  const handlePrev = async () => {
    if (!textoLecturaId) return;
    const newView = await container.useCases.prevFragmento.execute(
      textoLecturaId
    );
    setView(newView);
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (view?.current_fragmento) {
      setEditedText(view.current_fragmento.texto_actual);
      setIsEditing(true);
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  const handleSaveEdit = async () => {
    if (!view?.current_fragmento) return;

    await container.useCases.updateFragmento.execute({
      fragmentoId: view.current_fragmento.fragmento_id,
      nuevoTexto: editedText,
    });

    await loadView();
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText('');
  };

  const handleDelete = async () => {
    if (!view?.current_fragmento || !textoLecturaId) return;

    if (confirm('¿Eliminar este fragmento?')) {
      const newView = await container.useCases.deleteFragmento.execute({
        fragmentoId: view.current_fragmento.fragmento_id,
        textoLecturaId,
      });
      setView(newView);
      setIsEditing(false);
    }
  };

  const handleToggleFocus = async () => {
    if (!textoLecturaId || !view) return;

    const newView = await container.useCases.setFocusModeV2.execute({
      textoLecturaId,
      focusMode: !view.focus_mode,
    });
    setView(newView);
  };

  const handleAddComment = () => {
    setShowCommentModal(true);
  };

  const handleSaveComment = async (text: string) => {
    if (!view?.current_fragmento) return;

    await container.useCases.addComment.execute(
      view.current_fragmento.fragmento_id,
      text
    );

    setShowCommentModal(false);
    await loadView();
  };

  const handleEditTitle = () => {
    if (view) {
      setEditedTitle(view.nombre_lectura || '');
      setIsEditingTitle(true);
    }
  };

  const handleSaveTitle = async () => {
    if (!textoLecturaId) return;

    try {
      await container.useCases.updateTextoDeLectura.execute({
        textoLecturaId,
        nombre: editedTitle.trim() || undefined,
      });
      await loadView();
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Error actualizando título:', error);
    }
  };

  const handleExportText = async () => {
    if (!textoLecturaId) return;

    try {
      const markdown =
        await container.useCases.getTextoCompletoConComentarios.exportAsMarkdown(
          textoLecturaId
        );

      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${view?.nombre_lectura || 'texto'}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando texto:', error);
    }
  };

  const handleViewFullText = async () => {
    if (!textoLecturaId) return;

    try {
      const markdown =
        await container.useCases.getTextoCompletoConComentarios.exportAsMarkdown(
          textoLecturaId
        );
      setFullText(markdown);
      setShowFullText(true);
    } catch (error) {
      console.error('Error obteniendo texto completo:', error);
    }
  };

  const handleDownloadDB = async () => {
    try {
      const data = await container.dbAdapter.exportBytes();
      const blob = new Blob([data as BlobPart], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lectura-oracion-${Date.now()}.db`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando BD:', error);
      alert('Error al descargar la base de datos');
    }
  };

  const handleUploadDB = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.db';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        await container.dbAdapter.importBytes(uint8Array);
        alert('Base de datos cargada exitosamente. Recargando página...');
        window.location.reload();
      } catch (error) {
        console.error('Error cargando BD:', error);
        alert('Error al cargar la base de datos');
      }
    };
    input.click();
  };

  useKeyboardNavigation({
    onNext: view?.has_next ? handleNext : undefined,
    onPrev: view?.has_prev ? handlePrev : undefined,
    onEdit: !isEditing ? handleEdit : undefined,
    onDelete: !isEditing ? handleDelete : undefined,
    onComment: !isEditing ? handleAddComment : undefined,
    onToggleFocus: handleToggleFocus,
    onSave: isEditing ? handleSaveEdit : undefined,
    onCancel: isEditing ? handleCancelEdit : undefined,
  });

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!view || !view.current_fragmento) {
    return <div className="empty">No hay fragmentos para mostrar.</div>;
  }

  const { current_fragmento, focus_mode, has_next, has_prev } = view;

  return (
    <div className={`lectura-page ${focus_mode ? 'focus-mode' : ''}`}>
      {!focus_mode && (
        <>
          <header className="lectura-header">
            <div className="title-section">
              {isEditingTitle ? (
                <div className="edit-title-form">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') setIsEditingTitle(false);
                    }}
                    placeholder="Título del texto (opcional)"
                    autoFocus
                  />
                  <button onClick={handleSaveTitle}>Guardar</button>
                  <button onClick={() => setIsEditingTitle(false)}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <h2>
                  {view.nombre_lectura || view.nombre_cuaderno}
                  <button
                    className="btn-edit-inline"
                    onClick={handleEditTitle}
                    title="Editar título"
                  >
                    ✏️
                  </button>
                </h2>
              )}
            </div>
            <div className="metadata">
              <span>Modo: {view.modo_segmentacion}</span>
              <span>
                Fragmento {current_fragmento.position + 1} de{' '}
                {current_fragmento.total_fragmentos}
              </span>
            </div>
          </header>

          <div className="toolbar">
            <button onClick={handleViewFullText} title="Ver texto completo">
              📄 Ver Texto Completo
            </button>
            <button onClick={handleExportText} title="Exportar como Markdown">
              💾 Exportar Texto
            </button>
            <button onClick={handleDownloadDB} title="Descargar base de datos">
              ⬇️ Descargar BD
            </button>
            <button onClick={handleUploadDB} title="Cargar base de datos">
              ⬆️ Cargar BD
            </button>
          </div>
        </>
      )}

      <div className="fragmento-container">
        {isEditing ? (
          <div className="edit-mode">
            <textarea
              ref={textareaRef}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={5}
            />
            <div className="edit-actions">
              <button onClick={handleSaveEdit}>Guardar (Ctrl+S)</button>
              <button onClick={handleCancelEdit}>Cancelar (Esc)</button>
            </div>
          </div>
        ) : (
          <div className="fragmento-text">
            <p>{current_fragmento.texto_actual}</p>
          </div>
        )}

        {!focus_mode && current_fragmento.comments.length > 0 && (
          <div className="comments-section">
            <h3>Comentarios</h3>
            <ul>
              {current_fragmento.comments.map((comment) => (
                <li key={comment.comment_id}>{comment.text}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {!focus_mode && (
        <div className="controls">
          <button onClick={handlePrev} disabled={!has_prev}>
            ← Anterior (←)
          </button>
          <button onClick={handleEdit}>Editar (E)</button>
          <button onClick={handleDelete}>Eliminar (Del)</button>
          <button onClick={handleAddComment}>Comentar (C)</button>
          <button onClick={handleToggleFocus}>
            {focus_mode ? 'Salir Focus (F)' : 'Modo Focus (F)'}
          </button>
          <button onClick={handleNext} disabled={!has_next}>
            Siguiente (→)
          </button>
        </div>
      )}

      {showCommentModal && (
        <CommentModal
          onSave={handleSaveComment}
          onCancel={() => setShowCommentModal(false)}
        />
      )}

      {showFullText && (
        <div className="modal-overlay" onClick={() => setShowFullText(false)}>
          <div
            className="modal-content full-text-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Texto Completo</h3>
              <button onClick={() => setShowFullText(false)}>✕</button>
            </div>
            <div className="modal-body">
              <pre className="full-text-preview">{fullText}</pre>
            </div>
            <div className="modal-footer">
              <button onClick={handleExportText}>Exportar como .md</button>
              <button onClick={() => setShowFullText(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
