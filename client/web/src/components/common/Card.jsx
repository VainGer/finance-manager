export default function Card({ 
    children, 
    variant = 'default',
    padding = 'normal',
    className = '',
    hover = true,
    onClick
}) {
    const getVariantClasses = (variant) => {
        switch (variant) {
            case 'modal':
                return 'bg-white border border-slate-200 rounded-xl shadow-xl';
            case 'feature':
                return 'bg-white border border-slate-200 rounded-xl shadow-sm';
            case 'form':
                return 'bg-white border border-slate-200 rounded-lg shadow-md';
            case 'info':
                return 'bg-slate-50 border border-slate-200 rounded-lg';
            case 'elevated':
                return 'bg-white border border-slate-300 rounded-xl shadow-lg';
            default:
                return 'bg-white border border-slate-200 rounded-lg shadow-sm';
        }
    };

    const getPaddingClasses = (padding) => {
        switch (padding) {
            case 'none':
                return '';
            case 'small':
                return 'p-4';
            case 'normal':
                return 'p-6';
            case 'large':
                return 'p-8';
            default:
                return 'p-6';
        }
    };

    const getHoverClasses = () => {
        return hover ? 'hover:shadow-lg transition-all duration-300' : '';
    };

    const cardClasses = `
        ${getVariantClasses(variant)}
        ${getPaddingClasses(padding)}
        ${getHoverClasses()}
        ${className}
    `.trim();

    const Component = onClick ? 'button' : 'div';

    return (
        <Component 
            className={cardClasses}
            onClick={onClick}
        >
            {children}
        </Component>
    );
}
