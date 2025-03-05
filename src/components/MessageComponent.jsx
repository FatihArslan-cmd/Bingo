import React, { useState, useCallback, useEffect, useContext } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Dimensions, View, Image } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Surface,
  TextInput,
  Card,
  IconButton
} from 'react-native-paper';
import { BlurView } from '@react-native-community/blur';
import { BingoContext } from 'bingo/src/context/BingoGameContext';

const { height } = Dimensions.get('window');

const MessageComponent = () => { 
    const { isMessageModalVisible, closeMessageModal ,handleNewMessage} = useContext(BingoContext); // Using context values
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hey, good luck in this round!',
      sender: 'Player 1',
      timestamp: '2m ago',
      profilePic: 'https://example.com/player1.jpg'
    },
    {
      id: '2',
      text: 'Thanks! Let\'s win this bingo!',
      sender: 'Player 2',
      timestamp: '1m ago',
      profilePic: 'https://example.com/player2.jpg'
    }
  
  ]);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (messages.length > 0) {
        handleNewMessage(messages[0].text); // Call onNewMessage with the latest message text
    } else {
        handleNewMessage(''); // Or handle case when there are no messages, e.g., pass empty string
    }
  }, [messages, handleNewMessage]); // useEffect dependency on messages and onNewMessage

  const sendMessage = useCallback(() => {
    if (currentMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: currentMessage,
        sender: 'You',
        timestamp: 'Just now',
        profilePic: 'https://example.com/you.jpg'
      };
      setMessages(prevMessages => [newMessage, ...prevMessages]);
      setCurrentMessage('');
    }
  }, [currentMessage]);

  const renderMessage = useCallback(({ item }) => (
    <View style={styles.messageContainer}>
      <Image
        style={styles.profileImage}
        source={require('../../../../src/locales/gameImages/adventureQuestImage.jpg')}
      />
      <Card style={styles.messageCard}>
        <View style={styles.messageContentContainer}>
          <Text variant="bodyMedium" style={styles.senderName}>{item.sender}</Text>
          <Text variant="bodyMedium" style={styles.messageText}>{item.text}</Text>
          <Text variant="bodySmall" style={styles.messageTimestamp}>
            {item.timestamp}
          </Text>
        </View>
      </Card>
    </View>
  ), []);

  return (
    <Portal>
      <Modal
        visible={isMessageModalVisible} // Using context value for visibility
        onDismiss={closeMessageModal} // Using context function for dismiss
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
              onPress={closeMessageModal} // Using context function for closing
              iconColor={'white'}
              style={styles.closeButton}
            />
          </View>

          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            inverted
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
            <TouchableOpacity
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
            </TouchableOpacity>
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
};

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
    justifyContent: 'flex-end',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageCard: {
    flex: 1,
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