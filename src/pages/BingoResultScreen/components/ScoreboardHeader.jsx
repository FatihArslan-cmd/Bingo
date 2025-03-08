import React from 'react';
import GrandientText from '../../../../../../src/components/GrandientText';

const ScoreboardHeader = () => {
    return (
           <GrandientText
                     text="Skor Tablosu"
                     colors={['#4A00E0', '#FF8C00']}
                     textStyle={{ fontSize: 28 }}
                     gradientDirection="horizontal"
                 />
    );
};

export default ScoreboardHeader;