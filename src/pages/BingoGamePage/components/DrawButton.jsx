import React, { useRef, useEffect, useContext, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, Easing } from 'react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext';
import { useBingoWebSocket } from '../../../../../../src/context/BingoGameWebsocket.js';

const DrawButton = () => {
  const { bgColor, currentNumber, setCurrentNumber, drawNumber, drawNumberEnabled, isCountingDown, isCooldownActive, cooldownRemaining } = useContext(BingoContext);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const numberRef = useRef(currentNumber);
  const { messages } = useBingoWebSocket();
  const [drawnNumberMessage, setDrawnNumberMessage] = useState(null);
  const [isNumberAnimatedUp, setIsNumberAnimatedUp] = useState(false);

  useEffect(() => {
    const numberDrawnMessages = messages.filter(msg => msg.type === 'number-drawn');
    if (numberDrawnMessages.length > 0) {
      const latestNumberMessage = numberDrawnMessages[numberDrawnMessages.length - 1];
      setDrawnNumberMessage(latestNumberMessage);
    }
  }, [messages]);

  useEffect(() => {
    if (drawnNumberMessage) {
      const newNumber = drawnNumberMessage.number;
      if (numberRef.current !== newNumber) {
        setCurrentNumber(newNumber);
        numberRef.current = newNumber; // Update ref immediately before animation
        setIsNumberAnimatedUp(false); // Reset animation state to allow up animation
        animateNumberChangeUp(); // Start animation right after setting the number
      }
    }
  }, [drawnNumberMessage, setCurrentNumber]);


  useEffect(() => {
    if (!isCountingDown && isNumberAnimatedUp) {
      animateNumberChangeDown();
    }
  }, [isCountingDown, isNumberAnimatedUp]);

  const animateNumberChangeUp = () => {
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsNumberAnimatedUp(true);
    });
  };

  const animateNumberChangeDown = () => {
    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsNumberAnimatedUp(false);
    });
  };

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -150],
  });
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.60],
  });

  return (
    <TouchableOpacity
      onPress={drawNumberEnabled && !isCooldownActive ? drawNumber : null}
      style={[styles.circle, { borderColor: bgColor },]}
      disabled={!drawNumberEnabled || isCooldownActive}
    >
      {currentNumber !== null && (
          <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
              <Text style={styles.drawnNumberText}>{currentNumber}</Text>
          </Animated.View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    marginBottom: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawnNumberText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000'
  },
  cooldownText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default DrawButton;