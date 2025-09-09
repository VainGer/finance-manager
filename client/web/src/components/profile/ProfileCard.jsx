export default function ProfileCard({ profile, onSelect, className = "" }) {
    return (
        <div
            onClick={() => onSelect(profile)}
            className={`rounded-2xl border border-slate-200 bg-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden ${className}`}
        >
            {/* Header with profile color */}
            <div
                className="p-4 text-right"
                style={{ backgroundColor: profile.color || '#1e293b' }}
            >
                <h3 className="text-lg font-semibold text-white">
                    {profile.profileName}
                </h3>
            </div>

            {/* Card Body */}
            <div className="p-4 flex items-center justify-between">
                <div className="text-slate-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm text-slate-600">
                            לחץ להתחברות
                        </p>
                    </div>
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                        style={{ backgroundColor: profile.color || '#64748b' }}
                    >
                        {profile.avatar ? (
                            <img src={profile.avatar} alt={`${profile.profileName}'s avatar`} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
