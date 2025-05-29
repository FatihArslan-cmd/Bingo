import CustomModal from "../../../../../../src/components/CustomModal";
import Icon from "react-native-vector-icons/MaterialIcons";
import React , { useCallback, useState } from "react";
import api from "../../../../../../src/shared/states/api";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { useTheme } from "../../../../../../src/context/ThemeContext";
import { getToken } from "../../../../../../src/shared/states/api";
import { isTablet } from "../../../../../../src/utils/isTablet";

const TABLET_DEVICE = isTablet();

const LogoutButton = () => {
  const { colors } = useTheme();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleLogoutConfirmation = useCallback(() => { 
    setIsLogoutModalVisible(true);
  }, [setIsLogoutModalVisible]);

  const handleLogout = useCallback(async () => { 
    setIsLogoutModalVisible(false);
    try {
      const token = await getToken();
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      await api.post('/lobby/end-game', {}, { headers });
    } catch (error) {
      if (error.response && (error.response.status === 403 || error.response.status === 400)) {
        navigation.navigate('Tabs');
      } 
    }
  }, [setIsLogoutModalVisible, navigation]); 

  const handleCancelLogout = useCallback(() => { 
    setIsLogoutModalVisible(false);
  }, [setIsLogoutModalVisible]);

  return (
    <>
      <TouchableRipple style={styles.logoutButton} onPress={handleLogoutConfirmation}>
        <View style={styles.iconContainer}>
          <Icon name="logout" size={TABLET_DEVICE ? 24 : 18} color={colors.text} />
        </View>
      </TouchableRipple>

      <CustomModal
        visible={isLogoutModalVisible}
        onDismiss={handleCancelLogout}
        onConfirm={handleLogout}
        title={t('bingoGame.logoutTitle')}
        text={t('bingoGame.logoutDescription')}
        confirmText={t('bingoGame.logout')}
        showConfirmButton={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
    logoutButton: {
        paddingTop: 25,
    },
    iconContainer: {
        borderRadius: 55,
        padding: 10,
    },
});

export default LogoutButton;