import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import Button from '../../common/button';
import Input from '../../common/textInput';
import InfoCard from '../../common/infoCard';
import ColorPicker from '../../common/colorPicker';

export default function profileEdit({ profile, goBack }) {
    const [editing, setEditing] = useState(false);
    const [newColor, setNewColor] = useState(profile.color);
    const [newProfileName, setNewProfileName] = useState(profile.profileName);
    const [newPin, setNewPin] = useState("");
    const [confirmNewPin, setConfirmNewPin] = useState("");
    const [oldPin, setOldPin] = useState("");


    return (
        <ScrollView className="w-full">
            <View className="bg-slate-700 p-4 rounded-lg m-4">
                <Text className="text-white text-2xl font-bold text-center">פרטי פרופיל</Text>
                <Text className="text-white text-center mt-2">נהל את פרטי הפרויל האישי שלך</Text>
            </View>
            <View>
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
                            placeholder="אישור קוד סודי"
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
            <View className="w-3/4 mx-auto mt-4">
                {editing ? (
                    <>
                        <Button className='bg-slate-700'>שמור שינויים</Button>
                        <Button className='bg-slate-500' onPress={() => { setEditing(false); }}>ביטול</Button>
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