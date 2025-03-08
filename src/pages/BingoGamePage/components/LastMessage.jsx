import React, { useContext, memo, useCallback } from 'react';
import { TouchableRipple, Surface, IconButton, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext';

const LastMessage = memo(() => {
    const { openMessageModal, lastMessage } = useContext(BingoContext);

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
                <Surface style={styles.messagePreview}>
                    <Text numberOfLines={1} style={styles.lastMessageText}>
                        {lastMessage || 'No messages yet'}
                    </Text>
                </Surface>
                <IconButton
                    icon="message-text-outline"
                    size={24}
                    style={styles.messageIcon}
                />
            </View>
        </TouchableRipple>
    );
});

const styles = StyleSheet.create({
    messageTouchable: {
        position: 'absolute',
        top: 45,
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
        marginRight: 10,
        maxWidth: 200,
    },
    lastMessageText: {
        color: '#333',
        fontSize: 12,
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