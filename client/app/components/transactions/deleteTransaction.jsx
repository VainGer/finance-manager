import { View, Text } from 'react-native';
import Button from '../common/button.jsx';
export default function DeleteTransaction({profile, goBack}) {
    return (
        <View>
            <Text>מחיקת עסקה</Text>
            <Button onPress={goBack}>חזור</Button>
        </View>
    );
}
