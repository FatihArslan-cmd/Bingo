import React, { createContext, useState, useEffect } from 'react';
import generateTombalaCard from '../utils/CardGenerator';

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
            }}
        >
            {children}
        </BingoContext.Provider>
    );
};