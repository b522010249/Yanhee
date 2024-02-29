import React from "react";
import { View,StyleSheet, ScrollView, TouchableOpacity,Text, Platform } from "react-native";
import useScanDetection from "use-scan-detection-react18";

const Home: React.FC<any> = ({ navigation })=>{
    if(Platform.OS==="web"){
        useScanDetection({
            onComplete: (code) => {
              const filteredCode = code.replace(/Alt0012/g, "").replace(/Shift/g, "");
        
              console.log(filteredCode);
              // Handle the filtered barcode, e.g., update state or trigger actions
              const [companyID, employeeID] = filteredCode.split("/");
        
              navigation.navigate("Employee", { companyID, employeeID });
            },
          });

    }
    return(
        <View style={styles.main}>
            <ScrollView >
                <View style={styles.content}>
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AddHeatlhCheck')}>
                        <Text>เพิ่มโปรแกรมตรวจสุขภาพ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AddPackage')}>
                        <Text>จัดการแพ๊คเกจตรวจสุขภาพ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AddCompany')}>
                        <Text>เพิ่มบริษัท</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CompanyListScreen')}>
                        <Text>ดูรายการบริษัท</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Guest')}>
                        <Text>บุคคลภายนอก</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BarcodeScan')}>
                        <Text>แสกน</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('HealthCheck')}>
                        <Text>โปรแกรมตรวจสุขภาพ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SearchScan')}>
                        <Text>เพิ่มเติม</Text>
                    </TouchableOpacity>
                    
                </View>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    main:{
        flex: 1,
    },
    content:{
        flexWrap: 'wrap',
        flexDirection:'row',
        justifyContent:'center',
        gap:35,
    },
    card:{
        backgroundColor:'gray',
        justifyContent: 'center',
        alignItems:'center',
        margin: 10,
        width:150,
        height:150,
    }
})
export default Home