'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/cn';
import { useChartDimensions } from '@/components/charts/hooks/useChartDimensions';

interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
  height?: number;
}

export function ChartContainer({ children, className = '', height }: ChartContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useChartDimensions(containerRef);

  return (
    <div
      ref={containerRef}
      className={cn('w-full relative', className)}
      style={{ height: height || '100%', minHeight: 200 }}
    >
      <div className="absolute inset-0">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              width: dimensions.width || 400,
              height: dimensions.height || 300,
            });
          }
          return child;
        })}
      </div>
    </div>
  );
}