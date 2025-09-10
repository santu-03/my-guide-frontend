// import React, { forwardRef } from "react";
// import { Link } from "react-router-dom";
// import { Loader2 } from "lucide-react";

// /**
//  * Usage:
//  * <Button>Save</Button>
//  * <Button as={Link} to="/dashboard">Go</Button>
//  * <Button variant="outline" size="lg" fullWidth loading>Saving…</Button>
//  * <Button variant="link" href="https://example.com">Docs</Button>
//  */
// const Button = forwardRef(
//   (
//     {
//       className = "",
//       variant = "primary",
//       size = "md",
//       loading = false,
//       disabled = false,
//       as: Comp, // undefined | 'button' | 'a' | Link | custom
//       to,
//       href,
//       type,
//       fullWidth = false,
//       children,
//       ...props
//     },
//     ref
//   ) => {
//     const base =
//       "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
//     const variants = {
//       primary:
//         "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
//       secondary:
//         "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white",
//       outline:
//         "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:hover:bg-primary-900/20",
//       ghost:
//         "text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800",
//       danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
//       transparent:
//         "bg-glass dark:bg-darkGlass backdrop-blur-md border border-white/20 text-white hover:bg-white/10",
//       link: "text-primary-600 hover:underline focus:ring-primary-500",
//     };
//     const sizes = {
//       sm: "px-3 py-1.5 text-sm",
//       md: "px-4 py-2 text-sm",
//       lg: "px-6 py-3 text-base",
//       xl: "px-8 py-4 text-lg",
//     };

//     const classes = [
//       base,
//       variants[variant] || variants.primary,
//       sizes[size] || sizes.md,
//       fullWidth ? "w-full" : "",
//       (disabled || loading) ? "pointer-events-none" : "",
//       className,
//     ]
//       .filter(Boolean)
//       .join(" ");

//     // Decide element if not provided
//     const isLink = !!to || !!href || Comp === Link || Comp === "a";
//     const Element =
//       Comp || (isLink ? (to ? Link : "a") : "button");

//     // Common props
//     const common = {
//       ref,
//       className: classes,
//       "aria-disabled": disabled || loading || undefined,
//       "aria-busy": loading || undefined,
//       ...props,
//     };

//     if (Element === Link) {
//       return (
//         <Link to={to ?? href ?? "#"} {...common}>
//           {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//           {children}
//         </Link>
//       );
//     }

//     if (Element === "a") {
//       return (
//         <a
//           href={href ?? to ?? "#"}
//           tabIndex={disabled || loading ? -1 : undefined}
//           {...common}
//         >
//           {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//           {children}
//         </a>
//       );
//     }

//     return (
//       <Element
//         type={type || "button"}
//         disabled={disabled || loading}
//         {...common}
//       >
//         {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//         {children}
//       </Element>
//     );
//   }
// );

// Button.displayName = "Button";
// export default Button;
import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Utility function for className merging
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Button variant configurations
const BUTTON_VARIANTS = {
  primary: {
    base: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
    disabled: "bg-primary-300 dark:bg-primary-800"
  },
  secondary: {
    base: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
    disabled: "bg-gray-50 text-gray-400 dark:bg-gray-900 dark:text-gray-600"
  },
  outline: {
    base: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:hover:bg-primary-900/20 dark:border-primary-400 dark:text-primary-400",
    disabled: "border-gray-300 text-gray-400 dark:border-gray-700 dark:text-gray-600"
  },
  ghost: {
    base: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800",
    disabled: "text-gray-400 dark:text-gray-600"
  },
  danger: {
    base: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    disabled: "bg-red-300 dark:bg-red-800"
  },
  success: {
    base: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    disabled: "bg-emerald-300 dark:bg-emerald-800"
  },
  warning: {
    base: "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500",
    disabled: "bg-amber-300 dark:bg-amber-800"
  },
  transparent: {
    base: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
    disabled: "bg-white/5 text-white/50 border-white/10"
  },
  link: {
    base: "text-primary-600 hover:text-primary-700 hover:underline focus:ring-primary-500 dark:text-primary-400 dark:hover:text-primary-300",
    disabled: "text-gray-400 dark:text-gray-600 no-underline"
  }
};

const BUTTON_SIZES = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg"
};

/**
 * Flexible Button component that can render as different elements
 * 
 * @example
 * // Basic button
 * <Button>Save</Button>
 * 
 * // As Link component
 * <Button as={Link} to="/dashboard">Go to Dashboard</Button>
 * 
 * // With loading state
 * <Button variant="primary" loading>Saving...</Button>
 * 
 * // External link
 * <Button as="a" href="https://example.com" target="_blank">Documentation</Button>
 */
const Button = forwardRef(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      as: Component,
      to,
      href,
      type,
      fullWidth = false,
      children,
      onClick,
      startIcon,
      endIcon,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    // Determine the component to render
    const getComponent = () => {
      if (Component) return Component;
      if (to && !href) return Link;
      if (href || to) return "a";
      return "button";
    };

    const ElementComponent = getComponent();
    const isDisabled = disabled || loading;
    const variantConfig = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;

    // Base classes
    const baseClasses = [
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900",
      "disabled:cursor-not-allowed",
      !loading && !disabled ? variantConfig.base : variantConfig.disabled,
      BUTTON_SIZES[size] || BUTTON_SIZES.md,
      fullWidth && "w-full",
      loading && "relative",
      className
    ];

    const classes = cn(...baseClasses);

    // Common props for all element types
    const commonProps = {
      ref,
      className: classes,
      "aria-disabled": isDisabled || undefined,
      "aria-busy": loading || undefined,
      "aria-label": ariaLabel || (loading ? `Loading ${children}` : undefined),
      ...props
    };

    // Handle click events
    const handleClick = (e) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    // Render loading spinner
    const LoadingSpinner = () => loading && (
      <Loader2 
        className={cn(
          "animate-spin",
          size === "xs" ? "h-3 w-3" : size === "sm" ? "h-4 w-4" : "h-4 w-4",
          children ? "mr-2" : ""
        )} 
        aria-hidden="true"
      />
    );

    // Render start icon
    const StartIcon = () => startIcon && !loading && (
      <span className={cn("flex-shrink-0", children ? "mr-2" : "")}>
        {startIcon}
      </span>
    );

    // Render end icon
    const EndIcon = () => endIcon && !loading && (
      <span className={cn("flex-shrink-0", children ? "ml-2" : "")}>
        {endIcon}
      </span>
    );

    // Button content
    const buttonContent = (
      <>
        <LoadingSpinner />
        <StartIcon />
        {children}
        <EndIcon />
      </>
    );

    // Render based on component type
    if (ElementComponent === Link) {
      return (
        <Link
          to={to || href || "#"}
          onClick={handleClick}
          {...commonProps}
        >
          {buttonContent}
        </Link>
      );
    }

    if (ElementComponent === "a") {
      return (
        <a
          href={href || to || "#"}
          onClick={handleClick}
          tabIndex={isDisabled ? -1 : undefined}
          {...(href?.startsWith('http') ? { 
            target: "_blank", 
            rel: "noopener noreferrer" 
          } : {})}
          {...commonProps}
        >
          {buttonContent}
        </a>
      );
    }

    // Default to button element
    return (
      <ElementComponent
        type={type || "button"}
        disabled={isDisabled}
        onClick={handleClick}
        {...commonProps}
      >
        {buttonContent}
      </ElementComponent>
    );
  }
);

Button.displayName = "Button";

// Export variant and size constants for external use
export { BUTTON_VARIANTS, BUTTON_SIZES };
export default Button;