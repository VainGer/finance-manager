export default function ProfileCard({ profile, onSelect, className = "" }) {
    return (
        <div
            onClick={() => onSelect(profile)}
            className={`bg-white/80 backdrop-blur-lg rounded-2xl border border-white/50 shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl p-6 ${className}`}
        >
            <div className="flex items-center gap-4">
                {/* Profile Avatar */}
                <div className="relative">
                    <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: profile.color || '#64748b' }}
                    >
                        {profile.avatar ? (
                            <img
                                src={profile.avatar}
                                alt={`${profile.profileName}'s avatar`}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                        {profile.profileName}
                    </h3>
                    <p className="text-sm text-slate-600">
                        לחץ להתחברות
                    </p>
                </div>

                {/* Arrow Icon */}
                <div className="text-slate-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
