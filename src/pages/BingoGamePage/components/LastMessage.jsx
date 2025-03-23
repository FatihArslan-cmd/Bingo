import React, { useContext, memo, useCallback } from 'react';
import { TouchableRipple, Surface, IconButton, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext';
import { useTheme } from '../../../../../../src/context/ThemeContext';
import {useTranslation} from 'react-i18next';

const LastMessage = memo(() => {
    const { openMessageModal, lastMessage } = useContext(BingoContext);
    const { colors } = useTheme();
    const {t} = useTranslation();

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
                            {lastMessage || t('bingoGame.noMessages')}
                        </Text>
                    </View>
                </Surface>
                <IconButton
                    icon="message-text-outline"
                    iconColor={colors.text}
                    size={24}
                    style={[styles.messageIcon, { backgroundColor: colors.card }]}
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
        overflow: 'hidden', 
    },
    textBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 5, 
        paddingHorizontal: 10, 
        paddingVertical: 6,
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