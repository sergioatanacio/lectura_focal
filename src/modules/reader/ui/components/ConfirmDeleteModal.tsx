import { useFocusTrap } from '../hooks/useFocusTrap';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  unitText: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  unitText,
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen);

  useKeyboardNavigation(
    {
      onEscape: onClose,
    },
    isOpen
  );

  if (!isOpen) return null;

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
          maxWidth: '500px',
          width: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" style={{ marginTop: 0 }}>
          Eliminar unidad
        </h2>

        <p style={{ marginBottom: '1rem' }}>
          ¿Seguro que desea eliminar esta unidad?
        </p>

        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            marginBottom: '1.5rem',
            fontStyle: 'italic',
          }}
        >
          "{unitText.substring(0, 100)}
          {unitText.length > 100 ? '...' : ''}"
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
            onClick={onConfirm}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#dc3545',
              color: 'white',
              cursor: 'pointer',
            }}
            autoFocus
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
