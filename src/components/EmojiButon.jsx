import React, { useContext } from 'react'; // useContext import edildi
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext'; // BingoContext import edildi

const EmojiButton = () => {
  const { handleEmojiButtonPress } = useContext(BingoContext); // handleEmojiButtonPress context'ten alındı

  return (
    <TouchableOpacity style={styles.button} onPress={handleEmojiButtonPress}> {/* context'ten alınan handleEmojiButtonPress kullanılıyor */}
      <Text style={styles.buttonText}>🎉</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 36,
  },
});

export default EmojiButton;