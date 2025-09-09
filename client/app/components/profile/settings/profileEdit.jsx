import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import useProfileSettings from '../../../hooks/useProfileSettings';
import { pickImage } from '../../../utils/imageProcessing';
import Button from '../../common/button';
import ColorPicker from '../../common/colorPicker';
import InfoCard from '../../common/infoCard';
import LoadingSpinner from '../../common/loadingSpinner';
import Overlay from '../../common/Overlay';

export default function profileEdit({ profile, setLoading, goBack }) {
    const [editing, setEditing] = useState(false);

    const [newColor, setNewColor] = useState(profile.color);
    const [newProfileName, setNewProfileName] = useState(profile.profileName);
    const [newAvatar, setNewAvatar] = useState(null);
    const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);
    const [newPin, setNewPin] = useState("");
    const [confirmNewPin, setConfirmNewPin] = useState("");
    const [oldPin, setOldPin] = useState("");

    const { loading, error, success, renameProfile, changePin, changeProfileColor, changeAvatar, removeAvatar, updateProfile, resetMessages } = useProfileSettings({ initialProfile: profile, setLoading });

    useEffect(() => {
        if (error) Alert.alert('שגיאה', error);
        if (success) Alert.alert('הצלחה', success);
    }, [error, success]);

    const handleSave = async () => {
        resetMessages();
        let hasChanges = false;
        let currentProfileName = profile.profileName;

        if (newProfileName.trim() !== profile.profileName) {
            const result = await renameProfile(newProfileName.trim());
            if (result.ok) {
                currentProfileName = result.newProfileName;
            }
            hasChanges = true;
        }
        if (newColor !== profile.color) {
            await changeProfileColor(newColor, currentProfileName);
            hasChanges = true;
        }
        if (newAvatar) {
            await changeAvatar(newAvatar, currentProfileName);
            hasChanges = true;
        } else if (shouldRemoveAvatar) {
            await removeAvatar(currentProfileName);
            hasChanges = true;
        }
        if (oldPin && newPin && confirmNewPin) {
            await changePin(oldPin, newPin, confirmNewPin, currentProfileName);
            hasChanges = true;
        }

        if (hasChanges) {
            setEditing(false);
            setTimeout(() => updateProfile(currentProfileName), 1000);
        } else {
            Alert.alert('אין שינויים', 'לא בוצעו שינויים לשמירה.');
            setEditing(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        setNewProfileName(profile.profileName);
        setNewColor(profile.color);
        setNewAvatar(null);
        setShouldRemoveAvatar(false);
        setOldPin("");
        setNewPin("");
        setConfirmNewPin("");
        resetMessages();
    };

    const handlePickImage = async () => {
        const image = await pickImage(err => Alert.alert('שגיאה בבחירת תמונה', err));
        if (image) {
            setNewAvatar(image);
        }
    };

    return (
        <ScrollView className="w-full h-max">
            <View className="bg-slate-700 p-4 rounded-lg m-4">
                <Text className="text-white text-2xl font-bold text-center">פרטי פרופיל</Text>
                <Text className="text-white text-center mt-2">נהל את פרטי הפרויל האישי שלך</Text>
            </View>
            <View>
                {loading && (
                    <Overlay>
                        <LoadingSpinner />
                    </Overlay>
                )}
                <View className="w-full p-4 mx-auto">
                    <InfoCard header="שם פרופיל" bg={editing ? "white" : "blue"}>
                        <View className="mx-2">
                            {editing ?
                                (<TextInput className="text-lg" onChangeText={setNewProfileName} value={newProfileName} />)
                                : <Text className="text-lg font-bold">{profile.profileName}</Text>
                            }
                        </View>
                    </InfoCard>
                    <InfoCard header="פרופיל הורה" bg="green">
                        <Text className="mx-2 text-lg font-bold">{profile.parentProfile ? "פרופיל הורה" : "פרופיל ילד"}</Text>
                    </InfoCard>
                    <InfoCard header="צבע פרופיל" bg={editing ? "white" : "indigo"}>
                        <View className="flex-row items-center">
                            {editing ?
                                (<ColorPicker setColor={setNewColor} />)
                                :
                                (<>
                                    <View className="w-8 h-8 mx-2 border-2 border-white rounded-lg"
                                        style={{ backgroundColor: profile.color ? profile.color : "#0066FF" }}></View>
                                    <Text>צבע פרופיל מותאם אישית</Text>
                                </>)
                            }
                        </View>
                    </InfoCard>
                    <InfoCard header="תמונת פרופיל" bg={editing ? "white" : "pink"}>
                        <Image
                            className="w-12 h-12 rounded-full border-2 my-2 border-slate-500 mx-auto"
                            source={newAvatar ? { uri: newAvatar.assets[0].uri } : (profile.avatar ? { uri: profile.avatar } : require('../../../assets/images/avatar_default.png'))}
                        />
                        {editing ? (<>
                            <Button onPress={handlePickImage}>
                                {newAvatar ? newAvatar.assets[0].fileName : "בחר תמונה חדשה"}
                            </Button>
                            <View className="flex-row items-center justify-start mt-2">
                                <Switch value={shouldRemoveAvatar} onValueChange={setShouldRemoveAvatar} />
                                <Text>להסיר תמונה</Text>
                            </View>
                        </>) : (
                            <>
                            </>
                        )}

                    </InfoCard>
                    <InfoCard header="קוד פרופיל" bg={editing ? "white" : "yellow"}>
                        {editing ? (<>
                            <TextInput className="border shadow-lg shadow-black bg-white rounded-lg p-2 mt-2 h-12 text-center"
                                placeholder="קוד סודי נוכחי"
                                secureTextEntry={true}
                                value={oldPin}
                                onChangeText={setOldPin}
                            />
                            <TextInput className="border shadow-lg shadow-black bg-white rounded-lg p-2 mb-2 mt-2 h-12 text-center"
                                placeholder="קוד סודי חדש"
                                secureTextEntry={true}
                                value={newPin}
                                onChangeText={setNewPin} />
                            <TextInput className="border shadow-lg shadow-black bg-white rounded-lg mb-2 h-12 text-center"
                                placeholder="אישור קוד סודי חדש"
                                secureTextEntry={true}
                                value={confirmNewPin}
                                onChangeText={setConfirmNewPin}
                            />
                        </>
                        ) : (<>
                            <Text className="text-lg font-bold">********</Text>
                        </>)}
                    </InfoCard>
                </View>
            </View>
            <View className="w-3/4 mx-auto mt-4">
                {editing ? (
                    <>
                        <Button className='bg-slate-700' onPress={handleSave}>שמור שינויים</Button>
                        <Button className='bg-slate-500' onPress={handleCancel}>ביטול</Button>
                    </>
                ) : (<>
                    <Button onPress={() => setEditing(true)} className='bg-slate-700'>ערוך פרטים</Button>
                    <Button className='bg-slate-500' onPress={goBack}>חזרה להגדרות</Button>
                </>
                )
                }
            </View >
        </ScrollView >
    )
}