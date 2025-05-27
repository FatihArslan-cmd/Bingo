import Tts from "react-native-tts";
import getUserBingoCardData from "bingo/src/service/service.js";
import { useTranslation } from "react-i18next";
import { useBingoWebSocket } from "../../../../src/context/BingoGameWebsocket.js";
import { UserContext } from "../../../../src/context/UserContext.jsx";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

export const BingoContext = createContext();

const ttsLanguageMap = {
  'en': 'en-US',
  'tr': 'tr-TR',
  'de': 'de-DE',
};

export const BingoContextProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [card, setCard] = useState([]);
  const [bgColor, setBgColor] = useState("");
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [markedNumbers, setMarkedNumbers] = useState({});
  const [drawNumberEnabled, setDrawNumberEnabled] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isCardLoading, setIsCardLoading] = useState(true);
  const [cardError, setCardError] = useState(null);

  const [isEmojiPanelVisible, setEmojiPanelVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [emojis] = useState(["👍", "🔥", "💯", "🍀", "🚀"]);
  const [emojiAnimationTrigger, setEmojiAnimationTrigger] = useState(0);
  const [isEmojiAnimating, setIsEmojiAnimating] = useState(false);
  const [displayEmojis, setDisplayEmojis] = useState(true);

  const [chatMessages, setChatMessages] = useState([]);

  const [isBingoOccurred, setIsBingoOccurred] = useState(false);
  const [bingoWinnerUsername, setBingoWinnerUsername] = useState("");
  const [gameScores, setGameScores] = useState({});

  const [membersInfo, setMembersInfo] = useState(null);

  const { sendMessage, messages } = useBingoWebSocket();
  const lastProcessedNumberDrawnRef = useRef(null);
  const lastProcessedBingoRef = useRef(null);
  const lastProcessedAllNumbersDrawnRef = useRef(null);


  const { i18n } = useTranslation();

  useEffect(() => {
    Tts.setDefaultRate(0.5);
  }, []);

  useEffect(() => {
    const currentI18nLanguage = i18n.language;
    const ttsLanguageCode = ttsLanguageMap[currentI18nLanguage] || ttsLanguageMap['en'];

    Tts.setDefaultLanguage(ttsLanguageCode)
      .catch(err => console.warn(err));

  }, [i18n.language]);

  useEffect(() => {
    const loadBingoCard = async () => {
      if (!user?.username) return;

      try {
        setIsCardLoading(true);
        const {
          bingoCard,
          cardColor,
          membersInfo: fetchedMembersInfo,
          gameData
        } = await getUserBingoCardData(user.username);
        setCard(bingoCard);
        setBgColor(cardColor);
        setMembersInfo(fetchedMembersInfo);
        setCardError(null);

        if (gameData && gameData.drawnNumbers) {
           setDrawnNumbers(gameData.drawnNumbers);
           setCurrentNumber(gameData.drawnNumbers[gameData.drawnNumbers.length - 1] || null);
        }


      } catch (error) {
        setCardError("Error");
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
        setCountdown(prevCount => {
          if (prevCount <= 1) {
            clearInterval(intervalId);
            setIsCountingDown(false);
            setTimeout(() => {
              setDrawNumberEnabled(true);
              setCountdown(3);
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
    if (!messages || messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];

    if (latestMessage.type === "number-drawn" && latestMessage !== lastProcessedNumberDrawnRef.current) {
      const { number } = latestMessage;
      setCurrentNumber(number);
      setDrawnNumbers(prev => {
          if (!prev.includes(number)) {
             return [...prev, number];
          }
          return prev;
      });
      setIsCountingDown(true);
      setDrawNumberEnabled(false);
      setCountdown(3);

      Tts.speak(`${number}`);
      lastProcessedNumberDrawnRef.current = latestMessage;
    }

    if (latestMessage.type === "all-numbers-drawn" && latestMessage !== lastProcessedAllNumbersDrawnRef.current) {
        setDrawnNumbers(latestMessage.drawnNumbers || []);
        setCurrentNumber(latestMessage.currentNumber || null);

        setDrawNumberEnabled(false);

        lastProcessedAllNumbersDrawnRef.current = latestMessage;
    }

    if (latestMessage.type === "bingo" && latestMessage !== lastProcessedBingoRef.current) {
      setIsBingoOccurred(true);
      setBingoWinnerUsername(latestMessage.username);
      setGameScores(latestMessage.scores);
      lastProcessedBingoRef.current = latestMessage;
    }

    if (latestMessage.type === "chat-message-received") {
         if (!chatMessages.some(msg => msg.timestamp === latestMessage.timestamp && msg.userId === latestMessage.userId)) {
             setChatMessages(prev => [...prev, latestMessage]);
         }
    }

  }, [messages, drawnNumbers, chatMessages]);


  useEffect(() => {
    if (chatMessages.length > 0) {
      setLastMessage(chatMessages[chatMessages.length - 1].message);
    } else {
      setLastMessage("");
    }
  }, [chatMessages]);


  const startCountdown = () => {
    if (drawNumberEnabled) {
      setIsCountingDown(true);
      setDrawNumberEnabled(false);
    }
  };

  const drawNumber = () => {
    if (drawNumberEnabled) {
      sendMessage({ type: "draw-number" });
    }
  };

  const drawAllRemainingNumbers = useCallback(() => {
      sendMessage({ type: "draw-all-remaining" });
  }, [sendMessage]);


  const handleCellPress = num => {
    if (drawnNumbers.includes(num) && !markedNumbers[num]) {
      setMarkedNumbers(prev => ({ ...prev, [num]: true }));
      sendMessage({ type: "mark-number", number: num });
    }
  };

  const handleEmojiSelectContext = emoji => {
    if (!isEmojiAnimating) {
      setSelectedEmoji(emoji);
      setIsEmojiAnimating(true);
      setEmojiAnimationTrigger(prev => prev + 1);
      sendMessage({ type: "send-emoji", emoji });
    }
  };
  const handleEmojiButtonPress = () =>
    setEmojiPanelVisible(v => !v);
  const closeEmojiPanel = () => setEmojiPanelVisible(false);
  const toggleDisplayEmojis = () =>
    setDisplayEmojis(d => !d);

  const [isMessageModalVisible, setMessageModalVisible] =
    useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const openMessageModal = () => setMessageModalVisible(true);
  const closeMessageModal = () =>
    setMessageModalVisible(false);


  const sendChatMessageContext = useCallback(
    messageText => {
      if (messageText && messageText.trim().length > 0) {
          sendMessage({ type: "chat-message", message: messageText.trim() });
      }
    },
    [sendMessage]
  );


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
        drawAllRemainingNumbers,
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
        sendChatMessageContext,
        chatMessages,
        isBingoOccurred,
        setIsBingoOccurred,
        bingoWinnerUsername,
        setBingoWinnerUsername,
        gameScores,
        setGameScores,
        membersInfo,
        setMembersInfo
      }}
    >
      {children}
    </BingoContext.Provider>
  );
};

export default BingoContextProvider;