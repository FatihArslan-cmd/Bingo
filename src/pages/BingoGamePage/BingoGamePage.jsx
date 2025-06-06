import AnimatedEmoji from "bingo/src/pages/BingoGamePage/components/AnimatedEmoji";
import BingoCard from "bingo/src/pages/BingoGamePage/components/BingoCard";
import Countdown from "bingo/src/pages/BingoGamePage/components/CountDown";
import DrawAllNumbersButton from "bingo/src/pages/BingoGamePage/components/DrawAllNumbersButton";
import DrawButton from "bingo/src/pages/BingoGamePage/components/DrawButton";
import DrawnNumbersPanel from "bingo/src/pages/BingoGamePage/components/DrawnNumbersPanel";
import EmojiButton from "bingo/src/pages/BingoGamePage/components/EmojiButon";
import EmojiPanel from "bingo/src/pages/BingoGamePage/components/EmojiPanel";
import LastMessage from "bingo/src/pages/BingoGamePage/components/LastMessage";
import LogoutButton from "bingo/src/pages/BingoGamePage/components/LogoutButton";
import MessageComponent from "bingo/src/pages/BingoGamePage/components/MessageComponent";
import React from "react";
import UserListPanel from "bingo/src/pages/BingoGamePage/components/UserList";
import useDailyPlayDuration from "bingo/src/pages/BingoGamePage/hooks/useDailyPlayDuration";
import useDisableBackButton from "../../../../../src/pages/HomeScreen/hooks/useDisableBackButton";
import { ChinkoMessage } from "bingo/src/pages/BingoGamePage/components/ChinkoMessage";
import { useTheme } from "../../../../../src/context/ThemeContext";

import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
    useWindowDimensions,
} from "react-native";

const BingoGamePage = () => {
    useDisableBackButton();
    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();

    const isLandscape = width > height;

    useDailyPlayDuration('bingo');

    return (
        <SafeAreaView style={[styles.safeAreaContainer, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="transparent" />
            <ChinkoMessage />
            <LastMessage />
            <View style={styles.header}>
                <View style={styles.userPanelContainer}>
                    <UserListPanel />
                </View>
                <View style={styles.logoutButtonContainer}>
                    <LogoutButton />
                </View>
            </View>

            <Countdown />
            <View style={[
                styles.contentContainer,
                { marginTop: isLandscape ? 100 : 50 }
            ]}>
                <DrawButton />
                <BingoCard />
            </View>

            <View style={styles.emojiButtonContainer}>
                <EmojiButton />
                <AnimatedEmoji />
            </View>
            <DrawAllNumbersButton />
            <EmojiPanel />
            <DrawnNumbersPanel />
            <MessageComponent />

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        position: 'absolute',
        top: 0,
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