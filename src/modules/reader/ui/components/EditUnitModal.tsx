import { useState, useEffect } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

interface EditUnitModalProps {
  isOpen: boolean;
  originalText: string;
  currentText: string;
  onSave: (newText: string) => void;
  onClose: () => void;
}

export function EditUnitModal({
  isOpen,
  originalText,
  currentText,
  onSave,
  onClose,
}: EditUnitModalProps) {
  const [editedText, setEditedText] = useState(currentText);
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen);

  useEffect(() => {
    setEditedText(currentText);
  }, [currentText, isOpen]);

  useKeyboardNavigation(
    {
      onEscape: onClose,
    },
    isOpen
  );

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(editedText);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" style={{ marginTop: 0 }}>
          Editar unidad
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
            }}
          >
            Original (solo referencia):
          </label>
          <div
            style={{
              padding: '0.5rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              fontSize: '0.9rem',
              color: '#666',
            }}
          >
            {originalText}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="edit-textarea"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
            }}
          >
            Editado:
          </label>
          <textarea
            id="edit-textarea"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontFamily: 'inherit',
            }}
            autoFocus
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
