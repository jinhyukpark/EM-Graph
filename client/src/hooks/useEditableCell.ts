import { useState, useCallback } from 'react';

export interface EditingCell {
  rowIdx: number;
  field: string;
  value: string;
}

export interface UseEditableCellReturn {
  editingCell: EditingCell | null;
  startEditing: (rowIdx: number, field: string, value: string) => void;
  cancelEditing: () => void;
  updateEditValue: (value: string) => void;
  commitEdit: <T extends Record<string, unknown>>(
    data: T[],
    setData: (data: T[]) => void,
    idField?: string
  ) => void;
  isEditing: (rowIdx: number, field: string) => boolean;
  handleKeyDown: <T extends Record<string, unknown>>(
    e: React.KeyboardEvent,
    data: T[],
    setData: (data: T[]) => void,
    idField?: string
  ) => void;
}

/**
 * Hook for managing editable table cell state
 * @returns Cell editing state and control functions
 */
export function useEditableCell(): UseEditableCellReturn {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  const startEditing = useCallback((rowIdx: number, field: string, value: string) => {
    setEditingCell({ rowIdx, field, value: String(value) });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingCell(null);
  }, []);

  const updateEditValue = useCallback((value: string) => {
    setEditingCell(prev => prev ? { ...prev, value } : null);
  }, []);

  const commitEdit = useCallback(<T extends Record<string, unknown>>(
    data: T[],
    setData: (data: T[]) => void,
    _idField = 'idx'
  ) => {
    if (!editingCell) return;

    const { rowIdx, field, value } = editingCell;
    const newData = data.map((row, idx) =>
      idx === rowIdx ? { ...row, [field]: value } : row
    );
    setData(newData);
    setEditingCell(null);
  }, [editingCell]);

  const isEditing = useCallback((rowIdx: number, field: string) => {
    return editingCell?.rowIdx === rowIdx && editingCell?.field === field;
  }, [editingCell]);

  const handleKeyDown = useCallback(<T extends Record<string, unknown>>(
    e: React.KeyboardEvent,
    data: T[],
    setData: (data: T[]) => void,
    idField = 'idx'
  ) => {
    if (e.key === 'Enter') {
      commitEdit(data, setData, idField);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  }, [commitEdit, cancelEditing]);

  return {
    editingCell,
    startEditing,
    cancelEditing,
    updateEditValue,
    commitEdit,
    isEditing,
    handleKeyDown,
  };
}

export default useEditableCell;
