import ProfileCard from './ProfileCard';

export default function ProfileList({ profiles, onSelect }) {
    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    בחר פרופיל
                </h2>
                <p className="text-slate-600">
                    נמצאו {profiles.length} פרופילים
                </p>
            </div>

            {/* Profile Cards */}
            <div className="space-y-4">
                {profiles.map(profile => (
                    <ProfileCard
                        key={profile.profileName}
                        profile={profile}
                        onSelect={onSelect}
                    />
                ))}
            </div>
        </div>
    );
}