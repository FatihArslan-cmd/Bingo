import React, { useState, useCallback, useEffect, useContext, useRef, memo } from 'react';
import { StyleSheet, FlatList, Dimensions, View, Image } from 'react-native';
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
import { BlurView } from '@react-native-community/blur';
import { BingoContext } from 'bingo/src/context/BingoGameContext';

const { height } = Dimensions.get('window');

const MessageComponent = memo(() => { // 1. Memoize the entire MessageComponent
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
                <Image
                    style={styles.profileImage}
                    source={item.profilePhoto}
                />
                <Card style={styles.messageCard}>
                    <View style={styles.messageContentContainer}>
                        <Text variant="bodyMedium" style={styles.senderName}>{item.username || 'Unknown Sender'}</Text>
                        <Text variant="bodyMedium" style={styles.messageText}>{item.message}</Text>
                        <Text variant="bodySmall" style={styles.messageTimestamp}>
                            {new Date(item.timestamp).toLocaleTimeString()}
                        </Text>
                    </View>
                </Card>
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
                <BlurView
                    style={styles.absolute}
                    blurType="light"
                    blurAmount={5}
                    reducedTransparencyFallbackColor="white"
                />

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
                        keyExtractor={(item, index) => item.userId + index.toString()}
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
                            placeholderTextAlign="center"
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
}); // Close memo HOC

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
        backgroundColor: 'rgba(65, 65, 65, 0.5)',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        display: 'flex',
        flexDirection: 'column',
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
        alignItems: 'stretch', // Ensure messages stretch to container width
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 10,
        width: '100%', // Take full width of the FlatList item
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    messageCard: {
        flex: 1, // Allow message card to grow and take available space
        borderRadius: 25,
        padding: 10,
    },
    messageContentContainer: {
        flexDirection: 'column',
    },
    senderName: {
        fontFamily: 'Orbitron-ExtraBold',
        marginBottom: 5,
        color: '#333',
    },
    messageText: {
        color: '#333',
        marginBottom: 5,
        fontFamily: 'Orbitron-ExtraBold',
    },
    messageTimestamp: {
        color: '#888',
        fontSize: 12,
        fontFamily: 'Orbitron-ExtraBold',
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    messageInput: {
        flex: 1,
        marginRight: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        height: 40,
        borderColor: 'red',
    },
    messageInputContent: {
        textAlignVertical: 'center',
        paddingVertical: 0,
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});

export default MessageComponent;