import React, { useRef, useEffect, useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, Easing } from 'react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext';

const DrawButton = () => {
  const { bgColor, currentNumber, drawNumber, drawNumberEnabled } = useContext(BingoContext);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const numberRef = useRef(currentNumber);

  useEffect(() => {
    if (currentNumber === null) return;

    if (numberRef.current !== currentNumber) {
      animateNumberChange();
    }

    numberRef.current = currentNumber;
  }, [currentNumber, drawNumberEnabled]);

  const animateNumberChange = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
        Animated.delay(6000),
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -150],
  });
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.50],
  });

  return (
    <TouchableOpacity
      onPress={drawNumberEnabled ? drawNumber : null}
      style={[styles.circle, { borderColor: bgColor },]}
      disabled={!drawNumberEnabled}
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
  }
});

export default DrawButton;