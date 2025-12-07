import { useEffect } from 'react';

export interface KeyboardHandlers {
  onNext?: () => void;
  onPrev?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onRead?: () => void;
  onEscape?: () => void;
}

export function useKeyboardNavigation(
  handlers: KeyboardHandlers,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        handlers.onNext?.();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handlers.onNext?.();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlers.onPrev?.();
      } else if (e.key === 'e' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        handlers.onEdit?.();
      } else if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        handlers.onDelete?.();
      } else if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        handlers.onSave?.();
      } else if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        handlers.onRead?.();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handlers.onEscape?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, enabled]);
}
