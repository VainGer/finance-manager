export default function StatusDot({ 
    color = 'blue', 
    size = 'md', 
    animated = false, 
    className = '', 
    children = null 
}) {
    const sizeClasses = {
        xs: 'w-2 h-2',
        sm: 'w-3 h-3', 
        md: 'w-4 h-4',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8'
    };

    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500', 
        orange: 'bg-orange-500',
        purple: 'bg-purple-500',
        red: 'bg-red-500',
        cyan: 'bg-cyan-500',
        slate: 'bg-slate-500',
        yellow: 'bg-yellow-500'
    };

    const animationClass = animated ? 'animate-pulse' : '';

    return (
        <div className="relative inline-flex items-center">
            <div 
                className={`
                    ${sizeClasses[size]} 
                    ${colorClasses[color]} 
                    rounded-full 
                    shadow-lg 
                    ${animationClass}
                    ${className}
                `}
            >
                {children}
            </div>
            {animated && (
                <div 
                    className={`
                        absolute inset-0 
                        ${colorClasses[color]} 
                        rounded-full 
                        animate-ping 
                        opacity-75
                    `}
                />
            )}
        </div>
    );
}