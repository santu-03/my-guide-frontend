import React, { forwardRef, createContext, useContext } from "react";

// Utility function for className merging
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Card context for sharing variant and other props
const CardContext = createContext({
  variant: "solid",
  padding: "default"
});

// Card variant configurations
const CARD_VARIANTS = {
  glass: {
    base: "bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20",
    header: "border-b border-white/20 dark:border-gray-700/20",
    footer: "border-t border-white/20 dark:border-gray-700/20",
    title: "text-white dark:text-white",
    description: "text-gray-200 dark:text-gray-300"
  },
  solid: {
    base: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    header: "border-b border-gray-200 dark:border-gray-700",
    footer: "border-t border-gray-200 dark:border-gray-700",
    title: "text-gray-900 dark:text-white",
    description: "text-gray-600 dark:text-gray-400"
  },
  outlined: {
    base: "bg-transparent border-2 border-gray-200 dark:border-gray-700",
    header: "border-b-2 border-gray-200 dark:border-gray-700",
    footer: "border-t-2 border-gray-200 dark:border-gray-700",
    title: "text-gray-900 dark:text-white",
    description: "text-gray-600 dark:text-gray-400"
  },
  elevated: {
    base: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg",
    header: "border-b border-gray-200 dark:border-gray-700",
    footer: "border-t border-gray-200 dark:border-gray-700",
    title: "text-gray-900 dark:text-white",
    description: "text-gray-600 dark:text-gray-400"
  }
};

const PADDING_VARIANTS = {
  none: "",
  sm: "p-4",
  default: "p-6",
  lg: "p-8"
};

/**
 * Flexible Card component system with consistent styling
 * 
 * @example
 * <Card variant="glass" interactive>
 *   <CardHeader>
 *     <CardTitle>My Card</CardTitle>
 *     <CardDescription>Card description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Card content goes here
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 */
const Card = forwardRef(
  (
    {
      as: Component = "div",
      className = "",
      interactive = false,
      variant = "solid",
      padding = "default",
      hover = false,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const variantConfig = CARD_VARIANTS[variant] || CARD_VARIANTS.solid;
    const isClickable = interactive || onClick;

    const cardClasses = cn(
      "rounded-xl shadow-sm transition-all duration-200",
      variantConfig.base,
      isClickable && [
        "cursor-pointer",
        "hover:shadow-lg hover:-translate-y-0.5",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        "dark:focus:ring-offset-gray-900"
      ],
      hover && !isClickable && "hover:shadow-md",
      className
    );

    const contextValue = {
      variant,
      padding
    };

    const handleClick = (e) => {
      if (onClick) {
        onClick(e);
      }
    };

    const handleKeyDown = (e) => {
      if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleClick(e);
      }
    };

    return (
      <CardContext.Provider value={contextValue}>
        <Component
          ref={ref}
          className={cardClasses}
          onClick={isClickable ? handleClick : undefined}
          onKeyDown={isClickable ? handleKeyDown : undefined}
          tabIndex={isClickable ? 0 : undefined}
          role={isClickable ? "button" : undefined}
          {...props}
        >
          {children}
        </Component>
      </CardContext.Provider>
    );
  }
);

Card.displayName = "Card";

/**
 * Card header component
 */
const CardHeader = forwardRef(
  (
    { 
      as: Component = "div", 
      className = "", 
      padding,
      children, 
      ...props 
    }, 
    ref
  ) => {
    const { variant, padding: defaultPadding } = useContext(CardContext);
    const variantConfig = CARD_VARIANTS[variant] || CARD_VARIANTS.solid;
    const paddingClass = PADDING_VARIANTS[padding || defaultPadding] || PADDING_VARIANTS.default;

    return (
      <Component
        ref={ref}
        className={cn(
          paddingClass,
          variantConfig.header,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardHeader.displayName = "CardHeader";

/**
 * Card title component
 */
const CardTitle = forwardRef(
  (
    { 
      as: Component = "h3", 
      className = "", 
      size = "default",
      children, 
      ...props 
    }, 
    ref
  ) => {
    const { variant } = useContext(CardContext);
    const variantConfig = CARD_VARIANTS[variant] || CARD_VARIANTS.solid;

    const sizeClasses = {
      sm: "text-sm font-medium",
      default: "text-base font-semibold",
      lg: "text-lg font-semibold",
      xl: "text-xl font-bold"
    };

    return (
      <Component
        ref={ref}
        className={cn(
          "leading-6",
          sizeClasses[size] || sizeClasses.default,
          variantConfig.title,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = "CardTitle";

/**
 * Card description component
 */
const CardDescription = forwardRef(
  (
    { 
      as: Component = "p", 
      className = "", 
      size = "default",
      children, 
      ...props 
    }, 
    ref
  ) => {
    const { variant } = useContext(CardContext);
    const variantConfig = CARD_VARIANTS[variant] || CARD_VARIANTS.solid;

    const sizeClasses = {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base"
    };

    return (
      <Component
        ref={ref}
        className={cn(
          "mt-1",
          sizeClasses[size] || sizeClasses.default,
          variantConfig.description,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardDescription.displayName = "CardDescription";

/**
 * Card content component
 */
const CardContent = forwardRef(
  (
    { 
      as: Component = "div", 
      className = "", 
      padding,
      children, 
      ...props 
    }, 
    ref
  ) => {
    const { padding: defaultPadding } = useContext(CardContext);
    const paddingClass = PADDING_VARIANTS[padding || defaultPadding] || PADDING_VARIANTS.default;

    return (
      <Component 
        ref={ref} 
        className={cn(paddingClass, className)} 
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardContent.displayName = "CardContent";

/**
 * Card footer component
 */
const CardFooter = forwardRef(
  (
    { 
      as: Component = "div", 
      className = "", 
      padding,
      justify = "end",
      children, 
      ...props 
    }, 
    ref
  ) => {
    const { variant, padding: defaultPadding } = useContext(CardContext);
    const variantConfig = CARD_VARIANTS[variant] || CARD_VARIANTS.solid;
    const paddingClass = PADDING_VARIANTS[padding || defaultPadding] || PADDING_VARIANTS.default;

    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around"
    };

    return (
      <Component
        ref={ref}
        className={cn(
          "flex items-center gap-2",
          paddingClass,
          variantConfig.footer,
          justifyClasses[justify],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardFooter.displayName = "CardFooter";

/**
 * Card image component for media cards
 */
const CardImage = forwardRef(
  (
    {
      src,
      alt,
      className = "",
      aspectRatio = "16/9",
      objectFit = "cover",
      loading = "lazy",
      ...props
    },
    ref
  ) => {
    return (
      <div 
        className={cn("relative overflow-hidden rounded-t-xl", className)}
        style={{ aspectRatio }}
      >
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading={loading}
          className={cn(
            "w-full h-full transition-transform duration-300 hover:scale-105",
            objectFit === "cover" && "object-cover",
            objectFit === "contain" && "object-contain",
            objectFit === "fill" && "object-fill"
          )}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling?.classList?.remove('hidden');
          }}
          {...props}
        />
        {/* Fallback for broken images */}
        <div className="hidden absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    );
  }
);

CardImage.displayName = "CardImage";

// Export all components and configurations
export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter, 
  CardImage,
  CARD_VARIANTS,
  PADDING_VARIANTS
};