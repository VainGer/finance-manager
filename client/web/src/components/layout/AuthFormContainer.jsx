export default function AuthFormContainer({ 
    title, 
    subtitle, 
    children, 
    icon,
    className = ""
}) {
    return (
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-800 rounded-2xl mb-6 shadow-lg">
                        {icon || (
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}
                    </div>
                    <h1 className="text-3xl font-light text-slate-800 mb-2">{title}</h1>
                    {subtitle && <p className="text-slate-600">{subtitle}</p>}
                </div>

                {/* Form Container */}
                <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 ${className}`}>
                    {children}
                </div>
            </div>
        </div>
    );
}
