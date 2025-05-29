import GrandientText from "../../../../../../src/components/GrandientText";
import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../../../src/context/ThemeContext";
import { isTablet } from "../../../../../../src/utils/isTablet";

const TABLET_DEVICE = isTablet();

const ScoreboardHeader = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
           <GrandientText
                     text={t("bingoGame.scoreBoard")}
                     colors={colors.gameCenterText}
                     textStyle={{ fontSize: TABLET_DEVICE ? 28 : 20 }}
                     gradientDirection="horizontal"
                 />
    );
};

export default ScoreboardHeader;