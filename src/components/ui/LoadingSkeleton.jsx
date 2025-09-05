import React, { forwardRef, useEffect } from 'react';

const cn = (...cls) => cls.filter(Boolean).join(' ');

let __kf = false;
const ensureKF = () => {
  if (typeof document === 'undefined' || __kf) return;
  const style = document.createElement('style');
  style.textContent = '@keyframes __skeleton-shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}';
  document.head.appendChild(style);
  __kf = true;
};

export const LoadingSkeleton = forwardRef(({ as: Comp = 'div', className = '', variant = 'pulse', rounded = 'rounded', announce = false, ...props }, ref) => {
  useEffect(() => { if (variant === 'shimmer') ensureKF(); }, [variant]);
  return (
    <Comp
      ref={ref}
      className={cn('relative overflow-hidden bg-gray-200 dark:bg-gray-700', rounded, variant === 'pulse' && 'animate-pulse', className)}
      aria-hidden={announce ? undefined : true}
      role={announce ? 'status' : undefined}
      {...props}
    >
      {variant === 'shimmer' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{ transform: 'translateX(-100%)', animation: '__skeleton-shimmer 1.25s linear infinite' }}
        />
      )}
    </Comp>
  );
});
LoadingSkeleton.displayName = 'LoadingSkeleton';

export const SkeletonCard = ({ className = '', variant = 'pulse', imageHeight = 'h-48' }) => (
  <div className={cn('bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700', className)}>
    <LoadingSkeleton className={cn(imageHeight, 'rounded-t-xl')} variant={variant} />
    <div className="p-4 space-y-3">
      <LoadingSkeleton className="h-4 w-3/4 rounded-md" variant={variant} />
      <LoadingSkeleton className="h-3 w-1/2 rounded-md" variant={variant} />
      <div className="flex justify-between items-center">
        <LoadingSkeleton className="h-4 w-1/4 rounded-md" variant={variant} />
        <LoadingSkeleton className="h-8 w-20 rounded-xl" variant={variant} />
      </div>
    </div>
  </div>
);

export const SkeletonList = ({ count = 3, className = '', variant = 'pulse', avatar = true }) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {avatar && <LoadingSkeleton className="h-12 w-12 rounded-full" variant={variant} />}
          <div className="space-y-2 flex-1">
            <LoadingSkeleton className="h-4 w-3/4 rounded-md" variant={variant} />
            <LoadingSkeleton className="h-3 w-1/2 rounded-md" variant={variant} />
          </div>
          <LoadingSkeleton className="h-8 w-20 rounded-xl" variant={variant} />
        </div>
      </div>
    ))}
  </div>
);
