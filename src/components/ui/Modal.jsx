// import React, { useEffect, useRef, useId, useCallback } from "react";
// import { createPortal } from "react-dom";
// import { X } from "lucide-react";
// import Button from "./Button";

// const focusables =
//   'a[href],area[href],input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),[tabindex]:not([tabindex="-1"])';

// /**
//  * <Modal isOpen={open} onClose={()=>setOpen(false)} title="My Modal">
//  *   content...
//  * </Modal>
//  */
// const Modal = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   size = "md",
//   showCloseButton = true,
//   closeOnBackdrop = true,
//   escClosable = true,
//   preventScroll = true,
//   className = "",
//   contentClassName = "",
//   headerClassName = "",
//   initialFocusRef, // optional: element to focus first
//   ...props
// }) => {
//   const panelRef = useRef(null);
//   const closeBtnRef = useRef(null);
//   const prevActiveRef = useRef(null);
//   const titleId = useId();

//   const sizes = {
//     sm: "max-w-md",
//     md: "max-w-lg",
//     lg: "max-w-2xl",
//     xl: "max-w-4xl",
//     full: "max-w-full mx-4",
//   };

//   const handleKeydown = useCallback(
//     (e) => {
//       if (e.key === "Escape" && escClosable) {
//         e.stopPropagation();
//         onClose?.();
//       }
//       if (e.key === "Tab" && panelRef.current) {
//         const nodes = Array.from(
//           panelRef.current.querySelectorAll(focusables)
//         ).filter(
//           (el) =>
//             !el.hasAttribute("disabled") &&
//             el.getAttribute("aria-hidden") !== "true"
//         );
//         if (!nodes.length) {
//           e.preventDefault();
//           return;
//         }
//         const [first] = nodes;
//         const last = nodes[nodes.length - 1];
//         const active = document.activeElement;
//         if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
//           e.preventDefault();
//           last.focus();
//         } else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) {
//           e.preventDefault();
//           first.focus();
//         }
//       }
//     },
//     [escClosable, onClose]
//   );

//   useEffect(() => {
//     if (!isOpen) return;
//     prevActiveRef.current = document.activeElement;
//     document.addEventListener("keydown", handleKeydown);
//     if (preventScroll) document.body.style.overflow = "hidden";

//     // microtask to allow panel to mount
//     setTimeout(() => {
//       const target =
//         initialFocusRef?.current ||
//         panelRef.current?.querySelector(focusables) ||
//         closeBtnRef.current;
//       target?.focus?.();
//     }, 0);

//     return () => {
//       document.removeEventListener("keydown", handleKeydown);
//       if (preventScroll) document.body.style.overflow = "";
//       prevActiveRef.current?.focus?.();
//     };
//   }, [isOpen, handleKeydown, preventScroll, initialFocusRef]);

//   if (!isOpen) return null;

//   const content = (
//     <div className="fixed inset-0 z-50">
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black/50"
//         onClick={closeOnBackdrop ? onClose : undefined}
//       />
//       {/* Panel */}
//       <div className="fixed inset-0 overflow-y-auto">
//         <div className="flex min-h-full items-center justify-center p-4">
//           <div
//             ref={panelRef}
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby={title ? titleId : undefined}
//             className={[
//               "relative w-full transform rounded-xl bg-glass dark:bg-darkGlass backdrop-blur-xl border border-white/20 shadow-2xl",
//               sizes[size],
//               className,
//             ].join(" ")}
//             onClick={(e) => e.stopPropagation()}
//             {...props}
//           >
//             {(title || showCloseButton) && (
//               <div
//                 className={[
//                   "flex items-center justify-between px-6 py-4 border-b border-white/20",
//                   headerClassName,
//                 ].join(" ")}
//               >
//                 {title ? (
//                   <h3
//                     id={titleId}
//                     className="text-lg font-semibold text-white"
//                   >
//                     {title}
//                   </h3>
//                 ) : (
//                   <div />
//                 )}
//                 {showCloseButton && (
//                   <Button
//                     ref={closeBtnRef}
//                     variant="ghost"
//                     size="sm"
//                     onClick={onClose}
//                     aria-label="Close modal"
//                     className="p-2"
//                   >
//                     <X className="h-4 w-4 text-white" />
//                   </Button>
//                 )}
//               </div>
//             )}

//             <div className={["px-6 py-4 text-white", contentClassName].join(" ")}>
//               {children}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return createPortal(content, document.body);
// };

// export default Modal;
import React, { useEffect, useRef, useId, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import Button from "./Button";

// Utility function for className merging
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Focusable elements selector
const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]'
].join(',');

// Modal size configurations
const MODAL_SIZES = {
  xs: "max-w-xs",
  sm: "max-w-md",
  md: "max-w-lg", 
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-6xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]"
};

// Modal variant configurations
const MODAL_VARIANTS = {
  glass: {
    backdrop: "bg-black/50 backdrop-blur-sm",
    panel: "bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-700/20",
    header: "border-b border-white/20 dark:border-gray-700/20",
    title: "text-white dark:text-white",
    content: "text-white dark:text-white"
  },
  solid: {
    backdrop: "bg-black/50",
    panel: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
    header: "border-b border-gray-200 dark:border-gray-700",
    title: "text-gray-900 dark:text-white",
    content: "text-gray-900 dark:text-white"
  }
};

/**
 * Hook to manage focus trap within modal
 */
const useFocusTrap = (isOpen, containerRef, initialFocusRef) => {
  const previousActiveElement = useRef(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    return Array.from(
      containerRef.current.querySelectorAll(FOCUSABLE_ELEMENTS)
    ).filter(el => 
      !el.hasAttribute('disabled') && 
      el.getAttribute('aria-hidden') !== 'true' &&
      el.offsetParent !== null // visible elements
    );
  }, [containerRef]);

  const handleKeyDown = useCallback((e) => {
    if (e.key !== 'Tab' || !containerRef.current) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) {
      e.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (e.shiftKey) {
      if (activeElement === firstElement || !containerRef.current.contains(activeElement)) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (activeElement === lastElement || !containerRef.current.contains(activeElement)) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, [containerRef, getFocusableElements]);

  useEffect(() => {
    if (!isOpen) return;

    // Store previously focused element
    previousActiveElement.current = document.activeElement;

    // Set initial focus
    const focusTarget = initialFocusRef?.current || getFocusableElements()[0];
    if (focusTarget) {
      // Use setTimeout to ensure the modal is fully rendered
      setTimeout(() => focusTarget.focus(), 0);
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore previous focus
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleKeyDown, initialFocusRef, getFocusableElements]);
};

/**
 * Hook to manage body scroll lock
 */
const useScrollLock = (isActive) => {
  useEffect(() => {
    if (!isActive) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = window.getComputedStyle(document.body).paddingRight;
    
    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isActive]);
};

/**
 * Accessible Modal component with focus management and keyboard navigation
 * 
 * @example
 * <Modal 
 *   isOpen={isOpen} 
 *   onClose={() => setIsOpen(false)} 
 *   title="Confirm Action"
 *   size="md"
 * >
 *   <p>Are you sure you want to continue?</p>
 *   <div className="flex gap-2 mt-4">
 *     <Button onClick={() => setIsOpen(false)}>Cancel</Button>
 *     <Button variant="danger">Confirm</Button>
 *   </div>
 * </Modal>
 */
const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = "md",
  variant = "solid",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  preventScroll = true,
  className = "",
  contentClassName = "",
  headerClassName = "",
  backdropClassName = "",
  initialFocusRef,
  onOpen,
  onAfterOpen,
  onAfterClose,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const titleId = useId();
  const contentId = useId();

  // Get variant configuration
  const variantConfig = MODAL_VARIANTS[variant] || MODAL_VARIANTS.solid;

  // Manage focus trap
  useFocusTrap(isOpen, panelRef, initialFocusRef);
  
  // Manage scroll lock
  useScrollLock(isOpen && preventScroll);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle modal lifecycle
  useEffect(() => {
    if (isOpen) {
      onOpen?.();
      // Small delay to ensure DOM is ready
      setTimeout(() => onAfterOpen?.(), 100);
    } else {
      onAfterClose?.();
    }
  }, [isOpen, onOpen, onAfterOpen, onAfterClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose?.();
    }
  }, [closeOnBackdrop, onClose]);

  // Handle panel click (stop propagation)
  const handlePanelClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // Memoize backdrop classes
  const backdropClasses = useMemo(() => cn(
    "fixed inset-0",
    variantConfig.backdrop,
    backdropClassName
  ), [variantConfig.backdrop, backdropClassName]);

  // Memoize panel classes
  const panelClasses = useMemo(() => cn(
    "relative w-full transform rounded-xl shadow-2xl transition-all",
    variantConfig.panel,
    MODAL_SIZES[size] || MODAL_SIZES.md,
    className
  ), [variantConfig.panel, size, className]);

  // Determine aria attributes
  const ariaProps = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy || (title ? titleId : undefined),
    'aria-describedby': ariaDescribedBy || contentId,
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" {...ariaProps}>
      {/* Backdrop */}
      <div 
        className={backdropClasses}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            ref={panelRef}
            className={panelClasses}
            onClick={handlePanelClick}
            {...props}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className={cn(
                "flex items-center justify-between px-6 py-4",
                variantConfig.header,
                headerClassName
              )}>
                {title ? (
                  <h2
                    id={titleId}
                    className={cn(
                      "text-lg font-semibold leading-6",
                      variantConfig.title
                    )}
                  >
                    {title}
                  </h2>
                ) : (
                  <div />
                )}
                
                {showCloseButton && (
                  <Button
                    ref={closeBtnRef}
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="p-2 -mr-2"
                  >
                    <X className={cn(
                      "h-4 w-4",
                      variant === "glass" ? "text-white" : "text-gray-500"
                    )} />
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div 
              id={contentId}
              className={cn(
                "px-6 py-4",
                variantConfig.content,
                contentClassName
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render at document body
  return createPortal(modalContent, document.body);
};

/**
 * Modal confirmation dialog component
 */
export const ModalConfirm = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  ...props
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm?.();
      onClose?.();
    } catch (error) {
      console.error('Confirmation action failed:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      {...props}
    >
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
      
      <div className="flex gap-3 justify-end">
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant={variant}
          onClick={handleConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

Modal.displayName = "Modal";
ModalConfirm.displayName = "ModalConfirm";

export { MODAL_SIZES, MODAL_VARIANTS };
export default Modal;