import { useState } from 'react';

interface CommentModalProps {
  onSave: (text: string) => void;
  onCancel: () => void;
}

export function CommentModal({ onSave, onCancel }: CommentModalProps) {
  const [text, setText] = useState('');

  const handleSave = () => {
    if (text.trim()) {
      onSave(text.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Añadir Comentario</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu comentario..."
          rows={4}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onCancel();
            }
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSave();
            }
          }}
        />
        <div className="modal-actions">
          <button onClick={handleSave}>Guardar (Ctrl+Enter)</button>
          <button onClick={onCancel}>Cancelar (Esc)</button>
        </div>
      </div>
    </div>
  );
}
