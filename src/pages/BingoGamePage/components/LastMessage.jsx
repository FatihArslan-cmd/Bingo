import React, { memo, useCallback, useContext } from "react";
import { BingoContext } from "bingo/src/context/BingoGameContext";
import { StyleSheet, View } from "react-native";
import { IconButton, Surface, Text, TouchableRipple } from "react-native-paper";
import { useTheme } from "../../../../../../src/context/ThemeContext";
import { isTablet } from "../../../../../../src/utils/isTablet";

const TABLET_DEVICE = isTablet();

const LastMessage = memo(() => {
    const { openMessageModal, lastMessage } = useContext(BingoContext);
    const { colors } = useTheme();
    const handlePress = useCallback(() => {
        openMessageModal();
    }, [openMessageModal]);

    return (
        <TouchableRipple
            onPress={handlePress}
            borderless={true}
            style={styles.messageTouchable}
        >
            <View style={styles.messageContainer}>
                <Surface style={[styles.messagePreview, { backgroundColor: colors.card }]}>
                    <View style={styles.textBackground}> 
                        <Text numberOfLines={1} style={[styles.lastMessageText, { color: colors.text }]}>
                            {lastMessage || 'No messages yet'}
                        </Text>
                    </View>
                </Surface>
                <IconButton
                    icon="message-text-outline"
                    iconColor={colors.text}
                    size={TABLET_DEVICE ? 24 : 16}
                    style={[styles.messageIcon, { backgroundColor: colors.card }]}
                />
            </View>
        </TouchableRipple>
    );
});

const styles = StyleSheet.create({
    messageTouchable: {
        position: 'absolute',
        top: 25,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
        borderRadius: 20,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messagePreview: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        maxWidth: 200,
        overflow: 'hidden', 
    },
    textBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 5, 
        paddingHorizontal: TABLET_DEVICE ? 10 : 6, 
        paddingVertical: TABLET_DEVICE ? 6 : 4,
    },
    lastMessageText: {
        color: '#333',
        fontSize: TABLET_DEVICE ? 12 : 9,
        fontFamily: 'Orbitron-ExtraBold',
    },
    messageIcon: {
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        zIndex: 20,
    },
});

LastMessage.displayName = 'LastMessage';
export default LastMessage;