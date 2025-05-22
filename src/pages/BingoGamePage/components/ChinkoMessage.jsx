import FastImage from "react-native-fast-image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Sound from "react-native-sound";
import { Dimensions, StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
import { useBingoWebSocket } from "../../../../../../src/context/BingoGameWebsocket";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS
} from 'react-native-reanimated';


const CHINKO_SOUND_NAME = 'chinko_message_sound.mp3';

export const ChinkoMessage = () => {
  const screenWidth = Dimensions.get('window').width;
  const translateX = useSharedValue(screenWidth);
  const [messageData, setMessageData] = useState(null);
  const timeoutRef = useRef(null);
  const { messages } = useBingoWebSocket();

  const chinkoSoundRef = useRef(null);

  useEffect(() => {
      const sound = new Sound(CHINKO_SOUND_NAME, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
              return;
          }
          chinkoSoundRef.current = sound;
      });

      return () => {
          if (chinkoSoundRef.current) {
              chinkoSoundRef.current.release();
              chinkoSoundRef.current = null;
          }
      };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: messageData ? 1 : 0,
  }));

  const handleAnimationEnd = useCallback(() => {
    setMessageData(null);
  }, []);

  const playChinkoSound = useCallback(() => {
      if (chinkoSoundRef.current && !chinkoSoundRef.current.isPlaying()) {
          chinkoSoundRef.current.play((success) => {
              if (success) {
              } else {
              }
          });
      }
  }, []);

  const showMessage = useCallback((msg) => {
    if (msg?.type === 'row-completed') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setMessageData({
        text: `${msg.username} ${msg.rowNumber}. satır çinkosunu yaptı!`,
        profilePhoto: msg.profilePhoto
      });

      playChinkoSound();

      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });

      timeoutRef.current = setTimeout(() => {
        translateX.value = withTiming(
          screenWidth + 100,
          {
            duration: 300,
            easing: Easing.in(Easing.quad),
          },
          (finished) => {
            if (finished) runOnJS(handleAnimationEnd)();
          }
        );
      }, 3000);
    }
  }, [screenWidth, translateX, handleAnimationEnd, playChinkoSound]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'row-completed') {
      showMessage(lastMessage);
    }
  }, [messages, showMessage]);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {messageData && (
        <Surface style={styles.surface}>
          {messageData.profilePhoto && (
            <FastImage
              style={styles.profilePhoto}
              source={{ uri: messageData.profilePhoto }}
            />
          )}
          <Text style={styles.message}>{messageData.text}</Text>
        </Surface>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    width: '50%',
    alignSelf: 'center',
    zIndex: 1000,
  },
  surface: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#EBF5FB',
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  profilePhoto: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  icon: {
    marginRight: 10,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
});