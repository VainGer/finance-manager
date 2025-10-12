export default function ProfileCard({ profile, onSelect, className = "" }) {
    const profileColor = profile.color || '#1e293b';
    
    return (
        <div
            onClick={() => onSelect(profile)}
            className={`group relative rounded-2xl border border-white/40 bg-white/95 backdrop-blur-xl shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-white/60 overflow-hidden ${className}`}
        >
            {/* Compact Card with Avatar and Name */}
            <div className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                    {/* Compact Avatar */}
                    <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-105 transition-transform duration-300"
                        style={{ backgroundColor: profileColor }}
                    >
                        {profile.avatar ? (
                            <img 
                                src={profile.avatar} 
                                alt={`${profile.profileName}'s avatar`} 
                                className="w-full h-full rounded-lg object-cover" 
                            />
                        ) : (
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}
                    </div>
                    
                    {/* Profile Name */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                            {profile.profileName}
                        </h3>
                        <p className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors duration-300">
                            לחץ להתחברות
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
