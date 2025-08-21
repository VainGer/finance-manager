import { createPortal } from 'react-dom';
import { useEffect } from 'react';

export default function CenteredModal({
  children,
  onClose,
}) {
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[5000] flex justify-center items-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {children}
      </div>
    </div>,
    document.body
  );
}
