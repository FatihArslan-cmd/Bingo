import React, { createContext, useState, useEffect, useRef, useContext } from 'react'; // Import useContext
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

    const { sendMessage } = useBingoWebSocket(); // Get sendMessage from WebSocket Context

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

    const startCountdown = () => {
        if (drawNumberEnabled) {
            setIsCountingDown(true)
            setDrawNumberEnabled(false);
        }
    };

    const drawNumber = () => {
        if (drawNumberEnabled) {
            startCountdown();
            let randomNumber;
            do {
                randomNumber = Math.floor(Math.random() * 90) + 1;
            } while (drawnNumbers.includes(randomNumber));

            setDrawnNumbers([...drawnNumbers, randomNumber]);
            setCurrentNumber(randomNumber);
        }
    };

    const handleCellPress = (row, col, num) => {
        if (drawnNumbers.includes(num)) {
            setMarkedNumbers(prevMarked => ({
                ...prevMarked,
                [`${row}-${col}`]: true
            }));
        }
    };

    const resetGame = () => {
        setCard(generateTombalaCard());
        setBgColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
        setDrawnNumbers([]);
        setCurrentNumber(null);
        setMarkedNumbers({});
        setDrawNumberEnabled(true);
        setCountdown(6);
        setIsCountingDown(false);
        setSelectedEmoji(null);
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
                resetGame,
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
                handleNewMessage
                
            }}
        >
            {children}
        </BingoContext.Provider>
    );
};