import React from 'react';
import { cn } from '@/lib/utils';

interface WordCounterProps {
  current: number;
  max?: number;
  className?: string;
}

export const WordCounter: React.FC<WordCounterProps> = ({
  current,
  max,
  className,
}) => {
  const percentage = max ? (current / max) * 100 : 0;
  const isOverLimit = max ? current > max : false;
  const isNearLimit = max ? percentage >= 90 && !isOverLimit : false;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'text-xs font-medium tabular-nums',
          isOverLimit && 'text-accent-red',
          isNearLimit && 'text-accent-amber',
          !isOverLimit && !isNearLimit && 'text-text-muted'
        )}
      >
        {current} {max && `/ ${max}`} words
      </span>
      {max && (
        <div className="w-20 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-300',
              isOverLimit && 'bg-accent-red',
              isNearLimit && 'bg-accent-amber',
              !isOverLimit && !isNearLimit && 'bg-accent-purple'
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};
