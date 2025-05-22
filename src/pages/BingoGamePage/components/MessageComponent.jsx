import React, { memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import { BingoContext } from "bingo/src/context/BingoGameContext";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";

import {
    Modal,
    Portal,
    Text,
    Surface,
    TextInput,
    Card,
    IconButton,
    TouchableRipple
} from 'react-native-paper';

const { height } = Dimensions.get('window');

const MessageComponent = memo(() => {
    const { isMessageModalVisible, closeMessageModal, chatMessages, sendChatMessageContext } = useContext(BingoContext);
    const [currentMessage, setCurrentMessage] = useState('');
    const flatListRef = useRef(null);

    const sendMessage = useCallback(() => {
        if (currentMessage.trim()) {
            sendChatMessageContext(currentMessage);
            setCurrentMessage('');
        }
    }, [currentMessage, sendChatMessageContext]);

    const renderMessage = useCallback(({ item }) => {
        return (
            <View style={styles.messageContainer}>
                 {item.message ? (
                    <Card style={styles.messageCard}>
                        <View style={styles.messageContentContainer}>
                            <Text variant="bodyMedium" style={styles.senderName}>{item.username || 'Unknown Sender'}</Text>
                            <Text variant="bodyMedium" style={styles.messageText}>{item.message}</Text>
                            <Text variant="bodySmall" style={styles.messageTimestamp}>
                                {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'No timestamp'}
                            </Text>
                        </View>
                    </Card>
                ) : null}
            </View>
        );
    }, []);

    useEffect(() => {
        if (chatMessages.length > 0 && flatListRef.current) {
            setTimeout(() => {
                flatListRef.current.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [chatMessages]);


    return (
        <Portal>
            <Modal
                visible={isMessageModalVisible}
                onDismiss={closeMessageModal}
                contentContainerStyle={styles.modalContainer}
                style={styles.modalStyle}
            >
                <View style={[styles.absolute, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />

                <Surface style={styles.modalContent} elevation={4}>
                    <View style={styles.headerContainer}>
                        <IconButton
                            icon="close"
                            size={24}
                            onPress={closeMessageModal}
                            iconColor={'white'}
                            style={styles.closeButton}
                        />
                    </View>

                    <FlatList
                        ref={flatListRef}
                        data={chatMessages}
                        renderItem={renderMessage}
                        keyExtractor={(item, index) => `${item.userId}-${index}`}
                        contentContainerStyle={styles.messageList}
                        showsVerticalScrollIndicator={false}
                        inverted={false}
                        onContentSizeChange={() => {
                            if (chatMessages.length > 0 && flatListRef.current) {
                                flatListRef.current.scrollToEnd({ animated: false });
                            }
                        }}
                    />

                    <View style={styles.inputContainer}>
                        <TextInput
                            mode="outlined"
                            placeholder="Type a message"
                            value={currentMessage}
                            onChangeText={setCurrentMessage}
                            style={styles.messageInput}
                            contentStyle={styles.messageInputContent}
                        />
                        <TouchableRipple
                            onPress={sendMessage}
                            disabled={!currentMessage.trim()}
                            style={[
                                styles.sendButton,
                                !currentMessage.trim() && styles.sendButtonDisabled
                            ]}
                        >
                            <IconButton
                                icon="send"
                                iconColor={!currentMessage.trim() ? '#999' : 'white'}
                                size={24}
                            />
                        </TouchableRipple>
                    </View>
                </Surface>
            </Modal>
        </Portal>
    );
});

const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalStyle: {
        backgroundColor: 'transparent',
    },
    modalContent: {
        height: height * 0.50,
        backgroundColor: 'rgba(65, 65, 65, 0.8)',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    headerContainer: {
        alignItems: 'flex-end',
    },
    closeButton: {
        margin: 5,
    },
    messageList: {
        paddingBottom: 10,
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingHorizontal: 5,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 5,
        width: '100%',
    },
    messageCard: {
        flex: 1,
        borderRadius: 15,
        padding: 8,
        backgroundColor: '#fff',
    },
    messageContentContainer: {
        flexDirection: 'column',
    },
    senderName: {
        fontFamily: 'Orbitron-ExtraBold',
        marginBottom: 3,
        color: '#333',
        fontSize: 13,
    },
    messageText: {
        color: '#333',
        marginBottom: 3,
        fontFamily: 'Orbitron-ExtraBold',
        fontSize: 14,
    },
    messageTimestamp: {
        color: '#888',
        fontSize: 10,
        fontFamily: 'Orbitron-ExtraBold',
        alignSelf: 'flex-end',
        marginTop: 3,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 5,
    },
    messageInput: {
        flex: 1,
        marginRight: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        height: 45,
        borderColor: 'transparent',
    },
    messageInputContent: {
        textAlignVertical: 'center',
        paddingVertical: 0,
        paddingHorizontal: 15,
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: 'blue',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
        opacity: 1,
    },
});

export default MessageComponent;