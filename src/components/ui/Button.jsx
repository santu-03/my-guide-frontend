

import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  as: Comp = 'button',   // 'button' | 'a' | Link | any component
  to,
  href,
  type,
  children,
  ...props
}, ref) => {
  const base =
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:hover:bg-primary-900/20',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  const classes = [
    base,
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    (disabled || loading) ? 'pointer-events-none' : '',
    className
  ].filter(Boolean).join(' ');

  if (Comp === Link) {
    return (
      <Link
        ref={ref}
        to={to ?? href ?? '#'}
        aria-disabled={disabled || loading || undefined}
        className={classes}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Link>
    );
  }
  if (Comp === 'a' || href) {
    return (
      <a
        ref={ref}
        href={href ?? to ?? '#'}
        aria-disabled={disabled || loading || undefined}
        className={classes}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </a>
    );
  }
  return (
    <Comp
      ref={ref}
      type={type || 'button'}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Comp>
  );
});

Button.displayName = 'Button';
export default Button;





