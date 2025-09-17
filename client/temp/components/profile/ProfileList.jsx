import { Image, TouchableOpacity, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileList({ profiles, onSelect }) {
    return (
        <ScrollView className="w-full">
            <Text className="text-slate-700 font-semibold mb-3 text-right">בחר פרופיל</Text>
            
            {profiles.map(profile => (
                <TouchableOpacity
                    key={profile.profileName}
                    onPress={() => onSelect(profile)}
                    className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white"
                    style={{ 
                        shadowColor: "#64748b",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2
                    }}
                >
                    <View className="flex-row items-center p-3" style={{ backgroundColor: profile.color || '#1e293b' }}>
                        <View className="flex-1 items-end">
                            <Text className="text-lg font-semibold text-white">
                                {profile.profileName}
                            </Text>
                        </View>
                    </View>
                    
                    <View className="flex-row items-center justify-between p-3">
                        <Ionicons name="chevron-forward" size={20} color="#64748b" />
                        
                        <View className="flex-row items-center">
                            <Text className="text-slate-700 text-sm mr-2 text-right">לחץ להתחברות</Text>
                            <Image
                                source={
                                    profile.avatar
                                        ? { uri: profile.avatar }
                                        : require('../../assets/images/avatar_default.png')
                                }
                                className="w-10 h-10 rounded-full border border-slate-200"
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}