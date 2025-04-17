import React,{useContext} from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'react-native-linear-gradient';
import styles from 'bingo/src/pages/BingoResultScreen/styles/styles';
import WinnerCard from 'bingo/src/pages/BingoResultScreen/components/WinnerCard';
import ScoresCard from 'bingo/src/pages/BingoResultScreen/components/ScoresCard';
import ActionButtons from 'bingo/src/pages/BingoResultScreen/components/ActionButtons';
import LogoutButton from 'bingo/src/pages/BingoGamePage/components/LogoutButton';
import LottieView from 'lottie-react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext';
import { useTheme } from '../../../../../src/context/ThemeContext';

const BingoResultScreen = () => {
    const { bingoWinnerUsername, gameScores } = useContext(BingoContext);
    const { colors, resolvedTheme } = useTheme();
    const barStyle = resolvedTheme === 'dark' ? 'light-content' : 'dark-content';

    return (
        <SafeAreaProvider>
            <View
                style={[styles.container,{backgroundColor:colors.background}]}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar
                        translucent
                        backgroundColor="transparent"
                        barStyle={barStyle}
                    />
                    <View style={styles.resultScreenContainer}>
                        <View style={styles.logoutButtonContainer}>
                            <LogoutButton />
                        </View>
                        <WinnerCard bingoWinnerUsername={bingoWinnerUsername} gameScores={gameScores} />
                        <ScoresCard gameScores={gameScores} />
                        <LottieView
                            source={require('../../../assets/GameResult.json')}
                            autoPlay
                            loop
                            style={styles.lottieAnimation}
                        />
                        <ActionButtons />
                    </View>
                </SafeAreaView>
            </View>
        </SafeAreaProvider>
    );
};

export default BingoResultScreen;