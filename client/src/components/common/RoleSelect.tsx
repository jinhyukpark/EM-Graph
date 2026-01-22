import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROLE_OPTIONS } from '@/constants';
import { cn } from '@/lib/utils';

export interface RoleSelectProps {
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
 * Reusable role selection dropdown component
 */
export function RoleSelect({
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select Role',
  size = 'md',
  className,
  triggerClassName,
  disabled = false,
}: RoleSelectProps) {
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
          triggerClassName,
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {ROLE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default RoleSelect;
