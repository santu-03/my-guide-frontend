// import React from "react";

// export default function StatCard({ icon: Icon, label, value, color = "primary" }) {
//   const colorMap = {
//     primary: "bg-primary-100 text-primary-600",
//     blue: "bg-blue-100 text-blue-600",
//     green: "bg-green-100 text-green-600",
//     purple: "bg-purple-100 text-purple-600",
//     orange: "bg-orange-100 text-orange-600",
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 flex items-center gap-4 transition hover:shadow-lg">
//       <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${colorMap[color]}`}>
//         <Icon className="h-5 w-5" />
//       </div>
//       <div>
//         <div className="text-lg font-bold text-gray-900 dark:text-white">{value}</div>
//         <div className="text-sm text-gray-500">{label}</div>
//       </div>
//     </div>
//   );
// }
// FILE: StatCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  color = "primary",
  trend,
  description,
  onClick,
  to,
}) {
  const colorMap = {
    primary: "bg-primary-100 text-primary-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };
  const colorClasses = colorMap[color] || colorMap.primary;

  const Wrapper = to ? Link : onClick ? "button" : "div";
  const wrapperProps = {
    ...(to ? { to } : {}),
    ...(onClick ? { onClick } : {}),
    className:
      "bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 flex items-center gap-4 transition hover:shadow-lg w-full text-left",
    "aria-label": `${label}: ${value}`,
  };

  return (
    <Wrapper {...wrapperProps}>
      <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${colorClasses}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <div className="text-lg font-bold text-gray-900 dark:text-white">{value}</div>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          {label}
          {description && (
            <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
              <Info className="h-3 w-3" /> {description}
            </span>
          )}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 mt-1 text-xs font-medium ${
              trend.direction === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.direction === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend.value}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
