// AnimatedEmoji.js
import React, { useRef, useEffect, useContext } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext';

const AnimatedEmoji = () => {
  const { selectedEmoji, emojiAnimationTrigger, setIsEmojiAnimating, setSelectedEmoji, displayEmojis } = useContext(BingoContext); // Get displayEmojis from context
  const positionY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (selectedEmoji && displayEmojis) { // Only animate if selectedEmoji and displayEmojis are true
      positionY.setValue(0);
      opacity.setValue(1);
      scale.setValue(1);

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
          toValue: 1.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setSelectedEmoji(null);
        setIsEmojiAnimating(false);
      });
    }
  }, [selectedEmoji, emojiAnimationTrigger, positionY, opacity, scale, setIsEmojiAnimating, setSelectedEmoji, displayEmojis]); // Added displayEmojis to dependencies

  if (!selectedEmoji || !displayEmojis) { // Don't render if no emoji or if displayEmojis is false
    return null;
  }

  return (
    <Animated.View style={[styles.animatedEmojiContainer, { transform: [{ translateY: positionY }, { scale: scale }], opacity: opacity }]}>
      <Text style={styles.emojiText}>{selectedEmoji}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedEmojiContainer: {
    position: 'absolute',
    top: -30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 50,
  },
});

export default AnimatedEmoji;