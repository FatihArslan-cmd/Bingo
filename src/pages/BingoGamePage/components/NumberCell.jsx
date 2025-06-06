import React, { memo, useContext } from "react";
import { BingoContext } from "bingo/src/context/BingoGameContext";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const NumberCell = memo(({ num }) => {
    const { bgColor, drawnNumbers, handleCellPress, markedNumbers } = useContext(BingoContext);

    const isMarked = markedNumbers[num]; 

    const isDrawn = drawnNumbers.includes(num);

    return (
        <TouchableOpacity
            onPress={() => {
                if (isDrawn) { 
                    handleCellPress(num);
                }
            }}
            style={[
                styles.cell,
                num !== null && styles.filledCell,
                isMarked && styles.markedCell,
                !isDrawn && num !== null && !isMarked
            ]}
            activeOpacity={0.7}
            disabled={!isDrawn} 
        >
            {num !== null && <Text style={[styles.text, isMarked ? styles.markedText : styles.defaultText, { color: isMarked ? '#fff' : bgColor }]}>{num}</Text>}
        </TouchableOpacity>
    );
});

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
    markedText: {
        color: '#fff',
    },
});

NumberCell.displayName = 'NumberCell';
export default NumberCell;