
import React from 'react';
import { cn } from '@/lib/utils';

export const StarBorder = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn('star-border group', className)}>
      <div className="star-border-content">
        {children}
      </div>
    </div>
  );
};
