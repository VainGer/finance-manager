import { useState, useEffect } from 'react'
import { View, Text, TextInput } from 'react-native';
import CategorySelect from '../../components/categories/categorySelect.jsx';
import Button from '../../components/common/button.jsx';

export default function CreateBusiness({ goBack, refId, error, success, addBusiness }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState(null);

    const handleSubmit = () => {
        addBusiness(refId, category, name, setName);
    };

    return (
        <View className="w-3/4">
            <Text>Create Business</Text>
            {error && <Text>{error}</Text>}
            {success && <Text>{success}</Text>}
            <CategorySelect refId={refId} setSelectedCategory={setCategory} />
            <TextInput placeholder="שם בעל עסק" value={name} onChangeText={setName}
                className="border p-2 rounded bg-white mb-4" />
            <Button onPress={handleSubmit}>הוסף בעל עסק</Button>
            <Button onPress={goBack} className="mt-4">חזרה</Button>
        </View>
    )
}