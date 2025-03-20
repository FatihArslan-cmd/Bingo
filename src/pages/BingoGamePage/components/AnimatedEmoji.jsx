import React, { useRef, useEffect, useState, useContext } from 'react';
import { Animated, StyleSheet, View } from 'react-native'; 
import { useBingoWebSocket } from '../../../../../../src/context/BingoGameWebsocket';
import { BingoContext } from 'bingo/src/context/BingoGameContext';
import FastImage from 'react-native-fast-image'; 
import { Text } from 'react-native-paper';

const AnimatedEmoji = () => {
  const positionY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const { messages } = useBingoWebSocket();
  const emojiMessages = messages.filter(msg => msg.type === 'emoji-received');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState(null); 
  const [displayEmojis, setDisplayEmojis] = useState(true);
  const { setIsEmojiAnimating } = useContext(BingoContext);

  useEffect(() => {
    if (emojiMessages.length > 0 && displayEmojis) {
      const latestEmojiMessage = emojiMessages[emojiMessages.length - 1];
      const receivedEmoji = latestEmojiMessage.emoji;
      const receivedProfilePhoto = latestEmojiMessage.profilePhoto; 

      if (receivedEmoji) {
        setSelectedEmoji(receivedEmoji);
        setSelectedProfilePhoto(receivedProfilePhoto); 
    console.log('selectedEmoji', latestEmojiMessage.profilePhoto);
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
          setSelectedProfilePhoto(null); 
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
      {selectedProfilePhoto && ( 
        <View style={styles.profilePhotoContainer}>
          <FastImage
            style={styles.profilePhoto}
            source={{
              uri: selectedProfilePhoto,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedEmojiContainer: {
    position: 'absolute',
    top: -40, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 50,
    textAlign: 'center',
  },
  profilePhotoContainer: {
    marginBottom: 5, 
  },
  profilePhoto: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default AnimatedEmoji;