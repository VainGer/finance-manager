import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import CreateCategory from '../../components/categories/createCategory.jsx';
import DeleteCategory from '../../components/categories/deleteCategory.jsx';
import RenameCategory from '../../components/categories/renameCategory.jsx';
import Button from '../../components/common/button.jsx';
import LoadingSpinner from '../../components/common/loadingSpinner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import useEditCategories from '../../hooks/useEditCategories.js';


export default function CategoryMenu() {

    const [selectedMenu, setSelectedMenu] = useState(null);
    const [categories, setCategories] = useState([]);
    const { profile } = useAuth();

    const { error, success, loading, categoriesLoading, categoriesError, categories: hookCategories,
        addCategory, renameCategory, deleteCategory, resetState, fetchCategories } = useEditCategories({ 
            profile, 
            goBack: () => setSelectedMenu(null) 
        });

    useEffect(() => {
        resetState();
    }, [selectedMenu]);

    useEffect(() => {
        if (hookCategories?.length > 0) {
            setCategories(hookCategories);
        }
    }, [hookCategories]);

    useEffect(() => {
        fetchCategories();
    }, [profile, error, success]);



    const renderSelectedMenu = () => {
        switch (selectedMenu) {
            case 'create':
                return <CreateCategory goBack={() => setSelectedMenu(null)}
                    error={error} success={success} addCategory={addCategory} />;
            case 'rename':
                return <RenameCategory goBack={() => setSelectedMenu(null)}
                    refId={profile.expenses} error={error} success={success} categories={categories} 
                    getCategoriesLoading={categoriesLoading} getCategoriesError={categoriesError}
                    renameCategory={renameCategory} />;
            case 'delete':
                return <DeleteCategory goBack={() => setSelectedMenu(null)} 
                    categories={categories} getCategoriesError={categoriesError} getCategoriesLoading={categoriesLoading}
                    refId={profile.expenses} error={error} deleteCategory={deleteCategory} success={success} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (selectedMenu) {
            renderSelectedMenu();
        }
    }, [selectedMenu]);

    return (
        <LinearGradient
            colors={["#f8fafc", "#eef2f7", "#e5eaf1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {(loading || categoriesLoading) && (
                    <View className="absolute inset-0 bg-black/5 items-center justify-center z-10">
                        <LoadingSpinner />
                    </View>
                )}

                {!selectedMenu && (
                    <View className="flex-1 items-center justify-center py-10 px-6">
                        {/* Title */}
                        <View className="items-center mb-10">
                            <Text className="text-2xl font-bold text-slate-800">ניהול קטגוריות</Text>
                            <View className="h-1 w-12 bg-green-500 rounded-full mt-2" />
                        </View>

                        {/* Category icon */}
                        <View className="items-center mb-8">
                            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-2">
                                <Ionicons name="pricetags-outline" size={36} color="#10b981" />
                            </View>
                        </View>

                        {/* Menu options */}
                        <View className="w-full max-w-sm">
                            <Button
                                className="mb-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                                textClass="text-slate-800 font-bold"
                                onPress={() => setSelectedMenu('create')}
                            >
                                <View className="flex-row items-center justify-center">
                                    <Ionicons name="add-circle-outline" size={20} color="#10b981" className="ml-2" />
                                    <Text className="text-slate-800 font-bold">הוספת קטגוריה</Text>
                                </View>
                            </Button>

                            <Button
                                className="mb-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                                textClass="text-slate-800 font-bold"
                                onPress={() => setSelectedMenu('rename')}
                            >
                                <View className="flex-row items-center justify-center">
                                    <Ionicons name="create-outline" size={20} color="#10b981" className="ml-2" />
                                    <Text className="text-slate-800 font-bold">שינוי שם קטגוריה</Text>
                                </View>
                            </Button>

                            <Button
                                className="py-4 bg-white border border-slate-200 rounded-xl shadow-sm"
                                textClass="text-slate-800 font-bold"
                                onPress={() => setSelectedMenu('delete')}
                            >
                                <View className="flex-row items-center justify-center">
                                    <Ionicons name="trash-outline" size={20} color="#ef4444" className="ml-2" />
                                    <Text className="text-slate-800 font-bold">מחיקת קטגוריה</Text>
                                </View>
                            </Button>
                        </View>
                    </View>
                )}

                {selectedMenu && (
                    <View className="flex-1 py-6 px-4">
                        {renderSelectedMenu()}
                    </View>
                )}
            </ScrollView>
        </LinearGradient>
    );
}