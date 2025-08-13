export default function FeatureCard({ 
    icon, 
    title, 
    description, 
    iconColor = 'blue',
    className = ''
}) {
    const getIconColorClasses = (color) => {
        switch (color) {
            case 'blue':
                return 'bg-blue-50 text-blue-600';
            case 'emerald':
                return 'bg-emerald-50 text-emerald-600';
            case 'amber':
                return 'bg-amber-50 text-amber-600';
            case 'purple':
                return 'bg-purple-50 text-purple-600';
            case 'red':
                return 'bg-red-50 text-red-600';
            case 'slate':
                return 'bg-slate-50 text-slate-600';
            default:
                return 'bg-blue-50 text-blue-600';
        }
    };

    return (
        <div className={`bg-white border border-slate-200 p-8 rounded-xl hover:shadow-lg transition-all duration-300 ${className}`}>
            <div className={`w-12 h-12 ${getIconColorClasses(iconColor)} rounded-lg flex items-center justify-center mb-6`}>
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
}
