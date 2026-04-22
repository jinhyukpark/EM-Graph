import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TABLE_COLUMNS, DATABASE_TABLES } from '@/constants';
import { cn } from '@/lib/utils';

export interface ColumnSelectProps {
  table?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  showType?: boolean;
}

/**
 * Reusable column selection dropdown component
 * Dynamically shows columns based on selected table
 */
export function ColumnSelect({
  table,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select Column',
  size = 'md',
  className,
  triggerClassName,
  disabled = false,
  showType = true,
}: ColumnSelectProps) {
  const sizeClasses = {
    sm: 'h-7 text-[10px]',
    md: 'h-9 text-sm',
    lg: 'h-10 text-base',
  };

  // Get columns for selected table or combine all columns
  const columns = table && table in TABLE_COLUMNS
    ? TABLE_COLUMNS[table as keyof typeof TABLE_COLUMNS]
    : Object.values(TABLE_COLUMNS).flat();

  // Remove duplicates if combining all columns
  const uniqueColumns = table
    ? columns
    : Array.from(new Map(columns.map(c => [c.value, c])).values());

  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          sizeClasses[size],
          'bg-background',
          triggerClassName,
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {uniqueColumns.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {showType ? option.label : option.value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default ColumnSelect;
