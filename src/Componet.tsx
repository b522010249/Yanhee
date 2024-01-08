import { View,Text, Button } from "react-native";

const Component: React.FC<any> =({ navigation })=>{
    return(
        <View>
            <Text>เพิ่ม</Text>
            <Button
                    title="Go to Details"
                    onPress={() => navigation.navigate('Home')}
                />
        </View>
    );
}
export default Component