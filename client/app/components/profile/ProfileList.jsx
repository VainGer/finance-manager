import { Image, Pressable, ScrollView, Text } from "react-native";

export default function ProfileList({ profiles, onSelect }) {
    return (
        <ScrollView className="p-4">
            {profiles.map(profile => (
                <Pressable
                    key={profile.profileName}
                    onPress={() => onSelect(profile)}
                    className={`flex-row items-center p-4 mb-4 rounded-lg w-full`}
                    style={{ backgroundColor: profile.color ? profile.color : 'blue' }}
                >
                    <Image
                        source={
                            profile.avatar
                                ? { uri: profile.avatar }
                                : require('../../assets/images/avatar_default.png')
                        }
                        className="w-24 h-24 rounded-full object-cover border-4 border-white mb-3"
                    />
                    <Text
                        className="text-lg font-semibold text-white mx-10"
                    >
                        {profile.profileName}
                    </Text>
                </Pressable>
            ))}
        </ScrollView>
    );
}