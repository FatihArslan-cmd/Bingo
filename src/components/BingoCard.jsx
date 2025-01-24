import React from 'react';
import { View, StyleSheet } from 'react-native';
import NumberCell from './NumberCell';

const BingoCard = ({ card, bgColor, markedNumbers, handleCellPress }) => {
    return (
        <View style={[styles.cardContainer, { backgroundColor: bgColor, borderColor: bgColor }]}>
            {card.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((num, colIndex) => (
                        <NumberCell
                            key={colIndex}
                            num={num}
                            row={rowIndex}
                            col={colIndex}
                            bgColor={bgColor}
                            markedNumbers={markedNumbers}
                            handleCellPress={handleCellPress}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        padding: 6,
        borderRadius: 12,
        borderWidth: 4,
        transform: [{ scale: 1.2 }],
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
    },
});

export default BingoCard;