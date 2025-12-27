import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  options,
  onChange,
  className,
  placeholder = 'Select...',
}) => {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'inline-flex items-center justify-between gap-2 px-3 py-2 rounded-md',
            'bg-bg-elevated border border-border text-text-primary text-sm',
            'hover:bg-bg-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-purple',
            className
          )}
        >
          <span className="truncate">{selectedOption?.label || placeholder}</span>
          <ChevronDown className="w-4 h-4 text-text-muted flex-shrink-0" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[200px] bg-bg-elevated border border-border rounded-md shadow-lg p-1 z-50"
          sideOffset={5}
        >
          {options.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded text-sm cursor-pointer outline-none',
                'text-text-primary hover:bg-bg-tertiary transition-colors',
                value === option.value && 'bg-bg-secondary'
              )}
              onSelect={() => onChange(option.value)}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <Check className="w-4 h-4 text-accent-purple" />
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
