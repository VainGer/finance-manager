import { View, Text } from 'react-native';
import Button from '../common/button.jsx';
export default function ChangeTransactionDescription({ profile, goBack }) {
    return (
        <View>
            <Text>שינוי תיאור עסקה</Text>
            <Button onPress={goBack}>חזור</Button>
        </View>
    );
}
