import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import CategorySelect from '../categories/categorySelect';
import Button from '../common/button';
import BusinessSelect from './businessSelect';

export default function RenameBusiness({ goBack, refId, error, success, renameBusiness }) {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBusiness, setSelectedBusiness] = useState("");
    const [newName, setNewName] = useState("");

    const handleSubmit = () => {
        renameBusiness(refId, selectedCategory, selectedBusiness, newName);
    };

    return (
        <View className="p-4 bg-white rounded-lg w-full">
            <Text className="text-xl font-semibold text-center text-gray-800 mb-4">
                שנה בעל עסק
            </Text>

            {error && (
                <View className="bg-red-100 border border-red-400 rounded-md py-2 px-4 mb-4">
                    <Text className="text-sm text-center text-red-600">{error}</Text>
                </View>
            )}

            {success && (
                <View className="bg-green-100 border border-green-400 rounded-md py-2 px-4 mb-4">
                    <Text className="text-sm text-center text-green-600">{success}</Text>
                </View>
            )}

            <Text className="text-sm font-medium text-gray-700 mb-1">בחר קטגוריה</Text>
            <CategorySelect
                refId={refId}
                setSelectedCategory={setSelectedCategory}
                initialValue={selectedCategory}
            />

            {selectedCategory && (
                <>
                    <Text className="text-sm font-medium text-gray-700 mb-1 mt-4">בחר עסק</Text>
                    <BusinessSelect
                        refId={refId}
                        category={selectedCategory}
                        setSelectedBusiness={setSelectedBusiness}
                        initialValue={selectedBusiness}
                    />
                </>
            )}

            {selectedBusiness && (
                <>
                    <Text className="text-sm font-medium text-gray-700 mb-1 mt-4">שם עסק חדש</Text>
                    <TextInput
                        value={newName}
                        onChangeText={setNewName}
                        placeholder="שם עסק חדש"
                        className="w-full px-4 py-3 mb-4 text-right border border-gray-300 rounded-md"
                        style={{ textAlign: 'right' }}
                    />

                    <View className="mt-2">
                        <Button
                            onPress={handleSubmit}
                            style="primary"
                            disabled={!newName.trim()}
                        >
                            שנה שם
                        </Button>
                    </View>
                </>
            )}

            <View className="mt-4">
                <Button
                    onPress={goBack}
                    style="secondary"
                    textClass="text-gray-700 font-medium"
                >
                    ביטול
                </Button>
            </View>
        </View>
    );
}