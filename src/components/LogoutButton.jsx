import React , { useContext, useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomModal from '../../../../src/components/CustomModal';
import api from '../../../../src/shared/states/api';
import { getToken } from '../../../../src/shared/states/api';
const LogoutButton = () => {

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleLogoutConfirmation = () => {
    setIsLogoutModalVisible(true);
  };

  const handleLogout = async () => {
    setIsLogoutModalVisible(false); // Close the modal first
    try {
      const token = await getToken(); // Get the token
      const headers = {
        'Authorization': `Bearer ${token}`, // Include bearer token
        'Content-Type': 'application/json', // Set content type
      };
      await api.post('/lobby/end-game', {}, { headers }); // Call the end game endpoint with headers
      console.log("End game request sent on logout with headers");
    } catch (error) {
      console.error("Error ending game on logout:", error);
      // Handle error appropriately, maybe show an alert to the user
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