import { I18nManager, View } from 'react-native';

export default function ProgressBar({ progress, color, height = 8 }) {
    // Ensure progress is a valid number between 0-100
    const safeProgress = Math.max(0, Math.min(100, parseFloat(progress) || 0));
    
    // Ensure the progress bar is always at least 1% wide for visual purposes when not zero
    const displayWidth = safeProgress === 0 ? 0 : Math.max(1, safeProgress);
    
    // For RTL layouts, we need to reverse the direction of the progress bar
    const barStyles = I18nManager.isRTL
        ? { right: 0, width: `${displayWidth}%` }
        : { left: 0, width: `${displayWidth}%` };
        
    return (
        <View className="bg-slate-200 rounded-full overflow-hidden" style={{ height }}>
            <View 
                className={`${color} absolute rounded-full`} 
                style={{ 
                    ...barStyles,
                    height: '100%',
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