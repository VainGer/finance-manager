export default function ProfileList({ profiles, onSelect }) {
    return (
        <div className="p-4">
            <ul className="grid gap-6 w-1/2 mx-auto">
                {profiles.map(profile => (
                    <li
                        key={profile.profileName}
                        onClick={() => onSelect(profile)}
                        className="rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105"
                        style={{ backgroundColor: profile.color || '#A0AEC0' }} // Fallback color
                    >
                        <div className="grid grid-cols-2 items-center p-4">
                            <img
                                src={profile.avatar || '/src/assets/images/avatar_default.png'}
                                alt={`${profile.profileName}'s avatar`}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white mb-3"
                            />
                            <span className="text-lg font-semibold text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                                {profile.profileName}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}