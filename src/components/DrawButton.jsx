import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const DrawButton = ({ bgColor, currentNumber, drawNumber, drawNumberEnabled }) => {
    return (
        <TouchableOpacity
            onPress={drawNumber}
            style={[styles.circle, { borderColor: bgColor }, !drawNumberEnabled && styles.disabledCircle]}>
            {currentNumber !== null && (
                <Text style={styles.drawnNumberText}>{currentNumber}</Text>
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
    disabledCircle: {
        opacity: 0.5,
    },
    drawnNumberText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000'
    }
});

export default DrawButton;