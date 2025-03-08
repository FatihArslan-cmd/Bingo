import React from 'react';
import { Text, Avatar, Card, Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from 'bingo/src/pages/BingoResultScreen/styles/styles';

const WinnerCard = ({ bingoWinnerUsername, gameScores }) => {
    return (
        <Card style={styles.winnerCard}>
            <Card.Content style={styles.winnerCardContent}>
                <Icon name="crown" size={40} color="#FFD700" />
                <Text style={styles.bingoWinnerTitle}>Bingo Yapan</Text>
                <Text style={styles.winnerName}>{bingoWinnerUsername}</Text>
                <Badge style={styles.winnerBadge}>
                    <Icon name="star" size={16} color="#fff" />
                    <Text style={styles.winnerBadgeText}>
                        {gameScores[bingoWinnerUsername]} Puan
                    </Text>
                </Badge>
            </Card.Content>
        </Card>
    );
};

export default WinnerCard;