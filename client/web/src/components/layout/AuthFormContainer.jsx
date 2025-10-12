export default function AuthFormContainer({ 
    title, 
    subtitle, 
    children, 
    icon,
    className = ""
}) {
    return (
        <div className="flex-1 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[calc(100vh-4rem)]">
            {/* Enhanced Background with circles */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
                {/* Background circles */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-100/40 to-blue-200/25 rounded-full blur-2xl"></div>
                <div className="absolute top-1/3 -left-32 w-56 h-56 bg-gradient-to-br from-slate-100/50 to-gray-200/30 rounded-full blur-xl"></div>
                <div className="absolute -bottom-20 -right-16 w-48 h-48 bg-gradient-to-br from-cyan-100/35 to-blue-100/25 rounded-full blur-xl"></div>
                <div className="absolute bottom-1/4 -left-12 w-40 h-40 bg-gradient-to-br from-slate-100/40 to-blue-100/20 rounded-full blur-lg animate-pulse"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Enhanced Header Section */}
                <div className="text-center mb-8 animate-fadeIn">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-slate-700 to-slate-800 rounded-3xl mb-6 shadow-2xl shadow-slate-500/25 transform hover:scale-105 transition-all duration-300">
                        <div className="relative">
                            {icon || (
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            )}
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-white/10 rounded-full blur-sm animate-pulse"></div>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-3 tracking-tight">{title}</h1>
                    {subtitle && (
                        <p className="text-lg text-slate-600 leading-relaxed max-w-sm mx-auto">{subtitle}</p>
                    )}
                </div>

                {/* Enhanced Form Container */}
                <div className={`bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/40 p-8 transform hover:shadow-3xl transition-all duration-500 hover:border-white/60 animate-slideUp ${className}`}>
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
                <div className="absolute bottom-8 left-6 w-3 h-3 bg-slate-400 rounded-full animate-pulse opacity-40"></div>
            </div>
        </div>
    );
}
