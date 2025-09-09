import { Text, View } from 'react-native';

export default function InfoCard({ children, header, bg }) {
    const colorVariants = {
        indigo: 'bg-indigo-100 border-indigo-400',
        green: 'bg-green-100 border-green-400',
        red: 'bg-red-100 border-red-400',
        yellow: 'bg-yellow-100 border-yellow-400',
        blue: 'bg-blue-100 border-blue-400',
        pink: 'bg-pink-100 border-pink-400',
        gray: 'bg-gray-100 border-gray-400',
        white: 'bg-white'
    };

    const cardStyle = colorVariants[bg] || 'bg-gray-100 border-gray-400';

    return (
        <View className="flex w-full mx-auto my-4 bg-white p-4 rounded-lg shadow-lg shadow-black">
            <Text className="text-lg font-bold mb-2">{header}</Text>
            <View className={`${cardStyle} border rounded-lg p-2 w-full`}>
                {children}
            </View>
        </View>
    )
}