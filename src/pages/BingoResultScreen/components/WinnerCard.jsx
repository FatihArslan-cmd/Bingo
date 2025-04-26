import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import styles from "bingo/src/pages/BingoResultScreen/styles/styles";
import { Avatar, Badge, Card, Text } from "react-native-paper";
import { useTheme } from "../../../../../../src/context/ThemeContext";

const WinnerCard = ({ bingoWinnerUsername, gameScores }) => {
    const { colors } = useTheme();
    return (
        <Card style={[styles.winnerCard,{backgroundColor:colors.card}]}>
            <Card.Content style={styles.winnerCardContent}>
                <Icon name="crown" size={40} color="#FFD700" />
                <Text style={styles.bingoWinnerTitle}>Bingo Yapan</Text>
                <Text style={[styles.winnerName,{color:colors.text}]}>{bingoWinnerUsername}</Text>
                <Badge style={styles.winnerBadge}>
                    <Icon name="star" size={16} color="#fff" />
                    <Text style={[styles.winnerBadgeText,{color:'white'}]}>
                        {gameScores[bingoWinnerUsername]} Puan
                    </Text>
                </Badge>
            </Card.Content>
        </Card>
    );
};

export default WinnerCard;