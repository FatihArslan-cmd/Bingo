import React, { useContext } from "react";
import { BingoContext } from "bingo/src/context/BingoGameContext";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { isTablet } from "../../../../../../src/utils/isTablet";

const TABLET_DEVICE = isTablet();

const EmojiButton = () => {
  const { handleEmojiButtonPress } = useContext(BingoContext);

  return (
    <TouchableOpacity style={styles.button} onPress={handleEmojiButtonPress}>
      <Text style={styles.buttonText}>🎉</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(105, 105, 105, 0.2)',
    width: TABLET_DEVICE ? 60 : 45, 
    height: TABLET_DEVICE ? 60 : 45,
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center',    
  },
  buttonText: {
    fontSize: TABLET_DEVICE ? 36 : 20,
  },
});

export default EmojiButton;