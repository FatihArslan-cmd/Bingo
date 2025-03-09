import React from 'react';
import { View, StyleSheet, StatusBar, SafeAreaView } from 'react-native'; // SafeAreaView import edildi
import BingoCard from 'bingo/src/pages/BingoGamePage/components/BingoCard';
import DrawButton from 'bingo/src/pages/BingoGamePage/components/DrawButton';
import Countdown from 'bingo/src/pages/BingoGamePage/components/CountDown';
import DrawnNumbersPanel from 'bingo/src/pages/BingoGamePage/components/DrawnNumbersPanel';
import UserListPanel from 'bingo/src/pages/BingoGamePage/components/UserList';
import LogoutButton from 'bingo/src/pages/BingoGamePage/components/LogoutButton';
import useDisableBackButton from '../../../../../src/pages/HomeScreen/hooks/useDisableBackButton';
import EmojiButton from 'bingo/src/pages/BingoGamePage/components/EmojiButon';
import EmojiPanel from 'bingo/src/pages/BingoGamePage/components/EmojiPanel';
import AnimatedEmoji from 'bingo/src/pages/BingoGamePage/components/AnimatedEmoji';
import MessageComponent from 'bingo/src/pages/BingoGamePage/components/MessageComponent';
import LastMessage from 'bingo/src/pages/BingoGamePage/components/LastMessage';
import { ChinkoMessage } from 'bingo/src/pages/BingoGamePage/components/ChinkoMessage';
const BingoGamePage = () => {
    useDisableBackButton();

    return (
        <SafeAreaView style={styles.safeAreaContainer}> 
            <StatusBar barStyle="transparent"/>
            <ChinkoMessage/>
            <LastMessage/>
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

            <MessageComponent/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaContainer: { 
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
        marginBottom: 20,
    },
    emojiButtonContainer: {
        position: 'absolute',
        right: 20,
        top: '80%',
        zIndex: 10,
    },
});

export default BingoGamePage;