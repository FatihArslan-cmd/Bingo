import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import getStyles from "bingo/src/pages/BingoResultScreen/styles/getStyles.jsx";
import lobbyService from "../../../../../../../GameCenter/src/pages/GameDetails/service/service.js";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { isTablet } from "../../../../../../src/utils/isTablet.js";

const TABLET_DEVICE = isTablet();

const ActionButtons = () => {
    const [isLoading, setIsLoading] = useState(false);
    const styles = getStyles();
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
                            <Icon name="reload" size={TABLET_DEVICE ? 24 : 18} color="#fff" />
                            <Text style={styles.buttonText}>{t("bingoGame.resultScreenButton")}</Text>
                        </>
                    )}
                </View>
            </TouchableRipple>
        </View>
    );
};

export default ActionButtons;