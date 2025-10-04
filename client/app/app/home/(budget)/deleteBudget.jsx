import { View } from "react-native";

export default function DeleteBudgetScreen() {
    return (
        <View>
            <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
            <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
            <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />
        </View>
    );
}