import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import { useBingoWebSocket } from '../../../../../../src/context/BingoGameWebsocket';

export const ChinkoMessage = () => {
  const screenWidth = Dimensions.get('window').width;
  const translateX = useSharedValue(screenWidth);
  const [messageData, setMessageData] = useState(null);
  const timeoutRef = useRef(null);
  const { messages } = useBingoWebSocket();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: messageData ? 1 : 0,
  }));

  const handleAnimationEnd = useCallback(() => {
    setMessageData(null);
  }, []);

  const showMessage = useCallback((msg) => {
    if (msg?.type === 'row-completed') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setMessageData({
        text: `${msg.username} ${msg.rowNumber}. satır çinkosunu yaptı!`,
        profilePhoto: msg.profilePhoto
      });

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
  }, [screenWidth, translateX, handleAnimationEnd]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.type === 'row-completed') {
      showMessage(lastMessage);
    }
  }, [messages]);

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