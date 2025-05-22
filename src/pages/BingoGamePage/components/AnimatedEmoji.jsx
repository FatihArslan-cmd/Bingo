import FastImage from "react-native-fast-image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BingoContext } from "bingo/src/context/BingoGameContext";
import { Animated, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useBingoWebSocket } from "../../../../../../src/context/BingoGameWebsocket";
import { isTablet } from "../../../../../../src/utils/isTablet";

const TABLET_DEVICE = isTablet();

const AnimatedEmoji = () => {
  const positionY = useRef(new Animated.Value(0)).current;
  const positionX = useRef(new Animated.Value(0)).current;
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

        positionY.setValue(0);
        positionX.setValue(0);
        opacity.setValue(1);
        scale.setValue(1);
        setIsEmojiAnimating(true);

        const totalDuration = 4000;
        const verticalTarget = TABLET_DEVICE ? -300 : -150;
        const horizontalAmplitude = TABLET_DEVICE ? 40 : 30;
        const numberOfZigs = 3;
        const segmentDuration = totalDuration / (numberOfZigs * 2);

        const fadeStartTime = totalDuration * 0.5;
        const fadeDuration = totalDuration - fadeStartTime;
        const finalScale = 2.0;

        const xAnimations = [];
        for (let i = 0; i < numberOfZigs * 2; i++) {
            let targetX = (i % 2 === 0) ? horizontalAmplitude : -horizontalAmplitude;
            if (i === 0) targetX = horizontalAmplitude;

            xAnimations.push(Animated.timing(positionX, {
                toValue: targetX,
                duration: segmentDuration,
                useNativeDriver: true,
            }));
        }
         xAnimations.push(Animated.timing(positionX, {
             toValue: 0,
             duration: segmentDuration,
             useNativeDriver: true,
         }));


        Animated.parallel([
          Animated.timing(positionY, {
            toValue: verticalTarget,
            duration: totalDuration,
            useNativeDriver: true,
          }),
          Animated.sequence(xAnimations),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: fadeStartTime,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: fadeDuration,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(scale, {
            toValue: finalScale,
            duration: totalDuration,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setSelectedEmoji(null);
          setSelectedProfilePhoto(null);
          setIsEmojiAnimating(false);
        });
      }
    }
  }, [emojiMessages.length, displayEmojis, positionY, positionX, opacity, scale, setSelectedEmoji, setSelectedProfilePhoto, setIsEmojiAnimating]);

  if (!selectedEmoji || !displayEmojis) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.animatedEmojiContainer,
        {
          transform: [
            { translateY: positionY },
            { translateX: positionX },
            { scale: scale }
          ],
          opacity: opacity,
        },
      ]}
    >

      <Text style={styles.emojiText}>{selectedEmoji}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedEmojiContainer: {
    position: 'absolute',
    top: -40,
    left: '50%',
    marginLeft: -30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  emojiText: {
    fontSize: TABLET_DEVICE ? 50 : 28,
    textAlign: 'center',
  },
});

export default AnimatedEmoji;