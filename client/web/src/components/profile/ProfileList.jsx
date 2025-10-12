import ProfileCard from './ProfileCard';

export default function ProfileList({ profiles, onSelect }) {
    return (
        <div className="max-w-4xl mx-auto animate-slideUp">
            {/* Compact Header */}
            <div className="text-center mb-6">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-6">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            בחר פרופיל
                        </h2>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-slate-600 text-sm">
                        <span>נמצאו</span>
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full font-bold text-xs">
                            {profiles.length}
                        </span>
                        <span>פרופילים</span>
                    </div>
                </div>
            </div>

            {/* Compact Profile Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {profiles.map((profile, index) => (
                    <div
                        key={profile.profileName}
                        className="animate-slideUp"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <ProfileCard
                            profile={profile}
                            onSelect={onSelect}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}