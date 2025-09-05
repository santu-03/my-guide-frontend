// import { useEffect } from 'react';
// import { X } from 'lucide-react';
// import Button from './Button';

// const Modal = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   size = 'md',
//   showCloseButton = true,
//   ...props
// }) => {
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape') {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'hidden';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   const sizes = {
//     sm: 'max-w-md',
//     md: 'max-w-lg',
//     lg: 'max-w-2xl',
//     xl: 'max-w-4xl',
//     full: 'max-w-full mx-4'
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex min-h-full items-center justify-center p-4">
//         {/* Backdrop */}
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//           onClick={onClose}
//         />
        
//         {/* Modal */}
//         <div className={`relative bg-white rounded-xl shadow-xl transform transition-all w-full ${sizes[size]} dark:bg-gray-800`} {...props}>
//           {/* Header */}
//           {(title || showCloseButton) && (
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//               {title && (
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                   {title}
//                 </h3>
//               )}
//               {showCloseButton && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={onClose}
//                   className="p-2"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               )}
//             </div>
//           )}
          
//           {/* Content */}
//           <div className="px-6 py-4">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;


import React, { useEffect, useRef, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Button from './Button';

const focusables = 'a[href],area[href],input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),[tabindex]:not([tabindex="-1"])';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  escClosable = true,
  preventScroll = true,
  className = '',
  contentClassName = '',
  headerClassName = '',
  ...props
}) => {
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);
  const prevActiveRef = useRef(null);
  const titleId = useId();

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-full mx-4' };

  const handleKeydown = useCallback((e) => {
    if (e.key === 'Escape' && escClosable) { e.stopPropagation(); onClose?.(); }
    if (e.key === 'Tab' && panelRef.current) {
      const nodes = Array.from(panelRef.current.querySelectorAll(focusables)).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
      if (!nodes.length) { e.preventDefault(); return; }
      const [first] = nodes;
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) { e.preventDefault(); first.focus(); }
    }
  }, [escClosable, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    prevActiveRef.current = document.activeElement;
    document.addEventListener('keydown', handleKeydown);
    if (preventScroll) document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const p = panelRef.current;
      if (!p) return;
      const focusNodes = p.querySelectorAll(focusables);
      if (focusNodes.length) focusNodes[0].focus();
      else if (closeBtnRef.current) closeBtnRef.current.focus();
    }, 0);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      if (preventScroll) document.body.style.overflow = '';
      if (prevActiveRef.current && prevActiveRef.current.focus) prevActiveRef.current.focus();
    };
  }, [isOpen, handleKeydown, preventScroll]);

  if (!isOpen) return null;

  const content = (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={closeOnBackdrop ? onClose : undefined} />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            className={['relative w-full transform rounded-xl bg-white shadow-xl transition-all dark:bg-gray-800', sizes[size], className].join(' ')}
            onClick={(e) => e.stopPropagation()}
            {...props}
          >
            {(title || showCloseButton) && (
              <div className={['flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700', headerClassName].join(' ')}>
                {title ? <h3 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3> : <div />}
                {showCloseButton && (
                  <Button ref={closeBtnRef} variant="ghost" size="sm" onClick={onClose} aria-label="Close modal" className="p-2">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            <div className={['px-6 py-4', contentClassName].join(' ')}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default Modal;
