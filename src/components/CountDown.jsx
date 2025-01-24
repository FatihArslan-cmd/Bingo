import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Countdown = ({ countdown, isCountingDown }) => {
    return isCountingDown ? (
        <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>Next Draw in: {countdown}</Text>
        </View>
    ) : null;
};


const styles = StyleSheet.create({
    countdownContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
    },
    countdownText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
});


export default Countdown;