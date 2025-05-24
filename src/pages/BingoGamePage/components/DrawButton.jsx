import React, { useContext, useEffect, useRef, useState } from "react";
import { BingoContext } from "bingo/src/context/BingoGameContext";
import { Animated, Dimensions, Easing, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useBingoWebSocket } from "../../../../../../src/context/BingoGameWebsocket.js";
import { useTheme } from "../../../../../../src/context/ThemeContext.jsx";
import { isTablet } from "../../../../../../src/utils/isTablet.js";

const TABLET_DEVICE = isTablet();

const DrawButton = () => {
  const { bgColor, currentNumber, setCurrentNumber, drawNumber, drawNumberEnabled, isCountingDown, isCooldownActive, cooldownRemaining } = useContext(BingoContext);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const numberRef = useRef(currentNumber);
  const { messages } = useBingoWebSocket();
  const [drawnNumberMessage, setDrawnNumberMessage] = useState(null);
  const [isNumberAnimatedUp, setIsNumberAnimatedUp] = useState(false);
  const { colors } = useTheme();

  const [isLandscape, setIsLandscape] = useState(Dimensions.get('window').width > Dimensions.get('window').height);

  useEffect(() => {
    const onChange = ({ window }) => {
      setIsLandscape(window.width > window.height);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => {
      subscription.remove();
    };
  }, []);

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
        numberRef.current = newNumber;
        setIsNumberAnimatedUp(false);
        animateNumberChangeUp();
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
    outputRange: [0, TABLET_DEVICE ? (isLandscape ? -75 : -150) : (isLandscape ? -50 : -100)],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.60],
  });

  return (
    <TouchableOpacity
      onPress={drawNumberEnabled && !isCooldownActive ? drawNumber : null}
      style={[styles.circle, { borderColor: bgColor, backgroundColor: colors.card }]}
      disabled={!drawNumberEnabled || isCooldownActive}
    >
      {currentNumber !== null && (
        <Animated.View style={{ transform: [{ translateY }, { scale }] }}>
          <Text style={[styles.drawnNumberText, { color: colors.text }]}>{currentNumber}</Text>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: TABLET_DEVICE ? 60 : 45,
    height: TABLET_DEVICE ? 60 : 45,
    borderRadius: 30,
    borderWidth: 2,
    marginBottom: TABLET_DEVICE ? 20 : 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawnNumberText: {
    fontSize: TABLET_DEVICE ? 28 : 20,
    fontWeight: 'bold',
  },
});

export default DrawButton;
