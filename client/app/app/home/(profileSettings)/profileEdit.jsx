import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Switch, Text, TextInput, View } from "react-native";
import Button from "../../../components/common/button";
import ColorPicker from "../../../components/common/colorPicker";
import InfoCard from "../../../components/common/infoCard";
import LoadingSpinner from "../../../components/common/loadingSpinner";
import OverlayMessages from "../../../components/common/overlayMessages";
import { useAuth } from "../../../context/AuthContext";
import useProfileSettings from "../../../hooks/useProfileSettings";
import { pickImage } from "../../../utils/imageProcessing";

export default function ProfileEdit() {
    const { profile, setProfile } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newColor, setNewColor] = useState(profile.color);
    const [newProfileName, setNewProfileName] = useState(profile.profileName);
    const [newAvatar, setNewAvatar] = useState(null);
    const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);
    const [newPin, setNewPin] = useState("");
    const [confirmNewPin, setConfirmNewPin] = useState("");
    const [oldPin, setOldPin] = useState("");
    const [showOverlay, setShowOverlay] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const {
        resetFormStates,
        resetMessages,
        renameProfile,
        changePin,
        changeProfileColor,
        changeAvatar,
        removeAvatar,
        errors,
        successes,
    } = useProfileSettings({ setLoading, setProfile });

    const handlePickImage = async () => {
        const image = await pickImage((err) => console.error(err));
        if (image) {
            setNewAvatar(image);
            setShouldRemoveAvatar(false);
        }
    };

    const handleCloseOverlay = () => {
        setShowOverlay(false);
        resetMessages();
        resetFormStates(
            setNewColor,
            setNewProfileName,
            setNewAvatar,
            setShouldRemoveAvatar,
            setNewPin,
            setConfirmNewPin,
            setOldPin
        );
        setEditing(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        resetMessages();
        if (newAvatar) await changeAvatar(newAvatar);
        if (shouldRemoveAvatar) await removeAvatar();
        if (newColor !== profile.color) await changeProfileColor(newColor);
        if (oldPin || newPin || confirmNewPin) await changePin(oldPin, newPin, confirmNewPin);
        if (newProfileName !== profile.profileName) await renameProfile(newProfileName);
        setIsSaving(false);
        setShowOverlay(true);
    };

    const handleCancel = () => {
        resetFormStates(
            setNewColor,
            setNewProfileName,
            setNewAvatar,
            setShouldRemoveAvatar,
            setNewPin,
            setConfirmNewPin,
            setOldPin
        );
        setEditing(false);
    };

    useEffect(() => {
        if (!isSaving && (errors.length > 0 || successes.length > 0)) {
            setShowOverlay(true);
        }
    }, [isSaving, errors, successes]);

    if (showOverlay) {
        return (
            <OverlayMessages
                errors={errors}
                successes={successes}
                onClose={handleCloseOverlay}
            />
        );
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <ScrollView
            className="w-full h-max"
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="always"
        >
            {/* Background decorations */}
            <View pointerEvents="none" className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-300/20" />
            <View pointerEvents="none" className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-emerald-300/20" />
            <View pointerEvents="none" className="absolute top-1/3 right-10 h-24 w-24 rounded-full bg-white/20 blur-md" />

            {/* Header */}
            <View className="bg-slate-700 p-4 rounded-lg m-4">
                <Text className="text-white text-2xl font-bold text-center">
                    פרטי פרופיל
                </Text>
                <Text className="text-white text-center mt-2">
                    נהל את פרטי הפרופיל האישי שלך
                </Text>
            </View>

            {editing ? (
                <EditFields
                    profile={profile}
                    newProfileName={newProfileName}
                    setNewProfileName={setNewProfileName}
                    newColor={newColor}
                    setNewColor={setNewColor}
                    newAvatar={newAvatar}
                    shouldRemoveAvatar={shouldRemoveAvatar}
                    setShouldRemoveAvatar={setShouldRemoveAvatar}
                    handlePickImage={handlePickImage}
                    oldPin={oldPin}
                    setOldPin={setOldPin}
                    newPin={newPin}
                    setNewPin={setNewPin}
                    confirmNewPin={confirmNewPin}
                    setConfirmNewPin={setConfirmNewPin}
                    handleSave={handleSave}
                    handleCancel={handleCancel}
                    setNewAvatar={setNewAvatar}
                />
            ) : (
                <DisplayFields
                    profile={profile}
                    setEditing={setEditing}
                    router={router}
                />
            )}
        </ScrollView>
    );
}

function DisplayFields({ profile, setEditing, router }) {
    return (
        <View className="w-full p-4 mx-auto">
            <InfoCard header="שם פרופיל" bg="blue">
                <Text className="text-lg font-bold mx-2">{profile.profileName}</Text>
            </InfoCard>

            <InfoCard header="פרופיל הורה" bg="green">
                <Text className="mx-2 text-lg font-bold">
                    {profile.parentProfile ? "פרופיל הורה" : "פרופיל ילד"}
                </Text>
            </InfoCard>

            <InfoCard header="צבע פרופיל" bg="indigo">
                <View className="flex-row items-center">
                    <View
                        className="w-8 h-8 mx-2 border-2 border-white rounded-lg"
                        style={{ backgroundColor: profile.color || "#0066FF" }}
                    />
                    <Text>צבע פרופיל מותאם אישית</Text>
                </View>
            </InfoCard>

            <InfoCard header="תמונת פרופיל" bg="pink">
                <Image
                    className="w-20 h-20 rounded-full border-2 my-2 border-slate-500 mx-auto"
                    source={
                        profile.avatar
                            ? { uri: profile.avatar }
                            : require("../../../assets/images/avatar_default.png")
                    }
                />
            </InfoCard>

            <InfoCard header="קוד פרופיל" bg="yellow">
                <Text className="text-lg font-bold">********</Text>
            </InfoCard>

            <View className="w-3/4 mx-auto mt-4">
                <Button onPress={() => setEditing(true)} className="bg-slate-700">
                    ערוך פרטים
                </Button>
                <Button className="bg-slate-500" onPress={() => router.back()}>
                    חזרה
                </Button>
            </View>
        </View>
    );
}


function EditFields({
    profile,
    newProfileName,
    setNewProfileName,
    newColor,
    setNewColor,
    newAvatar,
    shouldRemoveAvatar,
    setShouldRemoveAvatar,
    handlePickImage,
    oldPin,
    setOldPin,
    newPin,
    setNewPin,
    confirmNewPin,
    setConfirmNewPin,
    handleSave,
    handleCancel,
    setNewAvatar
}) {
    return (
        <View className="w-full p-4 mx-auto">
            <InfoCard header="שם פרופיל" bg="white">
                <TextInput
                    className="text-lg border-b border-gray-300"
                    onChangeText={setNewProfileName}
                    value={newProfileName}
                />
            </InfoCard>

            <InfoCard header="צבע פרופיל" bg="white">
                <ColorPicker setColor={setNewColor} initialColor={newColor} />
            </InfoCard>

            <InfoCard header="תמונת פרופיל" bg="white">
                <Image
                    className="w-20 h-20 rounded-full border-2 my-2 border-slate-500 mx-auto"
                    source={
                        newAvatar
                            ? { uri: newAvatar.uri }
                            : profile.avatar
                                ? { uri: profile.avatar }
                                : require("../../../assets/images/avatar_default.png")
                    }
                />
                <View className="w-3/4 mx-auto">
                    <Button onPress={handlePickImage} disabled={shouldRemoveAvatar}>
                        {newAvatar ? newAvatar.name : "בחר תמונה חדשה"}
                    </Button>
                </View>
                <View className="flex-row items-center justify-start mt-2 mx-auto">
                    <Switch
                        value={shouldRemoveAvatar}
                        onValueChange={(value) => {
                            setShouldRemoveAvatar(value);
                            if (value) setNewAvatar(null);
                        }}
                    />
                    <Text>להסיר תמונה</Text>
                </View>
            </InfoCard>

            <InfoCard header="קוד פרופיל" bg="white">
                <TextInput
                    className="border shadow-lg bg-white rounded-lg p-2 mt-2 h-12 text-center"
                    placeholder="קוד סודי נוכחי"
                    secureTextEntry
                    value={oldPin}
                    onChangeText={setOldPin}
                />
                <TextInput
                    className="border shadow-lg bg-white rounded-lg p-2 mb-2 mt-2 h-12 text-center"
                    placeholder="קוד סודי חדש"
                    secureTextEntry
                    value={newPin}
                    onChangeText={setNewPin}
                />
                <TextInput
                    className="border shadow-lg bg-white rounded-lg mb-2 h-12 text-center"
                    placeholder="אישור קוד סודי חדש"
                    secureTextEntry
                    value={confirmNewPin}
                    onChangeText={setConfirmNewPin}
                />
            </InfoCard>

            <View className="w-3/4 mx-auto mt-4">
                <Button className="bg-slate-700" onPress={handleSave}>
                    שמור שינויים
                </Button>
                <Button className="bg-slate-500" onPress={handleCancel}>
                    ביטול
                </Button>
            </View>
        </View>
    );
}
