import React, { createContext, useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useBingoWebSocket } from '../../../../src/context/BingoGameWebsocket.js';
import { UserContext } from '../../../../src/context/UserContext.jsx';
import getUserBingoCardData from 'bingo/src/service/service.js';


export const BingoContext = createContext();

export const BingoContextProvider = ({ children }) => {
    const { user } = useContext(UserContext);
    const [card, setCard] = useState([]);
    const [bgColor, setBgColor] = useState('');
    const [drawnNumbers, setDrawnNumbers] = useState([]);
    const [currentNumber, setCurrentNumber] = useState(null);
    const [markedNumbers, setMarkedNumbers] = useState({});
    const [drawNumberEnabled, setDrawNumberEnabled] = useState(true);
    const [countdown, setCountdown] = useState(6);
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [isCardLoading, setIsCardLoading] = useState(true);
    const [cardError, setCardError] = useState(null);

    const [isEmojiPanelVisible, setEmojiPanelVisible] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [emojis] = useState(['👍', '🔥', '💯', '🍀', '🚀']);
    const [emojiAnimationTrigger, setEmojiAnimationTrigger] = useState(0);
    const [isEmojiAnimating, setIsEmojiAnimating] = useState(false);
    const [displayEmojis, setDisplayEmojis] = useState(true);

    const [chatMessages, setChatMessages] = useState([]);

    const [isBingoOccurred, setIsBingoOccurred] = useState(false);
    const [bingoWinnerUsername, setBingoWinnerUsername] = useState('');
    const [gameScores, setGameScores] = useState({});

    const [membersInfo, setMembersInfo] = useState(null); // New state for members info

    const { sendMessage, messages } = useBingoWebSocket();
    const lastProcessedNumberDrawnRef = useRef(null);
    const lastProcessedBingoRef = useRef(null);

    useEffect(() => {
        const loadBingoCard = async () => {
            if (!user?.username) {
                setCardError('Kullanıcı bilgisi bulunamadı!');
                return;
            }

            try {
                setIsCardLoading(true);
                const { bingoCard, cardColor, membersInfo: fetchedMembersInfo } = await getUserBingoCardData(user.username); // Destructure membersInfo from the return

                setCard(bingoCard);
                setBgColor(cardColor);
                setMembersInfo(fetchedMembersInfo); // Set the members info state
                setCardError(null);

            } catch (error) {
                console.error('Bingo kartı yüklenemedi:', error);
                setCardError('Bingo kartı yüklenemedi. Lütfen tekrar deneyin.');
            } finally {
                setIsCardLoading(false);
            }
        };

        loadBingoCard();
    }, [user?.username]);


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
        const numberDrawnMessages = messages.filter(msg => msg.type === 'number-drawn');
        const latestNumberDrawnMessage = numberDrawnMessages[numberDrawnMessages.length - 1];

        if (
            latestNumberDrawnMessage &&
            latestNumberDrawnMessage !== lastProcessedNumberDrawnRef.current
        ) {
            setCurrentNumber(latestNumberDrawnMessage.number);
            setDrawnNumbers([...drawnNumbers, latestNumberDrawnMessage.number]);
            setIsCountingDown(true);
            setDrawNumberEnabled(false);
            setCountdown(6);
            lastProcessedNumberDrawnRef.current = latestNumberDrawnMessage;
        }
    }, [messages, drawnNumbers]);

    useEffect(() => {
        const bingoMessages = messages.filter(msg => msg.type === 'bingo');
        const latestBingoMessage = bingoMessages[bingoMessages.length - 1];

        if (
            latestBingoMessage &&
            latestBingoMessage !== lastProcessedBingoRef.current
        ) {
            setIsBingoOccurred(true);
            setBingoWinnerUsername(latestBingoMessage.username);
            setGameScores(latestBingoMessage.scores);
            lastProcessedBingoRef.current = latestBingoMessage;
        }
    }, [messages]);


    useEffect(() => {
        const newChatMessagesFromServer = messages.filter(msg =>
            msg.type === 'chat-message-received' &&
            !chatMessages.some(existing => existing.timestamp === msg.timestamp)
        );

        if (newChatMessagesFromServer.length > 0) {
            setChatMessages(prev => [...prev, ...newChatMessagesFromServer]);
        }
    }, [messages, chatMessages]);

    const startCountdown = () => {
        if (drawNumberEnabled) {
            setIsCountingDown(true);
            setDrawNumberEnabled(false);
        }
    };

    const drawNumber = () => {
        if (drawNumberEnabled) {
            sendMessage({ type: 'draw-number' });
        }
    };

    const handleCellPress = (num) => {
        if (drawnNumbers.includes(num)) {
            setMarkedNumbers(prevMarkedNumbers => ({
                ...prevMarkedNumbers,
                [num]: true
            }));
            sendMessage({ type: 'mark-number', number: num });
        }
    };

    const handleEmojiSelectContext = (emoji) => {
        if (!isEmojiAnimating) {
            setSelectedEmoji(emoji);
            setIsEmojiAnimating(true);
            setEmojiAnimationTrigger(prevTrigger => prevTrigger + 1);
            sendMessage({ type: 'send-emoji', emoji: emoji });
        }
    };

    const handleEmojiButtonPress = () => {
        setEmojiPanelVisible(!isEmojiPanelVisible);
    };

    const closeEmojiPanel = () => {
        setEmojiPanelVisible(false);
    };

    const toggleDisplayEmojis = () => {
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

    const sendChatMessageContext = useCallback((messageText) => {
        sendMessage({ type: 'chat-message', message: messageText });
    }, [sendMessage]);

    useEffect(() => {
        if (chatMessages.length > 0) {
            setLastMessage(chatMessages[chatMessages.length - 1].message);
        } else {
            setLastMessage('');
        }
    }, [chatMessages]);


    return (
        <BingoContext.Provider
            value={{
                card,
                setCard,
                isCardLoading,
                cardError,
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
                handleEmojiSelectContext,
                handleEmojiButtonPress,
                closeEmojiPanel,
                emojiAnimationTrigger,
                isEmojiAnimating,
                setIsEmojiAnimating,
                displayEmojis,
                toggleDisplayEmojis,

                openMessageModal,
                closeMessageModal,
                isMessageModalVisible,
                lastMessage,
                handleNewMessage,
                sendChatMessageContext,
                chatMessages,
                startCountdown: startCountdown,

                isBingoOccurred,
                setIsBingoOccurred,
                bingoWinnerUsername,
                setBingoWinnerUsername,
                gameScores,
                setGameScores,

                membersInfo, // Expose membersInfo in the context
                setMembersInfo, // Optionally expose the setter as well if needed
            }}
        >
            {children}
        </BingoContext.Provider>
    );
};

export default BingoContextProvider;