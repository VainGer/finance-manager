export default function QuickActionCard({ 
    icon, 
    title, 
    description, 
    onClick, 
    priority = "normal", 
    className = "" 
}) {
    const priorityClasses = {
        high: {
            bg: "from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900",
            border: "border-slate-400/30 hover:border-slate-300/50",
            iconBg: "bg-white/20 group-hover:bg-white/30",
            shadow: "shadow-slate-500/20 hover:shadow-slate-500/30"
        },
        normal: {
            bg: "from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800",
            border: "border-slate-400/30 hover:border-slate-300/50",
            iconBg: "bg-white/20 group-hover:bg-white/30",
            shadow: "shadow-slate-500/20 hover:shadow-slate-500/30"
        },
        low: {
            bg: "from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700",
            border: "border-slate-400/20 hover:border-slate-300/40",
            iconBg: "bg-white/15 group-hover:bg-white/25",
            shadow: "shadow-slate-400/15 hover:shadow-slate-400/25"
        }
    };

    const currentPriority = priorityClasses[priority];
    const isMobileOptimized = className.includes('mobile-optimized');

    return (
        <button
            onClick={onClick}
            className={`
                w-full rounded-xl bg-gradient-to-r ${currentPriority.bg}
                text-white shadow-lg hover:shadow-xl ${currentPriority.shadow}
                transform hover:scale-[1.02] hover:-translate-y-1
                transition-all duration-300 group text-right
                border ${currentPriority.border}
                backdrop-blur-sm relative overflow-hidden
                ${isMobileOptimized ? 'p-3' : 'p-4'}
                ${className}
            `}
            dir="rtl"
        >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Content */}
            <div className="relative flex items-center gap-3">
                <div className={`
                    ${currentPriority.iconBg} rounded-lg flex items-center justify-center 
                    transition-all duration-300 relative
                    ${isMobileOptimized ? 'w-10 h-10' : 'w-12 h-12'}
                `}>
                    {/* Icon glow effect */}
                    <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                        {icon}
                    </div>
                </div>
                
                <div className="flex-1 min-w-0">
                    <h4 className={`
                        font-semibold text-white mb-1 truncate relative
                        ${isMobileOptimized ? 'text-sm' : 'text-sm'}
                    `}>
                        {title}
                    </h4>
                    {description && (
                        <p className={`
                            text-white/95 font-medium transition-colors duration-300
                            ${isMobileOptimized ? 'text-xs' : 'text-xs leading-relaxed'}
                        `}>
                            {description}
                        </p>
                    )}
                </div>
                
                {/* Enhanced arrow with animation */}
                <div className="relative">
                    <svg className={`
                        text-white/60 group-hover:text-white/90 transition-all duration-300
                        transform group-hover:translate-x-1
                        ${isMobileOptimized ? 'w-4 h-4' : 'w-5 h-5'}
                    `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    
                    {/* Subtle arrow glow */}
                    <div className="absolute inset-0 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className={`${isMobileOptimized ? 'w-4 h-4' : 'w-5 h-5'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                </div>
            </div>
            
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
    );
}
