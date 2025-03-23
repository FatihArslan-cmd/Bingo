import React, { useEffect, useRef, useContext } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext';
import { useTheme } from '../../../../../../src/context/ThemeContext';

const Countdown = () => {
    const { countdown, isCountingDown } = useContext(BingoContext);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;
    const translateYAnim = useRef(new Animated.Value(-100)).current;
    const opacityContainerAnim = useRef(new Animated.Value(0)).current;
    const {colors} = useTheme();

    useEffect(() => {
        if (isCountingDown) {
            Animated.parallel([
              Animated.timing(translateYAnim, {
                toValue: 80,
                duration: 500,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(opacityContainerAnim,{
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              })
            ]).start(() => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(scaleAnim, {
                            toValue: 1.05,
                            duration: 1500,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(scaleAnim, {
                            toValue: 1,
                            duration: 1500,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            });

        } else {
            if(translateYAnim._value === 80) {
                Animated.parallel([
                  Animated.timing(translateYAnim, {
                    toValue: -100,
                    duration: 500,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                  }),
                  Animated.timing(opacityContainerAnim,{
                    toValue: 0,
                    duration: 300,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                  })
              ]).start(() => {
                    scaleAnim.setValue(1);
                });
            }
        }
    }, [isCountingDown]);


    useEffect(() => {
        Animated.sequence([
            Animated.timing(opacityAnim, {
                toValue: 0.5,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [countdown]);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                  opacity: opacityContainerAnim,
                  transform: [{ translateY: translateYAnim }],
                },
            ]}
        >
            <Animated.View
                style={[
                    styles.countdownWrapper,
                    {
                        transform: [{ scale: scaleAnim }],
                        backgroundColor: colors.card,
                        shadowColor: colors.text,
                    },
                ]}
            >
                <View style={[styles.innerCircle, { backgroundColor: colors.background, borderColor: colors.border }]}> 
                    <View style={[styles.gradientOverlay, { backgroundColor: colors.card }]} />
                    <Animated.Text
                        style={[
                            styles.countdownText,
                            {
                                opacity: opacityAnim,
                                color: colors.text, 
                            },
                        ]}
                    >
                        {countdown}
                    </Animated.Text>
                </View>

                {[...Array(8)].map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.decorativeDot,
                            {
                                transform: [
                                    {
                                        rotate: `${index * (360 / 8)}deg`,
                                    },
                                    { translateY: -35 },
                                ],
                                backgroundColor: colors.primary, 
                            },
                        ]}
                    />
                ))}
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1000,
    },
    countdownWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.5,
        elevation: 6,
        overflow: 'visible',
    },
    innerCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        overflow: 'hidden',
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        borderRadius: 35,
    },
    countdownText: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    decorativeDot: {
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: 2,
        opacity: 0.4,
    },
});

export default Countdown;