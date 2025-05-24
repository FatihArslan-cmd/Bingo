import React from "react";
import ScoreList from "bingo/src/pages/BingoResultScreen/components/ScoreList";
import ScoreboardHeader from "bingo/src/pages/BingoResultScreen/components/ScoreboardHeader";
import getStyles from "bingo/src/pages/BingoResultScreen/styles/getStyles";
import { Card, Divider } from "react-native-paper";
import { useTheme } from "../../../../../../src/context/ThemeContext";

const ScoresCard = ({ gameScores }) => {
    const { colors } = useTheme();
    const styles = getStyles();
    
    return (
        <Card style={[styles.scoresCard,{backgroundColor:colors.card}]}>
            <ScoreboardHeader />
            <Divider />
            <Card.Content>
                <ScoreList gameScores={gameScores} />
            </Card.Content>
        </Card>
    );
};

export default ScoresCard;