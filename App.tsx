import { View, StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
//navigate path
import Homescreen from "./src/Home";
import AddCompany from "./src/AddCompany";
import CompanyListScreen from "./src/CompanyListScreen";
import AddPackage from "./src/AddPackage";
import AddHeatlhCheck from "./src/AddHealthCheck";
import BarcodeScan from "./src/BarcodeScan";
import Company from "./src/Company";
import HealthCheck from "./src/HealthCheck";
import Employee from "./src/Employee";
import AddExtra from "./src/AddExtra";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import SearchScan from "./src/SearchScan";

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "transparent", // Set the background color to the desired value
    },
  };

  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaProvider
      style={{
        flex: 1,
        paddingTop: Platform.OS === "ios" ? 35 : 0,
        backgroundColor: "black",
      }}
    >
      <PaperProvider theme={theme}>
        <View style={styles.Screen}>
          <View style={styles.Body}>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={Homescreen} />
                <Stack.Screen name="AddCompany" component={AddCompany} />
                <Stack.Screen
                  name="CompanyListScreen"
                  component={CompanyListScreen}
                />
                <Stack.Screen name="Company" component={Company} />
                <Stack.Screen name="AddPackage" component={AddPackage} />
                <Stack.Screen
                  name="AddHeatlhCheck"
                  component={AddHeatlhCheck}
                />
                <Stack.Screen name="BarcodeScan" component={BarcodeScan} />
                <Stack.Screen name="HealthCheck" component={HealthCheck} />
                <Stack.Screen name="Employee" component={Employee} />
                <Stack.Screen name="AddExtra" component={AddExtra} />
                {/* <Stack.Screen name="SearchScan" component={SearchScan} /> */}
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  Screen: {
    backgroundColor: "red",
    flex: 1,
  },
  Head: {
    backgroundColor: "cyan",
    height: 50,
  },
  Body: {
    backgroundColor: "white",
    flex: 1,
  },
  Footer: {
    backgroundColor: "#019874",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    height: 70,
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
  },
  headbar: {
    backgroundColor: "#019874",
    height: 100,
  },
  card: {
    backgroundColor: "gray",
    height: 100,
    width: 325,
    marginTop: 50,
  },
  contentscroll: {
    backgroundColor: "yellow",
    height: 100,
  },
});
