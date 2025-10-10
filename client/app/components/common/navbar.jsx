import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

export default function Navbar() {
    const { profile, account } = useAuth();
    const navigation = useNavigation();



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


    const getDarkerShade = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return hex;
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        const factor = 0.7;
        const rDark = Math.round(r * factor);
        const gDark = Math.round(g * factor);
        const bDark = Math.round(b * factor);

        return `rgb(${rDark}, ${gDark}, ${bDark})`;
    };

    const getLighterShade = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return hex;
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        const factor = 1.2;
        const rLight = Math.min(255, Math.round(r * factor));
        const gLight = Math.min(255, Math.round(g * factor));
        const bLight = Math.min(255, Math.round(b * factor));

        return `rgb(${rLight}, ${gLight}, ${bLight})`;
    };

    const base = profile?.color;
    const isHex = /^#([A-Fa-f0-9]{6})$/.test(base || "");
    const baseColor = isHex ? base : "#8A2BE2";

    return (
        <View style={{ overflow: 'hidden' }} className="h-16">
            {/*gradient background using profile color */}
            <LinearGradient
                colors={[getLighterShade(baseColor), baseColor, getDarkerShade(baseColor)]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="absolute inset-0"
                style={{
                    ...StyleSheet.absoluteFillObject,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 6
                }}
            />

            {/* Decorative elements */}
            <View style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
            }} />
            <View style={{
                position: 'absolute',
                bottom: -10,
                left: 20,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.12)'
            }} />

            {/* Navbar content */}
            <View className="h-16 px-4">
                <View className="flex-row justify-between items-center h-full">
                    <TouchableOpacity
                        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        className="p-2 rounded-lg"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 2,
                            elevation: 2
                        }}
                    >
                        <Ionicons name="menu-outline" size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-1 flex-row justify-center">
                        <Text
                            className="text-white text-xl font-bold"
                            style={{
                                textShadowColor: 'rgba(0, 0, 0, 0.2)',
                                textShadowOffset: { width: 0, height: 1 },
                                textShadowRadius: 3
                            }}
                        >
                            {profile?.profileName || 'פרופיל'}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <TouchableOpacity activeOpacity={0.8}>
                            <View
                                className="h-10 w-10 rounded-full items-center justify-center overflow-hidden"
                                style={{
                                    borderWidth: 2,
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 3,
                                    elevation: 2
                                }}
                            >
                                {profile?.avatar ? (
                                    <Image
                                        source={{ uri: profile.avatar }}
                                        className="h-full w-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <LinearGradient
                                        colors={[getLighterShade(baseColor), getDarkerShade(baseColor)]}
                                        style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <Text className="text-white font-semibold">
                                            {getDisplayInitial()}
                                        </Text>
                                    </LinearGradient>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}