import React, { useContext } from 'react';
import { SafeAreaView, View } from 'react-native'; // SafeAreaView ekledik
import { LinearGradient } from 'react-native-linear-gradient';
import { BingoContext } from 'bingo/src/context/BingoGameContext';
import styles from 'bingo/src/pages/BingoResultScreen/styles/styles';
import WinnerCard from 'bingo/src/pages/BingoResultScreen/components/WinnerCard';
import ScoresCard from 'bingo/src/pages/BingoResultScreen/components/ScoresCard';
import ActionButtons from 'bingo/src/pages/BingoResultScreen/components/ActionButtons';
import LogoutButton from 'bingo/src/components/LogoutButton';

const BingoResultScreen = () => {
    const { bingoWinnerUsername, gameScores } = useContext(BingoContext);

    return (
        <LinearGradient
            colors={['#F5F5F5', '#FFFFFF']}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}> 
                <View style={styles.resultScreenContainer}>
                <View style={styles.logoutButtonContainer}>
                <LogoutButton />
                </View>
                    <WinnerCard bingoWinnerUsername={bingoWinnerUsername} gameScores={gameScores} />
                    <ScoresCard gameScores={gameScores} />
                    <ActionButtons />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default BingoResultScreen;