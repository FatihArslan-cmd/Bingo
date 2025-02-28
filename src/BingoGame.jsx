import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import BingoCard from './components/BingoCard';
import DrawButton from './components/DrawButton';
import Countdown from './components/CountDown';
import DrawnNumbersPanel from './components/DrawnNumbersPanel';
import UserListPanel from './components/UserList'; // Corrected component name
import LogoutButton from './components/LogoutButton';
import useDisableBackButton from '../../../src/pages/HomeScreen/hooks/useDisableBackButton';
import { BingoContextProvider } from 'bingo/src/context/BingoGameContext';

const BingoGame = () => {
  useDisableBackButton();

  return (
    <BingoContextProvider>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <View style={styles.userPanelContainer}>
                    <UserListPanel />
                </View>
                <View style={styles.logoutButtonContainer}>
                    <LogoutButton />
                </View>
            </View>
            <Countdown />

          <View style={styles.contentContainer}>
            <DrawButton />
            <BingoCard />
          </View>
            <DrawnNumbersPanel />
        </View>
    </BingoContextProvider>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Changed alignItems to flex-start
        paddingHorizontal: 10,
    },
    userPanelContainer: {
        flex: 1, // Allow UserListPanel to take available space
        alignItems: 'flex-start', // Align to the start
    },
    logoutButtonContainer: {
        alignItems: 'flex-end', // Align LogoutButton to the end
    },
    leftIcons: {
      flexDirection: 'row',
    },
    iconButton: {
        padding: 10,
    },
    contentContainer: {
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 50,
      },
  button: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default BingoGame;