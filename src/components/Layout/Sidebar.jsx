import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Menu, X, LogOut, Settings, Users, ClipboardList, Calendar,
  MapPin, DollarSign, BarChart3, CreditCard, Layers, Heart, 
  BookOpen, Star, MessageCircle, Shield
} from "lucide-react";
import { useAuthStore } from "@/store/auth";

// Navigation configuration by role
const NAVIGATION_CONFIG = {
  traveller: {
    primary: [
      { to: "/dashboard/traveller", label: "Dashboard", icon: Home },
      { to: "/traveller/trips", label: "My Trips", icon: MapPin },
      { to: "/traveller/bookings", label: "Bookings", icon: Calendar },
      { to: "/traveller/expenses", label: "Expenses", icon: CreditCard },
      { to: "/traveller/reviews", label: "Reviews", icon: Star },
    ],
    secondary: [
      { to: "/traveller/wishlist", label: "Wishlist", icon: Heart },
      { to: "/traveller/messages", label: "Messages", icon: MessageCircle },
    ]
  },
  
  guide: {
    primary: [
      { to: "/dashboard/guide", label: "Dashboard", icon: Home },
      { to: "/guide/tours", label: "My Tours", icon: MapPin },
      { to: "/guide/bookings", label: "Bookings", icon: Calendar },
      { to: "/guide/earnings", label: "Earnings", icon: DollarSign },
      { to: "/guide/reviews", label: "Reviews", icon: Star },
    ],
    secondary: [
      { to: "/guide/profile", label: "Profile", icon: Users },
      { to: "/guide/availability", label: "Availability", icon: ClipboardList },
    ]
  },

  instructor: {
    primary: [
      { to: "/dashboard/instructor", label: "Dashboard", icon: Home },
      { to: "/instructor/courses", label: "My Courses", icon: BookOpen },
      { to: "/instructor/students", label: "Students", icon: Users },
      { to: "/instructor/earnings", label: "Earnings", icon: DollarSign },
      { to: "/instructor/analytics", label: "Analytics", icon: BarChart3 },
    ],
    secondary: [
      { to: "/instructor/materials", label: "Materials", icon: Layers },
      { to: "/instructor/schedule", label: "Schedule", icon: Calendar },
    ]
  },

  advisor: {
    primary: [
      { to: "/dashboard/advisor", label: "Dashboard", icon: Home },
      { to: "/advisor/clients", label: "Clients", icon: Users },
      { to: "/advisor/itineraries", label: "Itineraries", icon: MapPin },
      { to: "/advisor/bookings", label: "Bookings", icon: Calendar },
      { to: "/advisor/reports", label: "Reports", icon: BarChart3 },
    ],
    secondary: [
      { to: "/advisor/resources", label: "Resources", icon: Layers },
      { to: "/advisor/commissions", label: "Commissions", icon: DollarSign },
    ]
  },

  admin: {
    primary: [
      { to: "/dashboard/admin", label: "Dashboard", icon: Home },
      { to: "/admin/users", label: "Users", icon: Users },
      { to: "/admin/content", label: "Content", icon: ClipboardList },
      { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/admin/finances", label: "Finances", icon: DollarSign },
    ],
    secondary: [
      { to: "/admin/settings", label: "System Settings", icon: Settings },
      { to: "/admin/security", label: "Security", icon: Shield },
    ]
  }
};

const COMMON_ACTIONS = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help & Support", icon: MessageCircle },
];

export default function Sidebar({ 
  role = "traveller", 
  variant = "light",
  className = ""
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get navigation items for current role
  const navigationItems = NAVIGATION_CONFIG[role] || NAVIGATION_CONFIG.traveller;

  // Style classes
  const sidebarClasses = `
    fixed md:static top-0 left-0 h-full z-40 flex flex-col
    ${isCollapsed ? "w-20" : "w-64"} 
    ${variant === "dark" 
      ? "bg-gray-900 text-gray-200 border-r border-gray-800" 
      : "bg-white text-gray-800 border-r border-gray-200 shadow-sm"
    }
    transform transition-all duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    ${className}
  `.trim();

  const linkClasses = (isActive) => `
    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
    ${isCollapsed ? "justify-center" : ""}
    ${isActive
      ? "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 shadow-sm"
      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
    }
  `.trim();

  // Render navigation group
  const renderNavigationGroup = (title, items, showTitle = true) => (
    <div className="space-y-1">
      {!isCollapsed && showTitle && (
        <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 px-3 font-semibold">
          {title}
        </div>
      )}
      {items.map(({ to, label, icon: Icon }) => {
        const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
        return (
          <Link
            key={to}
            to={to}
            className={linkClasses(isActive)}
            onClick={() => setIsOpen(false)}
            title={isCollapsed ? label : undefined}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">{label}</span>}
            {isActive && !isCollapsed && (
              <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-primary-600 hover:bg-primary-700 text-white p-2.5 rounded-lg shadow-lg transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Link 
            to="/" 
            className={`flex items-center gap-3 font-bold text-lg hover:opacity-80 transition-opacity ${
              isCollapsed ? "justify-center" : ""
            }`}
            onClick={() => setIsOpen(false)}
          >
            {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg">
              <span className="font-extrabold">TG</span>
            </div> */}
            <img
              src="/images/LOGO2.png"   
              alt="TourGuide Logo"
              className="w-12 h-auto  group-hover:scale-105 transition-transform"
            />
            {!isCollapsed && (
              <span className="text-gray-900 dark:text-white">MyGuide</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Primary navigation */}
          {renderNavigationGroup("Main", navigationItems.primary)}
          
          {/* Secondary navigation */}
          {navigationItems.secondary && navigationItems.secondary.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              {renderNavigationGroup("Quick Access", navigationItems.secondary)}
            </div>
          )}

          {/* Common actions */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            {renderNavigationGroup("Support", COMMON_ACTIONS, false)}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          
          {/* User info */}
          {user && !isCollapsed && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-sm font-semibold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user.role}
                </div>
              </div>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Sign Out</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex w-full items-center justify-center p-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors border-t border-gray-200 dark:border-gray-800 mt-2 pt-2"
          >
            {isCollapsed ? "→ Expand" : "← Collapse"}
          </button>
        </div>
      </aside>
    </>
  );
}