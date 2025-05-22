import GrandientText from "../../../../../../src/components/GrandientText";
import React from "react";
import { useTheme } from "../../../../../../src/context/ThemeContext";
import { isTablet } from "../../../../../../src/utils/isTablet";

const TABLET_DEVICE = isTablet();

const ScoreboardHeader = () => {
    const { colors } = useTheme();
    return (
           <GrandientText
                     text="Skor Tablosu"
                     colors={colors.gameCenterText}
                     textStyle={{ fontSize: TABLET_DEVICE ? 28 : 20 }}
                     gradientDirection="horizontal"
                 />
    );
};

export default ScoreboardHeader;