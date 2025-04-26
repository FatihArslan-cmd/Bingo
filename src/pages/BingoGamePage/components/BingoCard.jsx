import NumberCell from "bingo/src/pages/BingoGamePage/components/NumberCell";
import React, { memo, useContext } from "react";
import { BingoContext } from "bingo/src/context/BingoGameContext";
import { StyleSheet, View } from "react-native";
import { isTablet } from "../../../../../../src/utils/isTablet";

const TABLET_DEVICE = isTablet();

const BingoCard = memo(() => {
    const { card, bgColor, markedNumbers, handleCellPress } = useContext(BingoContext);

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
});

const styles = StyleSheet.create({
    cardContainer: {
        padding: TABLET_DEVICE ? 6 : 3,
        borderRadius: 12,
        borderWidth: 4,
        transform: [{ scale: TABLET_DEVICE ? 1.2 : 0.8 }],
        marginVertical :25,
    },
    row: {
        flexDirection: 'row',
    },
});

BingoCard.displayName = 'BingoCard';
export default BingoCard;