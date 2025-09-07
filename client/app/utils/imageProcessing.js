import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export const pickImage = async (setError) => {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'image/*',
            copyToCacheDirectory: true,
        });
        if (result.assets && result.assets.length > 0) {
            return (result.assets[0]);
        } else if (result.type === 'success') {
            return result;
        }
    } catch (err) {
        console.error('Error picking document:', err);
        setError('שגיאה בטעינת התמונה');
    }
};

export const prepareImage = async (uri) => {
    try {
        const resizedImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 500 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        const base64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
            encoding: FileSystem.EncodingType.Base64
        });

        return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
        console.error('Image preparation error:', error);
        throw error;
    }
};