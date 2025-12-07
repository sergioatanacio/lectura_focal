import { useEffect } from 'react';

export interface KeyboardHandlers {
  onNext?: () => void;
  onPrev?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onRead?: () => void;
  onEscape?: () => void;
  onCancel?: () => void;
  onComment?: () => void;
  onToggleFocus?: () => void;
}

export function useKeyboardNavigation(
  handlers: KeyboardHandlers,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el foco está en input, textarea o elemento editable
      const target = e.target as HTMLElement;
      const isEditable =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Ctrl+S y Ctrl+Enter funcionan siempre
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        handlers.onSave?.();
        return;
      }

      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        handlers.onRead?.();
        return;
      }

      // Escape funciona siempre
      if (e.key === 'Escape') {
        e.preventDefault();
        handlers.onEscape?.();
        handlers.onCancel?.();
        return;
      }

      // Las demás teclas solo funcionan fuera de inputs
      if (isEditable) return;

      // Tecla C para comentar
      if (e.key === 'c' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        if (handlers.onComment) {
          e.preventDefault();
          handlers.onComment();
        }
        return;
      }

      // Tecla F para toggle focus mode
      if (e.key === 'f' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        if (handlers.onToggleFocus) {
          e.preventDefault();
          handlers.onToggleFocus();
        }
        return;
      }

      if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        if (handlers.onNext) {
          e.preventDefault();
          handlers.onNext();
        }
      } else if (e.key === 'ArrowRight') {
        if (handlers.onNext) {
          e.preventDefault();
          handlers.onNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (handlers.onPrev) {
          e.preventDefault();
          handlers.onPrev();
        }
      } else if (e.key === 'e' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        if (handlers.onEdit) {
          e.preventDefault();
          handlers.onEdit();
        }
      } else if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        if (handlers.onDelete) {
          e.preventDefault();
          handlers.onDelete();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, enabled]);
}
