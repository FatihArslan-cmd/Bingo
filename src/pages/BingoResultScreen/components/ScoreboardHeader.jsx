import React from 'react';
import GrandientText from '../../../../../../src/components/GrandientText';
import { useTheme } from '../../../../../../src/context/ThemeContext';

const ScoreboardHeader = () => {
    const { colors } = useTheme();
    return (
           <GrandientText
                     text="Skor Tablosu"
                     colors={colors.gameCenterText}
                     textStyle={{ fontSize: 28 }}
                     gradientDirection="horizontal"
                 />
    );
};

export default ScoreboardHeader;