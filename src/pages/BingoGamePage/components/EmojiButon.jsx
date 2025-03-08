import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext';

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
    width: 60, 
    height: 60,
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center',    
  },
  buttonText: {
    fontSize: 36,
  },
});

export default EmojiButton;