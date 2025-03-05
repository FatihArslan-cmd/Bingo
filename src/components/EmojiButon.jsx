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
    backgroundColor: 'rgba(105, 105, 105, 0.2)', // Kapalı gri ve saydam renk
    width: 60, // Çapı belirle
    height: 60, // Yüksekliği çap ile aynı yap
    borderRadius: 30, // Yarıçapı genişliğin yarısı yap ki circle olsun
    justifyContent: 'center', // İçeriği ortala
    alignItems: 'center',     // İçeriği ortala
  },
  buttonText: {
    fontSize: 36,
  },
});

export default EmojiButton;