import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import CreateBusiness from '../../components/business/createBusiness.jsx';
import DeleteBusiness from '../../components/business/deleteBusiness.jsx';
import RenameBusiness from '../../components/business/renameBusiness.jsx';
import Button from '../../components/common/button.jsx';
import LoadingSpinner from '../../components/common/loadingSpinner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import useEditBusiness from '../../hooks/useEditBusiness.js';

export default function BusinessMenu() {
    const [selectedMenu, setSelectedMenu] = useState(null);
    const { profile } = useAuth();

    const { error, success, loading,
        addBusiness, renameBusiness, deleteBusiness, resetState } = useEditBusiness({ profile, goBack: () => setSelectedMenu(null) });

    useEffect(() => {
        resetState();
    }, [selectedMenu]);

    const renderSelectedMenu = () => {
        switch (selectedMenu) {
            case 'create':
                return <CreateBusiness
                    goBack={() => setSelectedMenu(null)}
                    refId={profile.expenses}
                    error={error}
                    success={success}
                    addBusiness={addBusiness}
                />;
            case 'rename':
                return <RenameBusiness
                    goBack={() => setSelectedMenu(null)}
                    refId={profile.expenses}
                    error={error}
                    success={success}
                    renameBusiness={renameBusiness}
                />;
            case 'delete':
                return <DeleteBusiness
                    goBack={() => setSelectedMenu(null)}
                    refId={profile.expenses}
                    error={error}
                    success={success}
                    deleteBusiness={deleteBusiness}
                />;
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

            {!selectedMenu && (
                <View className="flex-1 items-center justify-center w-3/4">
                    <Text className='font-bold text-lg mb-8 text-center'>ניהול עסקים</Text>

                    <Button
                        className='bg-gray-300 mb-4'
                        textClass="text-black font-bold"
                        onPress={() => setSelectedMenu('create')}
                    >
                        הוספת עסק
                    </Button>

                    <Button
                        className='bg-gray-300 mb-4'
                        textClass="text-black font-bold"
                        onPress={() => setSelectedMenu('rename')}
                    >
                        שינוי שם עסק
                    </Button>

                    <Button
                        className='bg-gray-300'
                        textClass="text-black font-bold"
                        onPress={() => setSelectedMenu('delete')}
                    >
                        מחיקת עסק
                    </Button>
                </View>
            )}

            {selectedMenu && renderSelectedMenu()}
        </View>
    );
}