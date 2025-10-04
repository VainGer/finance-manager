import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useState } from 'react';
import useProfileSettings from '../../../hooks/useProfileSettings';
import LoadingSpinner from '../../../components/common/loadingSpinner';
import MenuButton from '../../../components/common/menuButton';
import { useAuth } from '../../../context/AuthContext';

export default function ProfileSettings() {
  const router = useRouter();
  const basePath = '/home/(profileSettings)';
  const [loading, setLoading] = useState(false);
  const { handleLogout, handleClearProfile } = useProfileSettings({ setLoading });
  const { profile } = useAuth();
  const childProfileRestriction = profile.parentProfile;

  if (loading) return <LoadingSpinner />;

  return (
    <LinearGradient
      colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
      <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
      <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center justify-center py-10 px-6">
          {/* Title */}
          <View className="items-center mb-10">
            <Text className="text-2xl font-bold text-slate-800">הגדרות פרופיל</Text>
            <View className="h-1 w-12 bg-blue-500 rounded-full mt-2" />
          </View>

          {/* Profile icon */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-2">
              <Ionicons name="person-circle-outline" size={36} color="#3b82f6" />
            </View>
          </View>

          {/* Menu options */}
          <View className="w-full max-w-sm">
            <MenuButton
              icon="create-outline"
              text="עריכת פרופיל"
              onPress={() => router.push(basePath + '/profileEdit')}
            />
            {childProfileRestriction && (
              <MenuButton
                icon="key-outline"
                text="שינוי סיסמת חשבון"
                onPress={() => router.push(basePath + '/changeAccountPassword')}
              />)}
            {childProfileRestriction && (
              <MenuButton
                icon="add-circle-outline"
                text="צור פרופיל חדש"
                onPress={() => router.push(basePath + '/createNewProfile')}
              />)}
            <MenuButton
              icon="swap-horizontal-outline"
              text="התנתקות מהפרופיל"
              onPress={handleClearProfile}
            />
            <MenuButton
              icon="power-outline"
              text="התנתקות מהחשבון"
              onPress={handleLogout}
            />
            <MenuButton
              icon="trash-outline"
              text="מחק פרופיל"
              variant="danger"
              onPress={() => router.push(basePath + '/deleteProfile')}
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
