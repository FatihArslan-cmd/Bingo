import React from 'react';
import { Card, Divider } from 'react-native-paper';
import ScoreboardHeader from 'bingo/src/pages/BingoResultScreen/components/ScoreboardHeader';
import ScoreList from 'bingo/src/pages/BingoResultScreen/components/ScoreList';
import styles from 'bingo/src/pages/BingoResultScreen/styles/styles';

const ScoresCard = ({ gameScores }) => {
    return (
        <Card style={styles.scoresCard}>
            <ScoreboardHeader />
            <Divider />
            <Card.Content>
                <ScoreList gameScores={gameScores} />
            </Card.Content>
        </Card>
    );
};

export default ScoresCard;