import React from "react";
import ScoreRow from "bingo/src/pages/BingoResultScreen/components/ScoreRow";
import styles from "bingo/src/pages/BingoResultScreen/styles/styles";
import { ScrollView } from "react-native";

const ScoreList = ({ gameScores }) => {
    const sortedScores = Object.entries(gameScores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

    return (
        <ScrollView style={styles.scoresScrollView}>
            {sortedScores.map(([username, score], index) => (
                <ScoreRow key={username} username={username} score={score} index={index} />
            ))}
        </ScrollView>
    );
};

export default ScoreList;