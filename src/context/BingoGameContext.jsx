import React, { createContext, useState, useEffect } from 'react'; // Import useContext
import generateTombalaCard from '../utils/CardGenerator';
import { useBingoWebSocket } from '../../../../src/context/BingoGameWebsocket.js';

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF3', '#FF8C33', '#8C33FF', '#33A1FF'];

export const BingoContext = createContext();

export const BingoContextProvider = ({ children }) => {
    const [card, setCard] = useState(generateTombalaCard());
    const [bgColor, setBgColor] = useState(COLORS[Math.floor(Math.random() * COLORS.length)]);
    const [drawnNumbers, setDrawnNumbers] = useState([]);
    const [currentNumber, setCurrentNumber] = useState(null);
    const [markedNumbers, setMarkedNumbers] = useState({});
    const [drawNumberEnabled, setDrawNumberEnabled] = useState(true);
    const [countdown, setCountdown] = useState(6);
    const [isCountingDown, setIsCountingDown] = useState(false);

    // Emoji states
    const [isEmojiPanelVisible, setEmojiPanelVisible] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [emojis] = useState(['👍', '🔥', '💯', '🍀', '🚀']);
    const [emojiAnimationTrigger, setEmojiAnimationTrigger] = useState(0);
    const [isEmojiAnimating, setIsEmojiAnimating] = useState(false);
    const [displayEmojis, setDisplayEmojis] = useState(true); // New state to control emoji display

    const { sendMessage, messages } = useBingoWebSocket(); // Get sendMessage and messages from WebSocket Context

    useEffect(() => {
        let intervalId;
        if (isCountingDown) {
            intervalId = setInterval(() => {
                setCountdown((prevCount) => {
                    if (prevCount <= 1) {
                        clearInterval(intervalId);
                        setIsCountingDown(false);
                        setTimeout(() => {
                            setDrawNumberEnabled(true);
                            setCountdown(6);
                        }, 250);
                        return 0;
                    }
                    return prevCount - 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalId);
    }, [isCountingDown]);

    useEffect(() => {
        // Get all 'number-drawn' messages and select the latest one
        const numberDrawnMessages = messages.filter(msg => msg.type === 'number-drawn');
        const latestMessage = numberDrawnMessages[numberDrawnMessages.length - 1];
        
        if (latestMessage) {
            setCurrentNumber(latestMessage.number);
            // Use the full drawnNumbers array from server instead of appending
            setDrawnNumbers(latestMessage.drawnNumbers);
            startCountdownFromMessage();
        }
    }, [messages]);

    const startCountdown = () => {
        if (drawNumberEnabled) {
            setIsCountingDown(true);
            setDrawNumberEnabled(false);
        }
    };

    const startCountdownFromMessage = () => { // New function to start countdown without drawNumberEnabled check
        setIsCountingDown(true);
        setDrawNumberEnabled(false); // Optionally disable draw button when countdown starts from message
        setCountdown(6); // Reset countdown to 6 in case it's not already
    };


    const drawNumber = () => {
        if (drawNumberEnabled) {
            startCountdown();
            sendMessage({ type: 'draw-number' }); // Send draw-number message via WebSocket
            // Number drawing and state update will be handled in WebSocket message receiver (BingoGameWebsocket.js context)
        }
    };

    const handleCellPress = ( num) => {
        sendMessage({ type: 'mark-number', number: num });
    };

    // Emoji functions
    const handleEmojiSelectContext = (emoji) => { // Renamed to avoid confusion in EmojiPanel
        console.log("BingoGameContext: handleEmojiSelectContext called for emoji:", emoji, "isEmojiAnimating:", isEmojiAnimating); // ADD THIS LOG
        if (!isEmojiAnimating) {
            setSelectedEmoji(emoji);
            setIsEmojiAnimating(true);
            setEmojiAnimationTrigger(prevTrigger => prevTrigger + 1);
            sendMessage({ type: 'send-emoji', emoji: emoji }); // Send emoji via WebSocket
            console.log('Emoji sent via WebSocket:', emoji);
        } else {
            console.log("BingoGameContext: Emoji animation is in progress, emoji send blocked."); // ADD THIS LOG
        }
    };

    const handleEmojiButtonPress = () => {
        setEmojiPanelVisible(!isEmojiPanelVisible);
    };

    const closeEmojiPanel = () => {
        setEmojiPanelVisible(false);
    };

    const toggleDisplayEmojis = () => { // Function to toggle emoji display
        setDisplayEmojis(!displayEmojis);
    };

  const [isMessageModalVisible, setMessageModalVisible] = useState(false);
  const [lastMessage, setLastMessage] = useState('');

  const openMessageModal = () => {
    setMessageModalVisible(true);
  };

  const closeMessageModal = () => {
    setMessageModalVisible(false);
  };

  const handleNewMessage = (messageText) => {
    setLastMessage(messageText);
  };


    return (
        <BingoContext.Provider
            value={{
                card,
                setCard,
                bgColor,
                setBgColor,
                drawnNumbers,
                setDrawnNumbers,
                currentNumber,
                setCurrentNumber,
                markedNumbers,
                setMarkedNumbers,
                drawNumberEnabled,
                setDrawNumberEnabled,
                countdown,
                setCountdown,
                isCountingDown,
                setIsCountingDown,
                drawNumber,
                startCountdown,
                handleCellPress,
                isEmojiPanelVisible,
                setEmojiPanelVisible,
                selectedEmoji,
                setSelectedEmoji,
                emojis,
                handleEmojiSelectContext, // Renamed in context value as well
                handleEmojiButtonPress,
                closeEmojiPanel,
                emojiAnimationTrigger,
                isEmojiAnimating,
                setIsEmojiAnimating,
                displayEmojis, // Expose displayEmojis to context
                toggleDisplayEmojis, // Expose toggleDisplayEmojis to context
                openMessageModal,
                closeMessageModal,
                isMessageModalVisible,
                lastMessage,
                handleNewMessage,
                startCountdownFromMessage // Expose this function if you need to trigger countdown from outside
            }}
        >
            {children}
        </BingoContext.Provider>
    );
};