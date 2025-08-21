import { useEffect, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import Button from '../common/button';
import CategorySelect from './categorySelect';

export default function RenameCategory({ goBack, refId, renameCategory, error, success }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleRename = () => {
        renameCategory(selectedCategory, newCategoryName, setNewCategoryName, setSelectedCategory);
    };

    return (
        <View className="w-3/4 flex-1 justify-center items-center">
            <Text>שינוי שם קטגוריה</Text>
            {error && <Text className='text-red-500'>שגיאה: {error}</Text>}
            {success && <Text className='text-green-500'>הקטגוריה שונתה בהצלחה</Text>}
            <CategorySelect refId={refId} setSelectedCategory={setSelectedCategory} />
            <TextInput className='border-gray-400 border p-2 w-full mb-4 bg-white' placeholder='שם קטגוריה חדש'
                value={newCategoryName} onChangeText={setNewCategoryName} />
            <Button textClass='font-bold text-white'
                onPress={handleRename}>שנה שם קטגוריה</Button>
            <Button className='bg-gray-400' textClass="text-black font-bold"
                onPress={goBack}>חזרה</Button>
        </View>
    );
}
