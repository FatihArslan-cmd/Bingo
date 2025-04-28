import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
  } from "react";
  import getUserBingoCardData from "bingo/src/service/service.js";
  import { useBingoWebSocket } from "../../../../src/context/BingoGameWebsocket.js";
  import { UserContext } from "../../../../src/context/UserContext.jsx";
  import Tts from "react-native-tts";
  import { useTranslation } from 'react-i18next';
  
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
  
    const { i18n } = useTranslation();
  
    useEffect(() => {
      Tts.setDefaultRate(0.5);
    }, []);
  
    useEffect(() => {
      const currentI18nLanguage = i18n.language;
      const ttsLanguageCode = ttsLanguageMap[currentI18nLanguage] || ttsLanguageMap['en'];
    
      Tts.setDefaultLanguage(ttsLanguageCode)
        .then(() => console.log(`TTS dili başarıyla ayarlandı: ${ttsLanguageCode}`))
        .catch(err => console.error(`TTS dilini ayarlarken hata oluştu: ${ttsLanguageCode}`, err));
  
    }, [i18n.language]);
  
    useEffect(() => {
      const loadBingoCard = async () => {
        if (!user?.username) return;
  
        try {
          setIsCardLoading(true);
          const {
            bingoCard,
            cardColor,
            membersInfo: fetchedMembersInfo
          } = await getUserBingoCardData(user.username);
          setCard(bingoCard);
          setBgColor(cardColor);
          setMembersInfo(fetchedMembersInfo);
          setCardError(null);
        } catch (error) {
          setCardError("error");
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
      const numberDrawnMessages = messages.filter(
        msg => msg.type === "number-drawn"
      );
      const latest = numberDrawnMessages[numberDrawnMessages.length - 1];
  
      if (latest && latest !== lastProcessedNumberDrawnRef.current) {
        const { number } = latest;
        setCurrentNumber(number);
        setDrawnNumbers(prev => [...prev, number]);
        setIsCountingDown(true);
        setDrawNumberEnabled(false);
        setCountdown(3);
  
        Tts.speak(`${number}`);
        console.log("Sayı okundu:", number);
        lastProcessedNumberDrawnRef.current = latest;
      }
    }, [messages, drawnNumbers]);
  
    useEffect(() => {
      const bingoMessages = messages.filter(msg => msg.type === "bingo");
      const latestBingo = bingoMessages[bingoMessages.length - 1];
      if (latestBingo && latestBingo !== lastProcessedBingoRef.current) {
        setIsBingoOccurred(true);
        setBingoWinnerUsername(latestBingo.username);
        setGameScores(latestBingo.scores);
        lastProcessedBingoRef.current = latestBingo;
      }
    }, [messages]);
  
    useEffect(() => {
      const newChats = messages.filter(
        msg =>
          msg.type === "chat-message-received" &&
          !chatMessages.some(c => c.timestamp === msg.timestamp)
      );
      if (newChats.length) {
        setChatMessages(prev => [...prev, ...newChats]);
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
        sendMessage({ type: "draw-number" });
      }
    };
  
    const handleCellPress = num => {
      if (drawnNumbers.includes(num)) {
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
  
    const handleNewMessage = text => setLastMessage(text);
    const sendChatMessageContext = useCallback(
      messageText => {
        sendMessage({ type: "chat-message", message: messageText });
      },
      [sendMessage]
    );
  
    useEffect(() => {
      if (chatMessages.length > 0) {
        setLastMessage(chatMessages[chatMessages.length - 1].message);
      } else {
        setLastMessage("");
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