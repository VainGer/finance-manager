import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import CreateProfileBudget from '../../components/budgets/createProfileBudget.jsx';
import CreateChildrenBudget from '../../components/budgets/createChildrenBudget.jsx';
import Button from '../../components/common/button.jsx';
import LoadingSpinner from '../../components/common/loadingSpinner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';


export default function BudgetsMenu() {
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [loading, setLoading] = useState(false);
    const { profile } = useAuth();
    const renderSelectedMenu = () => {
        switch (selectedMenu) {
            case 'createProfileBudget':
                return <CreateProfileBudget setLoading={setLoading} goBack={() => setSelectedMenu(null)} />;
            case 'createChildrenBudget':
                return <CreateChildrenBudget setLoading={setLoading} goBack={() => setSelectedMenu(null)} />;
            default:
                return null;
        }
    };

    return (
        <LinearGradient
            colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {loading && (
                    <View className="absolute inset-0 bg-black/5 items-center justify-center z-10">
                        <LoadingSpinner />
                    </View>
                )}

                {!selectedMenu && (
                    <View className="flex-1 items-center justify-center py-10 px-6">
                        {/* Title */}
                        <View className="items-center mb-10">
                            <Text className="text-2xl font-bold text-slate-800">ניהול תקציבים</Text>
                            <View className="h-1 w-12 bg-blue-500 rounded-full mt-2" />
                        </View>

                        {/* Budget icon */}
                        <View className="items-center mb-8">
                            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-2">
                                <Ionicons name="wallet-outline" size={36} color="#3b82f6" />
                            </View>
                        </View>

                        {/* Menu options */}
                        <View className="w-full max-w-sm">
                            <Button
                                className="mb-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                                onPress={() => setSelectedMenu('createProfileBudget')}
                            >
                                <View className="flex-row items-center justify-center">
                                    <Ionicons name="add-circle-outline" size={20} color="#3b82f6" className="ml-2" />
                                    <Text className="text-slate-800 font-bold">יצירת תקציב פרופיל</Text>
                                </View>
                            </Button>


                            {profile.parentProfile && profile.children.length > 0 && (
                                <Button
                                    className="py-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                                    onPress={() => setSelectedMenu('createChildrenBudget')}
                                >
                                    <View className="flex-row items-center justify-center">
                                        <Ionicons name="add-circle-outline" size={20} color="#3b82f6" className="ml-2" />
                                        <Text className="text-slate-800 font-bold">יצירת תקציב לילד</Text>
                                    </View>
                                </Button>
                            )}

                            <Button
                                className="py-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                                onPress={() => setSelectedMenu('deleteBudget')}
                            >
                                <View className="flex-row items-center justify-center">
                                    <Ionicons name="trash-outline" size={20} color="#ef4444" className="ml-2" />
                                    <Text className="text-slate-800 font-bold">מחיקת תקציב</Text>
                                </View>
                            </Button>
                        </View>
                    </View>
                )}

                {selectedMenu && (
                    <View className="flex-1 content-center justify-center py-6 px-4">
                        <View className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                            {renderSelectedMenu()}
                        </View>
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    )
}