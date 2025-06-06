import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import getStyles from "bingo/src/pages/BingoResultScreen/styles/getStyles";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { Text } from "react-native-paper";
import { useTheme } from "../../../../../../src/context/ThemeContext";

const ScoreRow = ({ username, score, index }) => {
    const { colors } = useTheme();
    const styles = getStyles();
    const { t } = useTranslation();

    const getPlayerRankStyle = (index) => {
        if (index === 0) return { backgroundColor: '#FFD700' }; // Gold
        if (index === 1) return { backgroundColor: '#C0C0C0' }; // Silver
        if (index === 2) return { backgroundColor: '#CD7F32' }; // Bronze
        return { backgroundColor: '#E0E0E0' }; // Default
    };

    const getPlayerRankIcon = (index) => {
        if (index === 0) return 'trophy';
        if (index === 1) return 'medal';
        if (index === 2) return 'medal-outline';
        return 'account';
    };

    return (
        <TouchableRipple>
            <View style={styles.scoreRow}>
                <View style={[styles.rankBadge, getPlayerRankStyle(index)]}>
                    <Icon
                        name={getPlayerRankIcon(index)}
                        size={18}
                        color="white"
                    />
                    <Text style={styles.rankText}>{index + 1}</Text>
                </View>

                <Text style={[styles.playerName, { color: colors.text }]}>
                    {username}
                </Text>

                <Text style={styles.playerScore}>
                    {score} {t("bingoGame.point")}
                </Text>
            </View>
        </TouchableRipple>
    );
};

export default ScoreRow;