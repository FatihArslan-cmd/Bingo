import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import BingoCard from './components/BingoCard';
import DrawButton from './components/DrawButton';
import Countdown from 'bingo/src/components/CountDown';
import DrawnNumbersPanel from './components/DrawnNumbersPanel';
import generateTombalaCard from './utils/CardGenerator';
import UserListPanel from 'bingo/src/components/UserList';
import LogoutButton from 'bingo/src/components/LogoutButton';

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF3', '#FF8C33', '#8C33FF', '#33A1FF'];

const BingoGame = () => {
  const [card, setCard] = useState(generateTombalaCard());
  const [bgColor, setBgColor] = useState(COLORS[Math.floor(Math.random() * COLORS.length)]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(null);
  const [markedNumbers, setMarkedNumbers] = useState({});
  const [drawNumberEnabled, setDrawNumberEnabled] = useState(true);
  const [countdown, setCountdown] = useState(6);
  const [isCountingDown, setIsCountingDown] = useState(false);

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

  const refreshCard = () => {
    setCard(generateTombalaCard());
    setBgColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setDrawnNumbers([]);
    setCurrentNumber(null);
    setMarkedNumbers({});
    setDrawNumberEnabled(true);
  };

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
            <UserListPanel />
            <LogoutButton />
        </View>
        <Countdown countdown={countdown} isCountingDown={isCountingDown} />

      <View style={styles.contentContainer}>
        <DrawButton
          bgColor={bgColor}
          currentNumber={currentNumber}
          drawNumber={drawNumber}
          drawNumberEnabled={drawNumberEnabled}
         />
        <BingoCard
          card={card}
          bgColor={bgColor}
          markedNumbers={markedNumbers}
          handleCellPress={handleCellPress}
         />
      </View>
        <DrawnNumbersPanel drawnNumbers={drawnNumbers} />
      <TouchableOpacity onPress={refreshCard} style={styles.button}>
        <Text style={styles.buttonText}>Yenile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    leftIcons: {
      flexDirection: 'row',
    },
    iconButton: {
        padding: 10,
    },
    logoutButton: {
        padding: 10,
    },
    contentContainer: {
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 50,
      },
  button: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default BingoGame;