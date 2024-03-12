import { View, StyleSheet, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
//navigate path
import Homescreen from "./src/Home";
import AddCompany from "./src/AddCompany";
import CompanyListScreen from "./src/CompanyListScreen";
import AddPackage from "./src/AddPackage";
import AddHeatlhCheck from "./src/AddHealthCheck";
import Scan from "./src/Scan";
import Company from "./src/Company";
import HealthCheck from "./src/HealthCheck";
import Employee from "./src/Employee";
import AddExtra from "./src/AddExtra";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import SearchScan from "./src/SearchScan";
import test from "./src/test";
import Sticker from "./src/Sticker";
import AddSingleEmployee from "./src/AddSingleEmployee";
import Login from "./src/Login";

export default function App() {
  const theme = {
    colors: {
      primary: "rgb(0, 108, 81)",
      onPrimary: "rgb(255, 255, 255)",
      primaryContainer: "rgb(131, 248, 206)",
      onPrimaryContainer: "rgb(0, 33, 22)",
      secondary: "rgb(76, 99, 89)",
      onSecondary: "rgb(255, 255, 255)",
      secondaryContainer: "rgb(206, 233, 219)",
      onSecondaryContainer: "rgb(8, 32, 24)",
      tertiary: "rgb(63, 99, 117)",
      onTertiary: "rgb(255, 255, 255)",
      tertiaryContainer: "rgb(194, 232, 253)",
      onTertiaryContainer: "rgb(0, 30, 43)",
      error: "rgb(186, 26, 26)",
      onError: "rgb(255, 255, 255)",
      errorContainer: "rgb(255, 218, 214)",
      onErrorContainer: "rgb(65, 0, 2)",
      background: "rgb(251, 253, 249)",
      onBackground: "rgb(25, 28, 26)",
      surface: "rgb(251, 253, 249)",
      onSurface: "rgb(25, 28, 26)",
      surfaceVariant: "rgb(219, 229, 222)",
      onSurfaceVariant: "rgb(64, 73, 68)",
      outline: "rgb(112, 121, 116)",
      outlineVariant: "rgb(191, 201, 194)",
      shadow: "rgb(0, 0, 0)",
      scrim: "rgb(0, 0, 0)",
      inverseSurface: "rgb(46, 49, 47)",
      inverseOnSurface: "rgb(239, 241, 238)",
      inversePrimary: "rgb(101, 219, 179)",
      elevation: {
        level0: "transparent",
        level1: "rgb(238, 246, 241)",
        level2: "rgb(231, 241, 236)",
        level3: "rgb(223, 237, 231)",
        level4: "rgb(221, 236, 229)",
        level5: "rgb(216, 233, 226)",
      },
      surfaceDisabled: "rgba(25, 28, 26, 0.12)",
      onSurfaceDisabled: "rgba(25, 28, 26, 0.38)",
      backdrop: "rgba(41, 50, 46, 0.4)",
    },
  };

  // You can use 'theme' as needed in your application

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
              <Stack.Navigator>
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Home"
                  component={Homescreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AddCompany"
                  component={AddCompany}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CompanyListScreen"
                  component={CompanyListScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Company"
                  component={Company}
                  options={{ headerShown: true }}
                />
                <Stack.Screen
                  name="AddPackage"
                  component={AddPackage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AddHeatlhCheck"
                  component={AddHeatlhCheck}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Scan"
                  component={Scan}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="HealthCheck"
                  component={HealthCheck}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Employee"
                  component={Employee}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AddExtra"
                  component={AddExtra}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="SearchScan"
                  component={SearchScan}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="test"
                  component={test}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AddSingleEmployee"
                  component={AddSingleEmployee}
                  options={{ headerShown: false }}
                />
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
