import React, { useRef, useEffect, useState, useContext } from 'react'; // Added useContext
import { Animated, Text, StyleSheet } from 'react-native';
import { useBingoWebSocket } from '../../../../src/context/BingoGameWebsocket.js';
import { BingoContext } from 'bingo/src/context/BingoGameContext'; // Imported BingoContext

const AnimatedEmoji = () => {
  const positionY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const { messages } = useBingoWebSocket();
  const emojiMessages = messages.filter(msg => msg.type === 'emoji-received');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [displayEmojis, setDisplayEmojis] = useState(true); // You might want to control this from outside or keep it always true here
  const { setIsEmojiAnimating } = useContext(BingoContext); // Added useContext to get setIsEmojiAnimating

  useEffect(() => {
    if (emojiMessages.length > 0 && displayEmojis) {
      // Get the latest emoji message.  If emojiMessages length changed, this is a new message.
      const latestEmojiMessage = emojiMessages[emojiMessages.length - 1];
      const receivedEmoji = latestEmojiMessage.emoji;

      if (receivedEmoji) {
        setSelectedEmoji(receivedEmoji);

        positionY.setValue(0);
        opacity.setValue(1);
        scale.setValue(1);
        setIsEmojiAnimating(true); // Set animating to true when animation starts

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
          setIsEmojiAnimating(false); // <-----  CRITICAL:  Is this being reached? Yes, now with setIsEmojiAnimating from context

        });
      }
    }
  }, [emojiMessages.length, displayEmojis, positionY, opacity, scale, setSelectedEmoji, setIsEmojiAnimating]); // Added setIsEmojiAnimating to dependencies

  if (!selectedEmoji || !displayEmojis) {
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