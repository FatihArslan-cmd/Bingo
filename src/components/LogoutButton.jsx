import React , { useContext, useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomModal from '../../../../src/components/CustomModal';
import api from '../../../../src/shared/states/api';
import { getToken } from '../../../../src/shared/states/api';
import { useNavigation } from '@react-navigation/native'; // useNavigation'ı import et

const LogoutButton = () => {

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const navigation = useNavigation(); // navigation nesnesini al

  const handleLogoutConfirmation = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogout = async () => {
    setIsLogoutModalVisible(false);
    try {
      const token = await getToken();
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      await api.post('/lobby/end-game', {}, { headers });
      console.log("End game request sent on logout with headers");
      // Başarılı logout durumunda yapılacak işlemler (isteğe bağlı, belki başka bir sayfaya yönlendirme vb.)
    } catch (error) {
      console.error("Error ending game on logout:", error);
      if (error.response && error.response.status === 403) {
        console.log("403 hatası alındı, Tabs sayfasına yönlendiriliyor.");
        navigation.navigate('Tabs'); // 403 hatası durumunda Tabs sayfasına git
      } else {
        // Diğer hatalar için genel hata işleme (isteğe bağlı)
        console.error("Logout sırasında beklenmeyen bir hata oluştu:", error);
        // Belki kullanıcıya bir hata mesajı gösterme
      }
    }
  };

  const handleCancelLogout = () => {
    setIsLogoutModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutConfirmation}>
        <View style={styles.iconContainer}>
          <Icon name="logout" size={24} color="#333" />
        </View>
      </TouchableOpacity>

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