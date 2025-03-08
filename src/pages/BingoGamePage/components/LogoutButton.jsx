import React , {  useState, useCallback } from 'react'; // useCallback import edildi
import { StyleSheet, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomModal from '../../../../../../src/components/CustomModal';
import api from '../../../../../../src/shared/states/api';
import { getToken } from '../../../../../../src/shared/states/api';
import { useNavigation } from '@react-navigation/native';

const LogoutButton = () => {

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogoutConfirmation = useCallback(() => { // useCallback ile sarıldı
    setIsLogoutModalVisible(true);
  }, [setIsLogoutModalVisible]); // Bağımlılık dizisine setIsLogoutModalVisible eklendi

  const handleLogout = useCallback(async () => { // useCallback ile sarıldı
    setIsLogoutModalVisible(false);
    try {
      const token = await getToken();
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      await api.post('/lobby/end-game', {}, { headers });
      console.log("End game request sent on logout with headers");
      // Başarılı logout durumunda yapılacak işlemler
    } catch (error) {
      console.error("Error ending game on logout:", error);
      if (error.response && error.response.status === 403) {
        console.log("403 hatası alındı, Tabs sayfasına yönlendiriliyor.");
        navigation.navigate('Tabs');
      } else {
        // Diğer hatalar için genel hata işleme
        console.error("Logout sırasında beklenmeyen bir hata oluştu:", error);
      }
    }
  }, [setIsLogoutModalVisible, navigation]); // Bağımlılık dizisine setIsLogoutModalVisible ve navigation eklendi

  const handleCancelLogout = useCallback(() => { // useCallback ile sarıldı
    setIsLogoutModalVisible(false);
  }, [setIsLogoutModalVisible]); // Bağımlılık dizisine setIsLogoutModalVisible eklendi

  return (
    <>
      <TouchableRipple style={styles.logoutButton} onPress={handleLogoutConfirmation}>
        <View style={styles.iconContainer}>
          <Icon name="logout" size={24} color="#333" />
        </View>
      </TouchableRipple>

      <CustomModal
        visible={isLogoutModalVisible}
        onDismiss={handleCancelLogout}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        text="Are you sure you want to log out?"
        confirmText="Logout"
        showConfirmButton={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
    logoutButton: {
        padding: 10,
    },
    iconContainer: {
        borderRadius: 20,
        padding: 10,
    },
});

export default LogoutButton;