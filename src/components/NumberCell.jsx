import React, { useContext, memo } from 'react'; // memo ekledik
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext';

const NumberCell = memo(({ num, row, col }) => { // memo ile sardık
    const { bgColor, markedNumbers, handleCellPress } = useContext(BingoContext);
    const isMarked = markedNumbers[`${row}-${col}`]; // İşaretli mi kontrolü daha verimli

    return (
        <TouchableOpacity
            onPress={() => handleCellPress(row, col, num)}
            style={[
                styles.cell,
                num !== null && styles.filledCell,
                isMarked && styles.markedCell // isMarked değişkenini kullandık
            ]}
            activeOpacity={0.7} // TouchableOpacity için geri bildirim
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
    defaultText: { // İşaretli olmayan hücre metin stili
        // Varsayılan stil, gerekirse buraya ek stil tanımlanabilir.
    },
    markedText: { // İşaretli hücre metin stili
        color: '#fff', // Beyaz renk zaten inline style'da tanımlı, burada tekrar tanımlamaya gerek yok ama okunabilirlik için bırakılabilir.
        // İstenirse başka işaretli metin stilleri buraya eklenebilir.
    },
});

NumberCell.displayName = 'NumberCell'; 
export default NumberCell;