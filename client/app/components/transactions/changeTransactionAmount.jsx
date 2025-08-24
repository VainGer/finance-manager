import { View, Text } from 'react-native';
import Button from '../common/button.jsx';
export default function ChangeTransactionAmount({profile, goBack}) {
    return (
        <View>
            <Text>שינוי סכום עסקה</Text>
            <Button onPress={goBack}>חזור</Button>
        </View>
    );
}


