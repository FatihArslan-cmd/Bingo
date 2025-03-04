// EmojiPanel.js
import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon

const screenWidth = Dimensions.get('window').width;

const EmojiPanel = () => {
  const { emojis, handleEmojiSelect, isEmojiPanelVisible, closeEmojiPanel, displayEmojis, toggleDisplayEmojis } = useContext(BingoContext);

  if (!isEmojiPanelVisible) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={closeEmojiPanel}>
      <View style={styles.panelOverlay}>
        <TouchableWithoutFeedback onPress={() => { /* Prevent clicks inside panel from closing overlay */ }}>
          <View style={styles.panel}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleDisplayEmojis}
            >
              <Icon
                name={displayEmojis ? "eye-outline" : "eye-off-outline"} // Eye icon to toggle visibility
                size={24}
                color="#333"
              />
            </TouchableOpacity>
            <View style={styles.emojiContainer}>
              {emojis.map((emoji, index) => (
                <TouchableOpacity key={index} style={styles.emojiButton} onPress={() => handleEmojiSelect(emoji)}>
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  panelOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  panel: {
    backgroundColor: '#fff',
    width: screenWidth * 0.9,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 60,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  emojiButton: {
    padding: 10,
  },
  emojiText: {
    fontSize: 35,
  },
  toggleButton: { // Style for the toggle button
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 5,
  },
});

export default EmojiPanel;