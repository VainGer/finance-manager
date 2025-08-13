export default function Modal({ 
    isOpen, 
    onClose, 
    title, 
    subtitle,
    children, 
    size = 'default',
    closeOnOverlay = true,
    icon,
    iconColor = 'slate'
}) {
    if (!isOpen) return null;

    const getSizeClasses = (size) => {
        switch (size) {
            case 'small':
                return 'max-w-md';
            case 'default':
                return 'max-w-lg';
            case 'large':
                return 'max-w-2xl';
            case 'extra-large':
                return 'max-w-4xl';
            default:
                return 'max-w-lg';
        }
    };

    const getIconColorClasses = (color) => {
        switch (color) {
            case 'blue':
                return 'bg-gradient-to-r from-blue-500 to-indigo-600';
            case 'green':
                return 'bg-gradient-to-r from-emerald-500 to-green-600';
            case 'yellow':
                return 'bg-gradient-to-r from-yellow-500 to-orange-600';
            case 'red':
                return 'bg-gradient-to-r from-red-500 to-pink-600';
            case 'purple':
                return 'bg-gradient-to-r from-purple-500 to-indigo-600';
            case 'slate':
            default:
                return 'bg-gradient-to-r from-slate-600 to-slate-800';
        }
    };

    const handleOverlayClick = (e) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-slate-600/80 overflow-y-auto h-full w-full flex justify-center items-center z-50"
            onClick={handleOverlayClick}
        >
            <div className={`w-full ${getSizeClasses(size)} mx-auto p-4`}>
                <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6">
                    {(title || subtitle || icon) && (
                        <div className="text-center mb-6">
                            {icon && (
                                <div className={`mx-auto w-12 h-12 ${getIconColorClasses(iconColor)} rounded-full flex items-center justify-center mb-3`}>
                                    {icon}
                                </div>
                            )}
                            {title && (
                                <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                            )}
                            {subtitle && (
                                <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
                            )}
                        </div>
                    )}
                    
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
