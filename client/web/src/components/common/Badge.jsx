export default function Badge({ 
    children, 
    variant = 'default',
    size = 'normal',
    className = ''
}) {
    const getSizeClasses = (size) => {
        switch (size) {
            case 'small':
                return 'px-2 py-1 text-xs';
            case 'normal':
                return 'px-3 py-1 text-sm';
            case 'large':
                return 'px-4 py-2 text-base';
            default:
                return 'px-3 py-1 text-sm';
        }
    };

    const getVariantClasses = (variant) => {
        switch (variant) {
            case 'success':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'error':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'warning':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'info':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'purple':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'neutral':
                return 'bg-slate-100 text-slate-800 border-slate-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const badgeClasses = `
        inline-flex items-center
        ${getSizeClasses(size)}
        ${getVariantClasses(variant)}
        font-medium rounded-full border
        ${className}
    `.trim();

    return (
        <span className={badgeClasses}>
            {children}
        </span>
    );
}
