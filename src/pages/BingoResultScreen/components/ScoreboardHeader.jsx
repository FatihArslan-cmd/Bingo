import React from 'react';
import GrandientText from '../../../../../../src/components/GrandientText';
import { useTheme } from '../../../../../../src/context/ThemeContext';
import {useTranslation} from 'react-i18next';

const ScoreboardHeader = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
           <GrandientText
                     text={t('bingoGame.scoreBoard')}
                     colors={colors.gameCenterText}
                     textStyle={{ fontSize: 28 }}
                     gradientDirection="horizontal"
                 />
    );
};

export default ScoreboardHeader;