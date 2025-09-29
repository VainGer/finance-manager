import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Text, View } from 'react-native';

export default function LoadingScreen({ message = 'טוען...' }) {
  return (
    <LinearGradient
      colors={['#f8fafc', '#eef2f7', '#e5eaf1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20
      }}
    >
      <View className="bg-white rounded-xl shadow-md p-6 items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-slate-700 font-medium mt-4 text-base text-center">
          {message}
        </Text>
      </View>
    </LinearGradient>
  );
}