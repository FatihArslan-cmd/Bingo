import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from 'bingo/src/pages/BingoResultScreen/styles/styles';
import lobbyService from '../../../../../../../GameCenter/src/pages/GameDetails/service/service.js';
import { useTheme } from '../../../../../../src/context/ThemeContext';
import {useTranslation} from 'react-i18next';

const ActionButtons = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const handlePlayAgain = async () => {
        setIsLoading(true);
        try {
            await lobbyService.startGame();
        } catch (error) {
            console.error("Error starting new game:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.buttonsContainer}>
            <TouchableRipple
                style={styles.playAgainButton}
                onPress={handlePlayAgain}
                disabled={isLoading} 
            >
                <View style={styles.buttonContent}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" /> 
                    ) : (
                        <>
                            <Icon name="reload" size={24} color="#fff" />
                            <Text style={styles.buttonText}>
                                {t('bingoGame.resultScreenButton')}
                            </Text>
                        </>
                    )}
                </View>
            </TouchableRipple>
        </View>
    );
};

export default ActionButtons;