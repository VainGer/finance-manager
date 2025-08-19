import { I18nManager, View } from 'react-native';

export default function ProgressBar({ progress, color }) {
    const safeProgress = Math.max(0, Math.min(100, progress || 0));

    return (
        <View className="bg-gray-200 rounded-full h-4 w-full overflow-hidden">
            <View className={`${color} h-full`}
                style={{ width: `${safeProgress}%`, alignSelf: I18nManager.isRTL ? 'flex-end' : 'flex-start' }} />
        </View>
    );
}