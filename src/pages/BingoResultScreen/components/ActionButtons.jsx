import React from 'react';
import { View  } from 'react-native';
import { Text ,TouchableRipple} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from 'bingo/src/pages/BingoResultScreen/styles/styles';
import lobbyService from '../../../../../../src/pages/HomeScreen/components/GameDetails/service/service';

const ActionButtons = () => {
    const handlePlayAgain = async () => {
        try {
            await lobbyService.startGame();
        } catch (error) {
            console.error("Error starting new game:", error);
        }
    };

    return (
        <View style={styles.buttonsContainer}>
            <TouchableRipple style={styles.playAgainButton} onPress={handlePlayAgain}>
                <View style={styles.buttonContent}>
                    <Icon name="reload" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Yeniden Oyna</Text>
                </View>
            </TouchableRipple>
        </View>
    );
};

export default ActionButtons;