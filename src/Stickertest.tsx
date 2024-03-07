import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ReactToPrint from 'react-to-print';

const Stickertest = () => {
  const componentRef = useRef();

  return (
    <View style={styles.container}>
      <View style={styles.printPage} ref={componentRef}>
        <Text>Stickertest</Text>
        {/* Add your component content here */}
      </View>
      <ReactToPrint
        trigger={() => <Text style={styles.printButton}>Print</Text>}
        content={() => componentRef.current}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  printPage: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
    pageBreakAfter: 'always',
  },
  printButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
});

export default Stickertest;
