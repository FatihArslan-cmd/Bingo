import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext';

const NumberCell = ({ num, row, col }) => {
    const { bgColor, markedNumbers, handleCellPress } = useContext(BingoContext);
    return (
        <TouchableOpacity
            key={col}
            onPress={() => handleCellPress(row, col, num)}
            style={[
                styles.cell,
                num !== null && styles.filledCell,
                markedNumbers[`${row}-${col}`] && styles.markedCell
            ]}
        >
            {num !== null && <Text style={[styles.text, { color: markedNumbers[`${row}-${col}`] ? '#fff' : bgColor }]}>{num}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cell: {
        width: 48,
        height: 48,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.9,
        borderColor: 'black',
    },
    filledCell: {
        backgroundColor: '#fff',
    },
    markedCell: {
        backgroundColor: 'green',
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
    },
});

export default NumberCell;