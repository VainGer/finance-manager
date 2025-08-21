export default function FeatureCard({ icon, title, description, className = "" }) {
    return (
        <div className={`bg-white/70 backdrop-blur-lg rounded-2xl border border-white/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/80 ${className}`}>
            <div className="text-slate-700 mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
}
