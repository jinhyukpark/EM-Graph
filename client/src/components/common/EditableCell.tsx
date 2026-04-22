import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface EditableCellProps {
  value: string | number;
  isEditing: boolean;
  editValue?: string;
  onDoubleClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number';
  className?: string;
  cellClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
}

/**
 * Reusable editable table cell component
 * Double-click to edit, Enter to save, Escape to cancel
 */
export function EditableCell({
  value,
  isEditing,
  editValue,
  onDoubleClick,
  onChange,
  onBlur,
  onKeyDown,
  type = 'text',
  className,
  cellClassName,
  inputClassName,
  disabled = false,
}: EditableCellProps) {
  return (
    <TableCell
      onDoubleClick={disabled ? undefined : onDoubleClick}
      className={cn(
        'cursor-pointer hover:bg-secondary/50 transition-colors',
        disabled && 'cursor-default hover:bg-transparent',
        cellClassName,
        className
      )}
    >
      {isEditing ? (
        <Input
          autoFocus
          type={type}
          value={editValue}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className={cn(
            'h-8 px-2 py-1 text-sm',
            inputClassName
          )}
        />
      ) : (
        <div className="px-4 py-2 min-h-[32px] flex items-center">
          {value}
        </div>
      )}
    </TableCell>
  );
}

export default EditableCell;
