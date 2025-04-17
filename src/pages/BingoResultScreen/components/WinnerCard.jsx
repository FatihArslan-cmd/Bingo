import React from 'react';
import { Text, Avatar, Card, Badge } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from 'bingo/src/pages/BingoResultScreen/styles/styles';
import { useTheme } from '../../../../../../src/context/ThemeContext';
import {useTranslation} from 'react-i18next';

const WinnerCard = ({ bingoWinnerUsername, gameScores }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <Card style={[styles.winnerCard,{backgroundColor:colors.card}]}>
            <Card.Content style={styles.winnerCardContent}>
                <Icon name="crown" size={40} color="#FFD700" />
                <Text style={styles.bingoWinnerTitle}>
                    {t('bingoGame.winner')}
                </Text>
                <Text style={[styles.winnerName,{color:colors.text}]}>{bingoWinnerUsername}</Text>
                <Badge style={styles.winnerBadge}>
                    <Icon name="star" size={16} color="#fff" />
                    <Text style={[styles.winnerBadgeText,{color:colors.text}]}>
                        {gameScores[bingoWinnerUsername]} {t('bingoGame.point')}
                    </Text>
                </Badge>
            </Card.Content>
        </Card>
    );
};

export default WinnerCard;