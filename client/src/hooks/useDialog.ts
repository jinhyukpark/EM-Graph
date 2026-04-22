import { useState, useCallback } from 'react';

export interface UseDialogReturn<T = undefined> {
  isOpen: boolean;
  data: T | null;
  open: (data?: T) => void;
  close: () => void;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

/**
 * Hook for managing dialog/modal state
 * @param initialState - Initial open state (default: false)
 * @returns Dialog state and control functions
 */
export function useDialog<T = undefined>(initialState = false): UseDialogReturn<T> {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback((newData?: T) => {
    setData(newData ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const setOpen = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setData(null);
    }
  }, []);

  return { isOpen, data, open, close, toggle, setOpen };
}

export default useDialog;
