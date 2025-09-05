import React, { forwardRef } from 'react';

const cn = (...cls) => cls.filter(Boolean).join(' ');

const Card = forwardRef(({ as: Comp = 'div', className = '', interactive = false, children, ...props }, ref) => {
  return (
    <Comp
      ref={ref}
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700',
        interactive && 'transition hover:shadow-md hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
});
Card.displayName = 'Card';

const CardHeader = forwardRef(({ as: Comp = 'div', className = '', children, ...props }, ref) => (
  <Comp ref={ref} className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)} {...props}>
    {children}
  </Comp>
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(({ as: Comp = 'h3', className = '', children, ...props }, ref) => (
  <Comp ref={ref} className={cn('text-base font-semibold leading-6 text-gray-900 dark:text-white', className)} {...props}>
    {children}
  </Comp>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef(({ as: Comp = 'p', className = '', children, ...props }, ref) => (
  <Comp ref={ref} className={cn('mt-1 text-sm text-gray-600 dark:text-gray-400', className)} {...props}>
    {children}
  </Comp>
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef(({ as: Comp = 'div', className = '', children, ...props }, ref) => (
  <Comp ref={ref} className={cn('px-6 py-4', className)} {...props}>
    {children}
  </Comp>
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ as: Comp = 'div', className = '', children, ...props }, ref) => (
  <Comp ref={ref} className={cn('px-6 py-4 border-t border-gray-200 dark:border-gray-700', className)} {...props}>
    {children}
  </Comp>
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };


