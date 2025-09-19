<<<<<<< HEAD
// import React from "react";
// import { Link } from "react-router-dom";
// import { ArrowUpRight, ArrowDownRight, Info, ExternalLink } from "lucide-react";

// const COLOR_VARIANTS = {
//   primary: {
//     bg: "bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/30",
//     icon: "text-primary-600 dark:text-primary-400",
//     accent: "from-primary-500/10 via-primary-500/20 to-transparent",
//     ring: "ring-primary-200/70 dark:ring-primary-800/70"
//   },
//   success: {
//     bg: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/30",
//     icon: "text-emerald-600 dark:text-emerald-400",
//     accent: "from-emerald-500/10 via-emerald-500/20 to-transparent",
//     ring: "ring-emerald-200/70 dark:ring-emerald-800/70"
//   },
//   warning: {
//     bg: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/30",
//     icon: "text-amber-600 dark:text-amber-400",
//     accent: "from-amber-500/10 via-amber-500/20 to-transparent",
//     ring: "ring-amber-200/70 dark:ring-amber-800/70"
//   },
//   danger: {
//     bg: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30",
//     icon: "text-red-600 dark:text-red-400",
//     accent: "from-red-500/10 via-red-500/20 to-transparent",
//     ring: "ring-red-200/70 dark:ring-red-800/70"
//   },
//   neutral: {
//     bg: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/30",
//     icon: "text-gray-600 dark:text-gray-400",
//     accent: "from-gray-500/10 via-gray-500/20 to-transparent",
//     ring: "ring-gray-200/70 dark:ring-gray-800/70"
//   }
// };

// const SIZE_VARIANTS = {
//   sm: {
//     container: "p-4",
//     icon: "w-8 h-8",
//     iconSize: "h-4 w-4",
//     value: "text-lg",
//     label: "text-xs"
//   },
//   md: {
//     container: "p-5",
//     icon: "w-10 h-10",
//     iconSize: "h-5 w-5",
//     value: "text-2xl",
//     label: "text-sm"
//   },
//   lg: {
//     container: "p-6",
//     icon: "w-12 h-12",
//     iconSize: "h-6 w-6",
//     value: "text-3xl",
//     label: "text-base"
//   }
// };

// function TrendIndicator({ trend, size = "md" }) {
//   if (!trend) return null;

//   const isPositive = trend.direction === "up";
//   const IconComponent = isPositive ? ArrowUpRight : ArrowDownRight;
//   const colorClass = isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
//   const bgClass = isPositive ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-red-50 dark:bg-red-900/20";

//   return (
//     <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${bgClass} ${colorClass}`}>
//       <IconComponent className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"}`} />
//       <span className={`font-medium ${size === "sm" ? "text-xs" : "text-xs"}`}>
//         {trend.value}
//       </span>
//       {trend.period && (
//         <span className={`${size === "sm" ? "text-xs" : "text-xs"} opacity-80`}>
//           {trend.period}
//         </span>
//       )}
//     </div>
//   );
// }

// function StatCardContent({ 
//   icon: Icon, 
//   label, 
//   value, 
//   description, 
//   trend, 
//   color,
//   size,
//   loading,
//   error 
// }) {
//   const colorVariant = COLOR_VARIANTS[color] || COLOR_VARIANTS.neutral;
//   const sizeVariant = SIZE_VARIANTS[size] || SIZE_VARIANTS.md;

//   if (loading) {
//     return (
//       <div className="animate-pulse">
//         <div className="flex items-start justify-between gap-4">
//           <div className={`${sizeVariant.icon} rounded-lg bg-gray-200 dark:bg-gray-700`} />
//           <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
//         </div>
//         <div className="mt-3 w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
//         <div className="mt-1 w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-4">
//         <div className="text-red-500 dark:text-red-400 text-sm">
//           Failed to load data
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Header */}
//       <div className="flex items-start justify-between gap-4">
//         <div className={`inline-flex items-center justify-center ${sizeVariant.icon} rounded-lg shrink-0 ${colorVariant.bg} ${colorVariant.ring} ring-1`}>
//           <Icon className={`${sizeVariant.iconSize} ${colorVariant.icon}`} />
//         </div>
//         <TrendIndicator trend={trend} size={size} />
//       </div>

//       {/* Content */}
//       <div className="mt-4">
//         <div className={`${sizeVariant.value} font-bold text-gray-900 dark:text-white`}>
//           {value}
//         </div>
//         <div className={`mt-1 ${sizeVariant.label} text-gray-600 dark:text-gray-400 flex items-center gap-2`}>
//           <span>{label}</span>
//           {description && (
//             <div className="group relative">
//               <Info className="h-3 w-3 text-gray-400 cursor-help" />
//               <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
//                 {description}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Accent bar */}
//       <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorVariant.accent}`} />
//     </>
//   );
// }

// export default function StatCard({
//   icon,
//   label,
//   value,
//   color = "neutral",
//   size = "md",
//   trend,
//   description,
//   to,
//   onClick,
//   className = "",
//   loading = false,
//   error = false,
//   ...props
// }) {
//   const sizeVariant = SIZE_VARIANTS[size] || SIZE_VARIANTS.md;
  
//   const baseClasses = `
//     relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70
//     bg-white dark:bg-gray-900
//     hover:shadow-md hover:ring-gray-300/70 dark:hover:ring-gray-700/70
//     transition-all duration-200
//     ${sizeVariant.container}
//     ${className}
//   `.trim();

//   // Interactive classes for clickable cards
//   const interactiveClasses = (to || onClick) ? `
//     cursor-pointer 
//     hover:scale-[1.02] 
//     active:scale-[0.98]
//     focus:outline-none 
//     focus:ring-2 
//     focus:ring-primary-500 
//     focus:ring-offset-2 
//     dark:focus:ring-offset-gray-900
//   `.trim() : "";

//   const cardClasses = `${baseClasses} ${interactiveClasses}`;

//   // Content props
//   const contentProps = {
//     icon,
//     label,
//     value,
//     description,
//     trend,
//     color,
//     size,
//     loading,
//     error
//   };

//   // Handle click
//   const handleClick = (e) => {
//     if (onClick) {
//       e.preventDefault();
//       onClick(e);
//     }
//   };

//   // Render as Link if 'to' prop is provided
//   if (to) {
//     return (
//       <Link 
//         to={to} 
//         className={cardClasses}
//         aria-label={`View details for ${label}`}
//         {...props}
//       >
//         <StatCardContent {...contentProps} />
//         {/* External link indicator */}
//         <ExternalLink className="absolute top-3 right-3 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
//       </Link>
//     );
//   }

//   // Render as button if onClick is provided
//   if (onClick) {
//     return (
//       <button 
//         onClick={handleClick}
//         className={cardClasses}
//         aria-label={`${label}: ${value}`}
//         {...props}
//       >
//         <StatCardContent {...contentProps} />
//       </button>
//     );
//   }

//   // Render as div (non-interactive)
//   return (
//     <div 
//       className={baseClasses}
//       role="img"
//       aria-label={`${label}: ${value}`}
//       {...props}
//     >
//       <StatCardContent {...contentProps} />
//     </div>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";

/**
 * StatCard
 * Props:
 * - icon: Lucide icon component
 * - label: string
 * - value: string | number
 * - trend?: { direction: 'up' | 'down', value: string }
 * - color?: 'primary' | 'success' | 'warning' | 'neutral'
 * - size?: 'sm' | 'md' | 'lg'
 * - subtle?: boolean (lower visual weight)
 * - to?: string (if provided, wraps with Link hover affordance)
 */
const COLORS = {
  primary: {
    chip: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
    icon: "text-blue-600 dark:text-blue-400",
  },
  success: {
    chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    chip: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
    icon: "text-amber-600 dark:text-amber-400",
  },
  neutral: {
    chip: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
    icon: "text-gray-600 dark:text-gray-400",
  },
};

const SIZES = {
  sm: { pad: "p-3", label: "text-xs", value: "text-lg", iconBox: "w-8 h-8", icon: "h-4 w-4" },
  md: { pad: "p-4", label: "text-sm", value: "text-2xl", iconBox: "w-10 h-10", icon: "h-5 w-5" },
  lg: { pad: "p-5", label: "text-sm", value: "text-3xl", iconBox: "w-12 h-12", icon: "h-6 w-6" },
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color = "neutral",
  size = "md",
  subtle = false,
  to,
}) {
  const c = COLORS[color] || COLORS.neutral;
  const s = SIZES[size] || SIZES.md;

  const Content = (
    <div
      className={[
        "rounded-2xl border border-gray-200 dark:border-gray-800 transition-colors",
        subtle ? "bg-white/60 dark:bg-gray-900/60" : "bg-white dark:bg-gray-900",
        s.pad,
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className={[
              "rounded-lg flex items-center justify-center",
              s.iconBox,
              c.chip,
            ].join(" ")}
          >
            <Icon className={s.icon} />
          </div>
        )}
        <div className="flex-1">
          <div className={`text-gray-500 dark:text-gray-400 ${s.label}`}>{label}</div>
          <div className={`font-semibold text-gray-900 dark:text-white ${s.value}`}>{value}</div>
        </div>
        {trend && (
          <div
            className={[
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.direction === "up"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300",
            ].join(" ")}
            title="Trend"
          >
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );

  return to ? (
    <Link to={to} className="block hover:shadow-md hover:-translate-y-0.5 transition">
      {Content}
    </Link>
  ) : (
    Content
  );
}
=======
import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, Info, ExternalLink } from "lucide-react";

const COLOR_VARIANTS = {
  primary: {
    bg: "bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/30",
    icon: "text-primary-600 dark:text-primary-400",
    accent: "from-primary-500/10 via-primary-500/20 to-transparent",
    ring: "ring-primary-200/70 dark:ring-primary-800/70"
  },
  success: {
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/30",
    icon: "text-emerald-600 dark:text-emerald-400",
    accent: "from-emerald-500/10 via-emerald-500/20 to-transparent",
    ring: "ring-emerald-200/70 dark:ring-emerald-800/70"
  },
  warning: {
    bg: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/30",
    icon: "text-amber-600 dark:text-amber-400",
    accent: "from-amber-500/10 via-amber-500/20 to-transparent",
    ring: "ring-amber-200/70 dark:ring-amber-800/70"
  },
  danger: {
    bg: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30",
    icon: "text-red-600 dark:text-red-400",
    accent: "from-red-500/10 via-red-500/20 to-transparent",
    ring: "ring-red-200/70 dark:ring-red-800/70"
  },
  neutral: {
    bg: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/30",
    icon: "text-gray-600 dark:text-gray-400",
    accent: "from-gray-500/10 via-gray-500/20 to-transparent",
    ring: "ring-gray-200/70 dark:ring-gray-800/70"
  }
};

const SIZE_VARIANTS = {
  sm: {
    container: "p-4",
    icon: "w-8 h-8",
    iconSize: "h-4 w-4",
    value: "text-lg",
    label: "text-xs"
  },
  md: {
    container: "p-5",
    icon: "w-10 h-10",
    iconSize: "h-5 w-5",
    value: "text-2xl",
    label: "text-sm"
  },
  lg: {
    container: "p-6",
    icon: "w-12 h-12",
    iconSize: "h-6 w-6",
    value: "text-3xl",
    label: "text-base"
  }
};

function TrendIndicator({ trend, size = "md" }) {
  if (!trend) return null;

  const isPositive = trend.direction === "up";
  const IconComponent = isPositive ? ArrowUpRight : ArrowDownRight;
  const colorClass = isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
  const bgClass = isPositive ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-red-50 dark:bg-red-900/20";

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${bgClass} ${colorClass}`}>
      <IconComponent className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"}`} />
      <span className={`font-medium ${size === "sm" ? "text-xs" : "text-xs"}`}>
        {trend.value}
      </span>
      {trend.period && (
        <span className={`${size === "sm" ? "text-xs" : "text-xs"} opacity-80`}>
          {trend.period}
        </span>
      )}
    </div>
  );
}

function StatCardContent({ 
  icon: Icon, 
  label, 
  value, 
  description, 
  trend, 
  color,
  size,
  loading,
  error 
}) {
  const colorVariant = COLOR_VARIANTS[color] || COLOR_VARIANTS.neutral;
  const sizeVariant = SIZE_VARIANTS[size] || SIZE_VARIANTS.md;

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-start justify-between gap-4">
          <div className={`${sizeVariant.icon} rounded-lg bg-gray-200 dark:bg-gray-700`} />
          <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="mt-3 w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="mt-1 w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <div className="text-red-500 dark:text-red-400 text-sm">
          Failed to load data
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className={`inline-flex items-center justify-center ${sizeVariant.icon} rounded-lg shrink-0 ${colorVariant.bg} ${colorVariant.ring} ring-1`}>
          <Icon className={`${sizeVariant.iconSize} ${colorVariant.icon}`} />
        </div>
        <TrendIndicator trend={trend} size={size} />
      </div>

      {/* Content */}
      <div className="mt-4">
        <div className={`${sizeVariant.value} font-bold text-gray-900 dark:text-white`}>
          {value}
        </div>
        <div className={`mt-1 ${sizeVariant.label} text-gray-600 dark:text-gray-400 flex items-center gap-2`}>
          <span>{label}</span>
          {description && (
            <div className="group relative">
              <Info className="h-3 w-3 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Accent bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorVariant.accent}`} />
    </>
  );
}

export default function StatCard({
  icon,
  label,
  value,
  color = "neutral",
  size = "md",
  trend,
  description,
  to,
  onClick,
  className = "",
  loading = false,
  error = false,
  ...props
}) {
  const sizeVariant = SIZE_VARIANTS[size] || SIZE_VARIANTS.md;
  
  const baseClasses = `
    relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-200/70 dark:ring-gray-800/70
    bg-white dark:bg-gray-900
    hover:shadow-md hover:ring-gray-300/70 dark:hover:ring-gray-700/70
    transition-all duration-200
    ${sizeVariant.container}
    ${className}
  `.trim();

  // Interactive classes for clickable cards
  const interactiveClasses = (to || onClick) ? `
    cursor-pointer 
    hover:scale-[1.02] 
    active:scale-[0.98]
    focus:outline-none 
    focus:ring-2 
    focus:ring-primary-500 
    focus:ring-offset-2 
    dark:focus:ring-offset-gray-900
  `.trim() : "";

  const cardClasses = `${baseClasses} ${interactiveClasses}`;

  // Content props
  const contentProps = {
    icon,
    label,
    value,
    description,
    trend,
    color,
    size,
    loading,
    error
  };

  // Handle click
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <Link 
        to={to} 
        className={cardClasses}
        aria-label={`View details for ${label}`}
        {...props}
      >
        <StatCardContent {...contentProps} />
        {/* External link indicator */}
        <ExternalLink className="absolute top-3 right-3 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    );
  }

  // Render as button if onClick is provided
  if (onClick) {
    return (
      <button 
        onClick={handleClick}
        className={cardClasses}
        aria-label={`${label}: ${value}`}
        {...props}
      >
        <StatCardContent {...contentProps} />
      </button>
    );
  }

  // Render as div (non-interactive)
  return (
    <div 
      className={baseClasses}
      role="img"
      aria-label={`${label}: ${value}`}
      {...props}
    >
      <StatCardContent {...contentProps} />
    </div>
  );
}
>>>>>>> 4aaf08ad57bfe341382432d957ec3746b55e0cd0
