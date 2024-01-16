import { View,StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//navigate path
import Homescreen from "./src/Home";
import AddCompany from "./src/AddCompany";
import CompanyListScreen from "./src/CompanyListScreen";
import AddPackage from "./src/AddPackage";
import AddHeatlhCheck from "./src/AddHealthCheck";
import BarcodeScan from "./src/BarcodeScan";

export default function App(){

    const Stack = createNativeStackNavigator();
    return(

    <View style={styles.Screen}>
        <View style={styles.Head}/>
        <View style={styles.Searchbar}></View>
        <View style={styles.Body}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Home" component={Homescreen} />
                    <Stack.Screen name="AddCompany" component={AddCompany} />
                    <Stack.Screen name="CompanyListScreen" component={CompanyListScreen} />
                    <Stack.Screen name="AddPackage" component={AddPackage} />
                    <Stack.Screen name="AddHeatlhCheck" component={AddHeatlhCheck}/>
                    <Stack.Screen name="BarcodeScan" component={BarcodeScan}/>
                </Stack.Navigator>
            </NavigationContainer>
            <View style={{height:70}}/>
            <View style={styles.Footer}/>
        </View>
      </View>  
    );
}

const styles = StyleSheet.create({
    Screen:{
        backgroundColor: 'red',
        flex: 1,
    },
    Head:{
        backgroundColor: 'cyan',
        height:50,
    },
    Body:{
        backgroundColor: 'white',
        flex: 1,
    },
    Footer:{
        backgroundColor: '#019874',
        borderTopRightRadius:25,
        borderTopLeftRadius:25, 
        height: 70,
        position: "absolute",
        bottom:0,
        right:0,
        left:0,
    },
    Searchbar:{
        backgroundColor: '#019874',
        height: 100,
    },
    card:{
        backgroundColor: 'gray',
        height: 100,
        width: 325,
        marginTop: 50,
    },
    contentscroll:{
        backgroundColor: 'yellow',
        height:100,
    }

});