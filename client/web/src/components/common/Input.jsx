export default function Input({ 
    type = 'text',
    label,
    placeholder,
    value,
    onChange,
    variant = 'default',
    size = 'normal',
    error,
    required = false,
    disabled = false,
    className = '',
    icon,
    currency = false,
    dir = 'rtl',
    ...props
}) {
    const getSizeClasses = (size) => {
        switch (size) {
            case 'small':
                return 'px-3 py-2 text-sm';
            case 'normal':
                return 'px-4 py-3 text-base';
            case 'large':
                return 'px-5 py-4 text-lg';
            default:
                return 'px-4 py-3 text-base';
        }
    };

    const getVariantClasses = (variant, error) => {
        if (error) {
            return 'border-red-300 focus:ring-red-500 focus:border-red-500';
        }
        
        switch (variant) {
            case 'financial':
                return 'border-slate-300 focus:ring-slate-500 focus:border-slate-500';
            case 'success':
                return 'border-emerald-300 focus:ring-emerald-500 focus:border-emerald-500';
            case 'warning':
                return 'border-amber-300 focus:ring-amber-500 focus:border-amber-500';
            default:
                return 'border-slate-300 focus:ring-blue-500 focus:border-blue-500';
        }
    };

    const inputClasses = `
        w-full
        ${getSizeClasses(size)}
        ${dir === 'rtl' ? 'text-right' : 'text-left'}
        border 
        ${getVariantClasses(variant, error)}
        rounded-lg 
        bg-white
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-opacity-50
        disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
        ${currency ? 'pl-10' : ''}
        ${className}
    `.trim();

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-semibold text-slate-700">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            <div className="relative">
                {currency && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <span className="text-slate-500 text-sm">₪</span>
                    </div>
                )}
                
                {icon && !currency && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        {icon}
                    </div>
                )}
                
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={inputClasses}
                    dir={dir}
                    {...props}
                />
            </div>
            
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
