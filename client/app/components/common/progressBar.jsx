import { I18nManager, View } from 'react-native';

export default function ProgressBar({ progress, color, height = 8 }) {
    const safeProgress = Math.max(0, Math.min(100, progress || 0));

    // Ensure the progress bar is always at least 5% wide for visual purposes
    // This makes very small percentages still visible to the user
    const displayWidth = safeProgress < 1 ? 1 : safeProgress;

    return (
        <View className="bg-slate-200 rounded-full overflow-hidden" style={{ height }}>
            <View className={`${color} h-full rounded-full`}
                style={{ 
                    width: `${displayWidth}%`, 
                    alignSelf: I18nManager.isRTL ? 'flex-end' : 'flex-start',
                    // Add subtle shadow inside the progress bar for a more polished look
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 1,
                    elevation: 1,
                }} 
            />
        </View>
    );
}