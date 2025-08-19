import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { post } from '../../utils/api';

const prepareImage = async (uri) => {
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

export default function useCreateProfile({ username, profileName, pin, avatar, color, firstProfile, parentProfile }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const createProfile = async () => {
        setLoading(true);
        if (!profileName || !pin || profileName.trim() === '' || pin.trim() === '') {
            setError('Profile name and PIN are required.');
            setLoading(false);
            return;
        }
        setError(null);
        let avatarBase64 = null;
        if (avatar) {
            try {
                const uri = avatar.assets ? avatar.assets[0].uri : avatar.uri;
                if (!uri) {
                    throw new Error('Invalid avatar format');
                }
                avatarBase64 = await prepareImage(uri);
            } catch (error) {
                console.error('Base64 conversion error:', error);
                setError('שגיאה בטעינת התמונה');
                setLoading(false);
                return;
            }
        }
        const parent = firstProfile ? true : parentProfile;
        const newProfile = {
            username,
            profileName,
            pin,
            avatar: avatar ? avatarBase64 : null,
            color,
            parentProfile: parent
        }

        const uri = parent ? "create-profile" : "create-child-profile";

        const response = await post(`profile/${uri}`, newProfile);
        if (response.ok) {
            setLoading(true);
            router.replace('/authProfile');
        } else {
            switch (response.status) {
                case 409:
                    setError('פרופיל קיים כבר');
                    break;
                case 500:
                    setError('שגיאה בשרת, נסה שוב מאוחר יותר');
                    break;
            }
        }
        setLoading(false);
    };
    
    return { loading, error, createProfile, setError };
}
