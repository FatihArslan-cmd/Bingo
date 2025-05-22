import CustomModal from "../../../../../../src/components/CustomModal";
import React, { useCallback, useContext, useState } from "react";
import { BingoContext } from "bingo/src/context/BingoGameContext";
import { useTranslation } from "react-i18next";
import { IconButton } from "react-native-paper";
import { useTheme } from "../../../../../../src/context/ThemeContext";
import { isTablet } from "../../../../../../src/utils/isTablet.js";

const TABLET_DEVICE = isTablet();

const DrawAllNumbersButton = ({ style }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { drawAllRemainingNumbers } = useContext(BingoContext);
  const { t } = useTranslation();
  const { colors } = useTheme();

  const openModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleConfirmDrawAll = useCallback(() => {
    if (drawAllRemainingNumbers) {
      drawAllRemainingNumbers();
    }
    closeModal();
  }, [drawAllRemainingNumbers, closeModal]);

  return (
    <>
      <IconButton
        icon="dice-multiple-outline"
        size={TABLET_DEVICE ? 30 : 24}
        iconColor={colors.primary}
        onPress={openModal}
        style={style}
        accessibilityLabel={t('bingoGame.drawAllNumbersButtonLabel')}
      />
      <CustomModal
        visible={isModalVisible}
        onDismiss={closeModal}
        onConfirm={handleConfirmDrawAll}
        title={t('bingoGame.drawAllNumbersModalTitle')}
        text={t('bingoGame.drawAllNumbersModalText')}
        confirmText={t('bingoGame.drawAllNumbersModalConfirm')}
        showConfirmButton={true}
      />
    </>
  );
};

export default DrawAllNumbersButton;