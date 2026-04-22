import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TABLE_OPTIONS } from '@/constants';
import { cn } from '@/lib/utils';

export interface TableSelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
}

/**
 * Reusable table selection dropdown component
 */
export function TableSelect({
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select Table',
  size = 'md',
  className,
  triggerClassName,
  disabled = false,
}: TableSelectProps) {
  const sizeClasses = {
    sm: 'h-7 text-[10px]',
    md: 'h-9 text-sm',
    lg: 'h-10 text-base',
  };

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
        {TABLE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default TableSelect;
