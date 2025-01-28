// components/LogoutButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'; // AntDesign ikonlarını kullanacağız

const LogoutButton = () => {

  const handleLogout = () => {
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <View style={styles.iconContainer}>
        <Icon name="logout" size={24} color="#333" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    logoutButton: {
        padding: 10,
    },
    iconContainer: {
        borderRadius: 20,
        padding: 8,
    },
});

export default LogoutButton;