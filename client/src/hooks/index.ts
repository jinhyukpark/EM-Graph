// Barrel file for custom hooks
export { useDialog } from './useDialog';
export type { UseDialogReturn } from './useDialog';

export { useTabState } from './useTabState';
export type { Tab, UseTabStateReturn } from './useTabState';

export { useEditableCell } from './useEditableCell';
export type { EditingCell, UseEditableCellReturn } from './useEditableCell';

export { useExpandedState } from './useExpandedState';
export type { UseExpandedStateReturn } from './useExpandedState';

// Re-export existing hooks
export { useIsMobile } from './use-mobile';
export { useToast, toast } from './use-toast';
