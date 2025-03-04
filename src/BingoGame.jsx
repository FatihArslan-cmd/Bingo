import React, { useContext } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import BingoCard from './components/BingoCard';
import DrawButton from './components/DrawButton';
import Countdown from './components/CountDown';
import DrawnNumbersPanel from './components/DrawnNumbersPanel';
import UserListPanel from 'bingo/src/components/UserList';
import LogoutButton from './components/LogoutButton';
import useDisableBackButton from '../../../src/pages/HomeScreen/hooks/useDisableBackButton';
import EmojiButton from 'bingo/src/components/EmojiButon';
import EmojiPanel from 'bingo/src/components/EmojiPanel';
import AnimatedEmoji from 'bingo/src/components/AnimatedEmoji';
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
      <View style={styles.emojiButtonContainer}>
        <EmojiButton />
        <AnimatedEmoji />
      </View>
      <EmojiPanel />
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
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  userPanelContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logoutButtonContainer: {
    alignItems: 'flex-end',
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20, // Reduced marginBottom to give space for EmojiButton
  },
  emojiButtonContainer: {
    position: 'absolute',
    right: 20, // Align to the right side with some margin
    top: '80%', // Vertically center (approximately, needs adjustment)
    zIndex: 10, // Ensure it's above other elements if needed
  },
});

export default BingoGame;