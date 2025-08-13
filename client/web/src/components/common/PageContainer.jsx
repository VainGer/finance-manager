export default function PageContainer({ 
    children, 
    title,
    subtitle,
    className = '',
    maxWidth = 'default'
}) {
    const getMaxWidthClasses = (maxWidth) => {
        switch (maxWidth) {
            case 'small':
                return 'max-w-4xl';
            case 'default':
                return 'max-w-6xl';
            case 'large':
                return 'max-w-7xl';
            case 'full':
                return 'max-w-full';
            default:
                return 'max-w-6xl';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
            <div className={`${getMaxWidthClasses(maxWidth)} mx-auto px-6 py-8 ${className}`}>
                {(title || subtitle) && (
                    <div className="mb-8">
                        {title && (
                            <h1 className="text-3xl font-light text-slate-800 tracking-tight mb-2">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="text-lg text-slate-600 font-light">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}
                
                {children}
            </div>
        </div>
    );
}
