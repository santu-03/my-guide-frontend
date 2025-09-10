// import React, { forwardRef, useEffect } from "react";

// const cn = (...cls) => cls.filter(Boolean).join(" ");

// let __kf = false;
// const ensureKF = () => {
//   if (typeof document === "undefined" || __kf) return;
//   const style = document.createElement("style");
//   style.textContent =
//     "@keyframes __skeleton-shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}";
//   document.head.appendChild(style);
//   __kf = true;
// };

// /**
//  * <LoadingSkeleton variant="pulse|shimmer" announce />
//  */
// export const LoadingSkeleton = forwardRef(
//   (
//     {
//       as: Comp = "div",
//       className = "",
//       variant = "pulse",
//       rounded = "rounded",
//       announce = false,
//       ...props
//     },
//     ref
//   ) => {
//     useEffect(() => {
//       if (variant === "shimmer") ensureKF();
//     }, [variant]);

//     return (
//       <Comp
//         ref={ref}
//         className={cn(
//           "relative overflow-hidden bg-gray-200 dark:bg-gray-700",
//           rounded,
//           variant === "pulse" && "animate-pulse",
//           className
//         )}
//         aria-hidden={announce ? undefined : true}
//         role={announce ? "status" : undefined}
//         aria-live={announce ? "polite" : undefined}
//         {...props}
//       >
//         {variant === "shimmer" && (
//           <span
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
//             style={{
//               transform: "translateX(-100%)",
//               animation: "__skeleton-shimmer 1.25s linear infinite",
//             }}
//           />
//         )}
//       </Comp>
//     );
//   }
// );
// LoadingSkeleton.displayName = "LoadingSkeleton";

// export const SkeletonCard = ({ className = "", variant = "pulse", imageHeight = "h-48" }) => (
//   <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700", className)}>
//     <LoadingSkeleton className={cn(imageHeight, "rounded-t-xl")} variant={variant} />
//     <div className="p-4 space-y-3">
//       <LoadingSkeleton className="h-4 w-3/4 rounded-md" variant={variant} />
//       <LoadingSkeleton className="h-3 w-1/2 rounded-md" variant={variant} />
//       <div className="flex justify-between items-center">
//         <LoadingSkeleton className="h-4 w-1/4 rounded-md" variant={variant} />
//         <LoadingSkeleton className="h-8 w-20 rounded-xl" variant={variant} />
//       </div>
//     </div>
//   </div>
// );

// export const SkeletonList = ({ count = 3, className = "", variant = "pulse", avatar = true }) => (
//   <div className={cn("space-y-4", className)}>
//     {Array.from({ length: count }).map((_, i) => (
//       <div
//         key={i}
//         className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700"
//       >
//         <div className="flex items-center space-x-4">
//           {avatar && <LoadingSkeleton className="h-12 w-12 rounded-full" variant={variant} />}
//           <div className="space-y-2 flex-1">
//             <LoadingSkeleton className="h-4 w-3/4 rounded-md" variant={variant} />
//             <LoadingSkeleton className="h-3 w-1/2 rounded-md" variant={variant} />
//           </div>
//           <LoadingSkeleton className="h-8 w-20 rounded-xl" variant={variant} />
//         </div>
//       </div>
//     ))}
//   </div>
// );
import React, { forwardRef, useEffect, useRef } from "react";

// Utility function for className merging
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Global flag to track keyframe injection
let shimmerKeyframesInjected = false;

/**
 * Safely inject shimmer keyframes only once
 */
const injectShimmerKeyframes = () => {
  if (typeof document === "undefined" || shimmerKeyframesInjected) return;
  
  try {
    // Check if keyframes already exist
    const existingStyle = document.querySelector('#skeleton-shimmer-keyframes');
    if (existingStyle) {
      shimmerKeyframesInjected = true;
      return;
    }

    const style = document.createElement("style");
    style.id = "skeleton-shimmer-keyframes";
    style.textContent = `
      @keyframes skeleton-shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
    shimmerKeyframesInjected = true;
  } catch (error) {
    console.warn("Failed to inject shimmer keyframes:", error);
  }
};

// Base skeleton variants
const SKELETON_VARIANTS = {
  pulse: "animate-pulse",
  shimmer: "relative overflow-hidden",
  wave: "animate-pulse"
};

/**
 * Base LoadingSkeleton component with multiple animation variants
 * 
 * @example
 * // Basic skeleton
 * <LoadingSkeleton className="h-4 w-32" />
 * 
 * // With shimmer effect
 * <LoadingSkeleton variant="shimmer" className="h-48 w-full" />
 * 
 * // Accessible skeleton with screen reader announcement
 * <LoadingSkeleton announce className="h-6 w-24" />
 */
export const LoadingSkeleton = forwardRef(
  (
    {
      as: Component = "div",
      className = "",
      variant = "pulse",
      rounded = "rounded",
      announce = false,
      duration = "1.5s",
      children,
      ...props
    },
    ref
  ) => {
    const shimmerRef = useRef(null);

    // Inject keyframes for shimmer effect
    useEffect(() => {
      if (variant === "shimmer") {
        injectShimmerKeyframes();
      }
    }, [variant]);

    const baseClasses = cn(
      "bg-gray-200 dark:bg-gray-700",
      rounded,
      SKELETON_VARIANTS[variant] || SKELETON_VARIANTS.pulse,
      className
    );

    const ariaProps = announce ? {
      "aria-hidden": undefined,
      "role": "status",
      "aria-live": "polite",
      "aria-label": "Loading content"
    } : {
      "aria-hidden": true
    };

    return (
      <Component
        ref={ref}
        className={baseClasses}
        {...ariaProps}
        {...props}
      >
        {variant === "shimmer" && (
          <div
            ref={shimmerRef}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-gray-600/40"
            style={{
              transform: "translateX(-100%)",
              animation: `skeleton-shimmer ${duration} ease-in-out infinite`
            }}
            aria-hidden="true"
          />
        )}
        {children}
      </Component>
    );
  }
);

LoadingSkeleton.displayName = "LoadingSkeleton";

/**
 * Pre-built skeleton card component
 */
export const SkeletonCard = ({ 
  className = "", 
  variant = "pulse", 
  imageHeight = "h-48",
  showImage = true,
  showContent = true,
  showFooter = true,
  lines = 2
}) => (
  <div className={cn(
    "bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden",
    className
  )}>
    {showImage && (
      <LoadingSkeleton 
        className={cn(imageHeight, "rounded-t-xl rounded-b-none")} 
        variant={variant} 
        rounded=""
      />
    )}
    
    {showContent && (
      <div className="p-4 space-y-3">
        {/* Title */}
        <LoadingSkeleton 
          className="h-4 w-3/4 rounded-md" 
          variant={variant} 
        />
        
        {/* Content lines */}
        {Array.from({ length: lines }).map((_, i) => (
          <LoadingSkeleton 
            key={i}
            className={cn(
              "h-3 rounded-md",
              i === lines - 1 ? "w-1/2" : "w-full"
            )} 
            variant={variant} 
          />
        ))}
      </div>
    )}

    {showFooter && (
      <div className="px-4 pb-4 flex justify-between items-center">
        <LoadingSkeleton className="h-4 w-1/4 rounded-md" variant={variant} />
        <LoadingSkeleton className="h-8 w-20 rounded-xl" variant={variant} />
      </div>
    )}
  </div>
);

/**
 * Pre-built skeleton list component
 */
export const SkeletonList = ({ 
  count = 3, 
  className = "", 
  variant = "pulse", 
  avatar = true,
  lines = 2,
  actions = true
}) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700"
      >
        <div className="flex items-start space-x-4">
          {avatar && (
            <LoadingSkeleton 
              className="h-12 w-12 rounded-full flex-shrink-0" 
              variant={variant} 
            />
          )}
          
          <div className="space-y-2 flex-1 min-w-0">
            <LoadingSkeleton className="h-4 w-3/4 rounded-md" variant={variant} />
            {Array.from({ length: lines }).map((_, lineIndex) => (
              <LoadingSkeleton 
                key={lineIndex}
                className={cn(
                  "h-3 rounded-md",
                  lineIndex === lines - 1 ? "w-1/2" : "w-full"
                )} 
                variant={variant} 
              />
            ))}
          </div>
          
          {actions && (
            <LoadingSkeleton className="h-8 w-20 rounded-xl flex-shrink-0" variant={variant} />
          )}
        </div>
      </div>
    ))}
  </div>
);

/**
 * Skeleton table component
 */
export const SkeletonTable = ({
  rows = 5,
  columns = 4,
  className = "",
  variant = "pulse",
  showHeader = true
}) => (
  <div className={cn("bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden", className)}>
    {showHeader && (
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <LoadingSkeleton 
              key={i}
              className="h-4 rounded-md" 
              variant={variant}
            />
          ))}
        </div>
      </div>
    )}
    
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <LoadingSkeleton 
                key={colIndex}
                className={cn(
                  "h-3 rounded-md",
                  colIndex === 0 ? "w-3/4" : "w-full"
                )} 
                variant={variant}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Skeleton text component for paragraphs
 */
export const SkeletonText = ({
  lines = 3,
  className = "",
  variant = "pulse",
  spacing = "space-y-2"
}) => (
  <div className={cn(spacing, className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <LoadingSkeleton
        key={i}
        className={cn(
          "h-4 rounded-md",
          i === lines - 1 ? "w-3/4" : "w-full"
        )}
        variant={variant}
      />
    ))}
  </div>
);

/**
 * Skeleton avatar component
 */
export const SkeletonAvatar = ({
  size = "md",
  className = "",
  variant = "pulse"
}) => {
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8", 
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20"
  };

  return (
    <LoadingSkeleton
      className={cn(
        "rounded-full",
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      variant={variant}
    />
  );
};

/**
 * Skeleton button component
 */
export const SkeletonButton = ({
  size = "md",
  className = "",
  variant = "pulse",
  fullWidth = false
}) => {
  const sizeClasses = {
    sm: "h-8 w-16",
    md: "h-10 w-20",
    lg: "h-12 w-24"
  };

  return (
    <LoadingSkeleton
      className={cn(
        "rounded-lg",
        fullWidth ? "w-full h-10" : sizeClasses[size] || sizeClasses.md,
        className
      )}
      variant={variant}
    />
  );
};

// Export utility function for external use
export { injectShimmerKeyframes };