import React, { useRef, useEffect, useState, useContext } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native'; // Added View
import { useBingoWebSocket } from '../../../../../../src/context/BingoGameWebsocket';
import { BingoContext } from 'bingo/src/context/BingoGameContext';

const AnimatedEmoji = () => {
  const positionY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const { messages } = useBingoWebSocket();
  const emojiMessages = messages.filter(msg => msg.type === 'emoji-received');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null); // State for username
  const [displayEmojis, setDisplayEmojis] = useState(true);
  const { setIsEmojiAnimating } = useContext(BingoContext);

  useEffect(() => {
    if (emojiMessages.length > 0 && displayEmojis) {
      const latestEmojiMessage = emojiMessages[emojiMessages.length - 1];
      const receivedEmoji = latestEmojiMessage.emoji;
      const receivedUsername = latestEmojiMessage.username; // Extract username

      if (receivedEmoji) {
        setSelectedEmoji(receivedEmoji);
        setSelectedUsername(receivedUsername); // Set username

        positionY.setValue(0);
        opacity.setValue(1);
        scale.setValue(1);
        setIsEmojiAnimating(true);

        Animated.parallel([
          Animated.timing(positionY, {
            toValue: -150,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.75,
            duration: 500,
          useNativeDriver: true,
          }),
        ]).start(() => {
          setSelectedEmoji(null);
          setSelectedUsername(null); // Clear username when animation finishes
          setIsEmojiAnimating(false);
        });
      }
    }
  }, [emojiMessages.length, displayEmojis, positionY, opacity, scale, setSelectedEmoji, setIsEmojiAnimating]);

  if (!selectedEmoji || !displayEmojis) {
    return null;
  }

  return (
    <Animated.View style={[styles.animatedEmojiContainer, { transform: [{ translateY: positionY }, { scale: scale }], opacity: opacity }]}>
      <Text style={styles.emojiText}>{selectedEmoji}</Text>
      {selectedUsername && <Text style={styles.usernameText}>{selectedUsername}</Text>} 
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedEmojiContainer: {
    position: 'absolute',
    top: -30, // Adjusted top to accommodate username
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 50,
    textAlign: 'center', // Center emoji if username is present
  },
  usernameText: { // Style for username
    fontSize: 16,
    color: 'black', // Adjust color as needed
    textAlign: 'center',
  },
});

export default AnimatedEmoji;