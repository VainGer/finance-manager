import { useState } from 'react';
import { Text, View } from 'react-native';
import CategorySelect from '../categories/categorySelect';
import Button from '../common/button';
import BusinessSelect from './businessSelect';

export default function DeleteBusiness({ goBack, refId, error, success, deleteBusiness }) {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBusiness, setSelectedBusiness] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = () => {
        if (!selectedBusiness) return;
        deleteBusiness(refId, selectedCategory, selectedBusiness);
    };

    // If success message is present, show only that
    if (success) {
        return (
            <View className="p-4 bg-white rounded-lg w-3/4">
                <View className="bg-green-100 border border-green-400 rounded-md py-4 px-4 mb-4">
                    <Text className="text-sm text-center text-green-600 font-medium">{success}</Text>
                </View>
                <Button
                    onPress={goBack}
                    style="primary"
                    textClass="text-white font-medium"
                >
                    חזרה לתפריט
                </Button>
            </View>
        );
    }

    return (
        <View className="p-4 bg-white rounded-lg w-3/4">
            <Text className="text-xl font-semibold text-center text-gray-800 mb-4">
                מחיקת עסק
            </Text>
            
            {error && (
                <View className="bg-red-100 border border-red-400 rounded-md py-2 px-4 mb-4">
                    <Text className="text-sm text-center text-red-600">{error}</Text>
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
            
            {selectedBusiness && !showConfirm && (
                <View className="mt-4">
                    <Button
                        onPress={() => setShowConfirm(true)}
                        style="custom"
                        bg="#dc2626" // Red-600
                        textClass="text-white font-medium"
                    >
                        המשך למחיקה
                    </Button>
                </View>
            )}
            
            {selectedBusiness && showConfirm && (
                <View className="mt-4">
                    <View className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                        <Text className="text-center text-red-700 mb-2">
                            האם אתה בטוח שברצונך למחוק את העסק "{selectedBusiness}"?
                        </Text>
                        <Text className="text-center text-red-700 text-sm">
                            פעולה זו אינה ניתנת לביטול.
                        </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                        <View className="flex-1 mr-2">
                            <Button
                                onPress={() => setShowConfirm(false)}
                                style="secondary"
                                textClass="text-gray-700 font-medium"
                            >
                                ביטול
                            </Button>
                        </View>
                        <View className="flex-1 ml-2">
                            <Button
                                onPress={handleDelete}
                                style="custom"
                                bg="#dc2626" // Red-600
                                textClass="text-white font-medium"
                            >
                                כן, מחק עסק
                            </Button>
                        </View>
                    </View>
                </View>
            )}
            
            {!showConfirm && (
                <View className="mt-4">
                    <Button
                        onPress={goBack}
                        style="secondary"
                        textClass="text-gray-700 font-medium"
                    >
                        ביטול
                    </Button>
                </View>
            )}
        </View>
    );
}