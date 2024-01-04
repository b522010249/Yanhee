import { View,Text, Button } from "react-native";

const Component: React.FC<any> =({ navigation })=>{
    return(
        <View>
            <Text>SCREEN 2</Text>
            <Button
                    title="Go to Details"
                    onPress={() => navigation.navigate('Home')}
                />
        </View>
    );
}
export default Component