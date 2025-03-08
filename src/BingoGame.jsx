import React, { useContext } from 'react';
import { BingoContext, BingoContextProvider } from 'bingo/src/context/BingoGameContext';
import BingoGamePage from 'bingo/src/pages/BingoGamePage/BingoGamePage';
import BingoResultScreen from 'bingo/src/pages/BingoResultScreen/BingoResultScreen';

const MainAppContext = () => {
    const { isBingoOccurred } = useContext(BingoContext); 

    return (
        <>
            {isBingoOccurred ? <BingoResultScreen /> : <BingoGamePage />}
        </>
    );
};

const BingoGame = () => {
    return (
        <BingoContextProvider>
            <MainAppContext />
        </BingoContextProvider>
    );
};

export default BingoGame;