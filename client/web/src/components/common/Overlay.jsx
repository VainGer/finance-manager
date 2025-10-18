import { useEffect } from 'react';

export default function Overlay({ visible, onClose, children }) {
    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [visible]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Background overlay */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Content */}
            <div className="relative bg-white rounded-2xl p-8 mx-4 max-w-md w-full shadow-2xl border border-slate-200 z-10">
                {children}
            </div>
        </div>
    );
}