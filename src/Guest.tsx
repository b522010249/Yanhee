import { StyleSheet, View } from "react-native";
import React from "react";
import {
  DefaultTheme,
  Provider as PaperProvider,
  Modal,
  Portal,
  Text,
  Button,
  Card,
  Avatar,
  IconButton,
  TouchableRipple,
  Searchbar,
} from "react-native-paper";
import AddExtra from "./AddExtra";

const Guest = () => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };
  const [searchQuery, setSearchQuery] = React.useState('');
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "transparent", // Set the background color to the desired value
    },
  };
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <AddExtra />
        </Modal>
      </Portal>
      <TouchableRipple
        onPress={() => console.log("Pressed")}
        rippleColor="rgba(0, 0, 0, .32)"
      >
        <Card>
          <Card.Title
            title="ชื่อ"
            subtitle="สถานะ"
            left={(props) => <Avatar.Icon {...props} icon="account" />}
          />
        </Card>
      </TouchableRipple>

      <Button style={styles.AddGuest} onPress={showModal}>
        Add
      </Button>
    </View>
  );
};

export default Guest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  AddGuest: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 10,
    padding: 10,
    zIndex: 1,
    width: 100,
    height: 100,
  },
});
