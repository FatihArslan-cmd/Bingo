import React from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'react-native-linear-gradient';
import styles from 'bingo/src/pages/BingoResultScreen/styles/styles';
import WinnerCard from 'bingo/src/pages/BingoResultScreen/components/WinnerCard';
import ScoresCard from 'bingo/src/pages/BingoResultScreen/components/ScoresCard';
import ActionButtons from 'bingo/src/pages/BingoResultScreen/components/ActionButtons';
import LogoutButton from 'bingo/src/pages/BingoGamePage/components/LogoutButton';
import LottieView from 'lottie-react-native'; 

const BingoResultScreen = () => {

    return (
        <SafeAreaProvider>
            <LinearGradient
                colors={['#F5F5F5', '#FFFFFF']}
                style={styles.container}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar
                        translucent
                        backgroundColor="transparent"
                        barStyle="dark-content"
                    />
                    <View style={styles.resultScreenContainer}>
                        <View style={styles.logoutButtonContainer}>
                            <LogoutButton />
                        </View>
                        <WinnerCard style={styles.winnerCardStyle}/>
                        <ScoresCard style={styles.scoresCardStyle}/>
                        <LottieView
                            source={require('../../../assets/GameResult.json')} 
                            autoPlay
                            loop
                            style={styles.lottieAnimation} 
                        />
                        <ActionButtons />
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </SafeAreaProvider>
    );
};

export default BingoResultScreen;