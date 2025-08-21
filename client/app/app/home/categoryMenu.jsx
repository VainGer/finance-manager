import { useState, useEffect } from 'react'
import { View, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext.jsx';
import useEditCategories from '../../hooks/useEditCategories.js';
import Button from '../../components/common/button.jsx';
import LoadingSpinner from '../../components/common/loadingSpinner.jsx';
import CreateCategory from '../../components/categories/createCategory.jsx';
import DeleteCategory from '../../components/categories/deleteCategory.jsx';
import RenameCategory from '../../components/categories/renameCategory.jsx';


export default function CategoryMenu() {
    const [selectedMenu, setSelectedMenu] = useState(null);
    const { profile } = useAuth();

    const { error, success, loading,
        addCategory, renameCategory, deleteCategory, resetState } = useEditCategories({ profile, goBack: () => setSelectedMenu(null) });

    useEffect(() => {
        resetState();
    }, [selectedMenu]);

    const renderSelectedMenu = () => {
        switch (selectedMenu) {
            case 'create':
                return <CreateCategory goBack={() => setSelectedMenu(null)}
                    error={error} success={success} addCategory={addCategory} />;
            case 'rename':
                return <RenameCategory goBack={() => setSelectedMenu(null)}
                    refId={profile.expenses} error={error} success={success}
                    renameCategory={renameCategory} />;
            case 'delete':
                return <DeleteCategory goBack={() => setSelectedMenu(null)}
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
        <View className="flex-1 items-center justify-center">
            {loading && <LoadingSpinner />}
            {!selectedMenu && <View className="flex-1 items-center justify-center w-3/5">
                <Text className='font-bold text-lg mb-8 text-center'>ניהול קטגוריות</Text>
                <Button className='bg-gray-300' textClass="text-black font-bold"
                    onPress={() => setSelectedMenu('create')}>הוספת קטגוריה</Button>
                <Button className='bg-gray-300' textClass="text-black font-bold"
                    onPress={() => setSelectedMenu('rename')}>שינוי שם קטגוריה</Button>
                <Button className='bg-gray-300' textClass="text-black font-bold"
                    onPress={() => setSelectedMenu('delete')}>מחיקת קטגוריה</Button>
            </View>}
            {selectedMenu && renderSelectedMenu()}
        </View>
    );
}