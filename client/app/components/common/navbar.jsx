import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Image, Text, TouchableOpacity, View, I18nManager } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

export default function Navbar() {
    const { profile, account } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
    }, []);


    const getDisplayName = () => {
        if (profile?.profileName) {
            return profile.profileName;
        }
        if (account?.username) {
            return account.username;
        }
        return 'משתמש';
    };

    const getDisplayInitial = () => {
        const name = getDisplayName();
        return name.charAt(0).toUpperCase();
    };

    const getNavbarColor = () => {
        if (profile?.color) {
            return profile.color;
        }
        return '#2563EB';
    };

    const getDarkerShade = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return hex;
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        const factor = 0.8;
        const rDark = Math.round(r * factor);
        const gDark = Math.round(g * factor);
        const bDark = Math.round(b * factor);

        return `rgb(${rDark}, ${gDark}, ${bDark})`;
    };

    const navbarColor = getNavbarColor();

    return (
        <View
            className="h-16 shadow-lg"
            style={{ backgroundColor: navbarColor }}
        >
            <View className="flex-row justify-between items-center h-full px-4">
                <TouchableOpacity
                    onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                    className="p-2"
                >
                    <Ionicons name="menu-outline" size={24} color="white" />
                </TouchableOpacity>
                <View className="flex-1 flex-row justify-center">
                    <Text className="text-white text-xl font-bold">
                        {profile.profileName}
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <View
                        className="h-10 w-10 rounded-full items-center justify-center border-2 border-white/20 overflow-hidden"
                        style={{
                            backgroundColor: profile?.color ? getDarkerShade(profile.color) : 'rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        {profile?.avatar ? (
                            <Image
                                source={{ uri: profile.avatar }}
                                className="h-full w-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <Text className="text-white font-semibold">
                                {getDisplayInitial()}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}