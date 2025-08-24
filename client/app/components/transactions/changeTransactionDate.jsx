import { View, Text } from 'react-native';
import Button from '../common/button.jsx';
export default function ChangeTransactionDate({profile, goBack}) {
    return (
        <View>
            <Text>שינוי תאריך עסקה</Text>
            <Button onPress={goBack}>חזור</Button>
        </View>
    );
}
