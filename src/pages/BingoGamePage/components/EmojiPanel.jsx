import Icon from "react-native-vector-icons/Ionicons";
import React, { useContext } from "react";
import { BingoContext } from "bingo/src/context/BingoGameContext";
import { Dimensions, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useTheme } from "../../../../../../src/context/ThemeContext";
import { isTablet } from "../../../../../../src/utils/isTablet";

const TABLET_DEVICE = isTablet();

const screenWidth = Dimensions.get('window').width;

const EmojiPanel = () => {
  const { emojis, handleEmojiSelectContext, isEmojiPanelVisible, closeEmojiPanel, displayEmojis, toggleDisplayEmojis } = useContext(BingoContext);
  const { colors } = useTheme();
  if (!isEmojiPanelVisible) {
    return null;
  }

  const handleEmojiPress = (emoji) => {
      handleEmojiSelectContext(emoji); // Call the context's emoji selection handler
  };


  return (
    <TouchableWithoutFeedback onPress={closeEmojiPanel}>
      <View style={styles.panelOverlay}>
        <TouchableWithoutFeedback onPress={() => { /* Prevent clicks inside panel from closing overlay */ }}>
          <View style={[styles.panel, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleDisplayEmojis}
            >
              <Icon
                name={displayEmojis ? "eye-outline" : "eye-off-outline"}
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
            <View style={styles.emojiContainer}>
              {emojis.map((emoji, index) => (
                <TouchableOpacity key={index} style={styles.emojiButton} onPress={() => handleEmojiPress(emoji)}>
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
    zIndex: 1000,
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
    fontSize: TABLET_DEVICE ? 36 : 24,
  },
  toggleButton: { 
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 5,
  },
});

export default EmojiPanel;