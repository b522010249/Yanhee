import { View,StyleSheet, ScrollView, Button,Text } from "react-native";

export default function Home({ navigation }){
    return(
        <View style={styles.main}>
            <View style={{height:100,backgroundColor:'blue'}}>
                <Button
                    title="Go to Details"
                    onPress={() => navigation.navigate('Component')}
                />
            </View>
            <ScrollView >
                <View style={styles.content}>
                    <View style={styles.card}/>
                    <View style={styles.card}/>
                    <View style={styles.card}/>
                    <View style={styles.card}/>
                    <View style={styles.card}/>
                    <View style={styles.card}/>
                    <View style={styles.card}/>
                    <View style={styles.card}/>
                    <View style={styles.card}/>
                    <View style={styles.card}/>
                    <View style={styles.card}/>
                    <View style={styles.card}/>
                </View>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    main:{
        flex: 1,
        backgroundColor: 'pink',
    },
    content:{
        backgroundColor: 'red',
        flexWrap: 'wrap',
        flexDirection:'row',
        justifyContent:'center',
        gap:30,
    },
    card:{
        backgroundColor:'gray',
        margin: 5,
        width:150,
        height:150,
    }
})