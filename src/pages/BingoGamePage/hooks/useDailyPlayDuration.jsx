import { BingoContext } from "bingo/src/context/BingoGameContext";
import { useContext, useEffect, useRef } from "react";
import { storage } from "../../../../../../src/utils/storage";

const useDailyPlayDuration = (gameName) => {
    const { isBingoOccurred } = useContext(BingoContext);
    const playTimerRef = useRef(null);

    useEffect(() => {
        if (!isBingoOccurred && gameName) {
            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');
            const todayFormatted = `${year}-${month}-${day}`;

            const storageKey = `play_duration_${gameName}_${todayFormatted}`;

            playTimerRef.current = setInterval(() => {
                const currentMinutes = storage.getNumber(storageKey) || 0;
                const newMinutes = currentMinutes + 1;
                storage.set(storageKey, newMinutes);
                console.log(`useDailyPlayDuration (${gameName}): Saved ${newMinutes} minutes for ${todayFormatted}`);
            }, 60000);

        } else {
            if (playTimerRef.current) {
                clearInterval(playTimerRef.current);
                playTimerRef.current = null;
            }
        }

        return () => {
            if (playTimerRef.current) {
                clearInterval(playTimerRef.current);
                playTimerRef.current = null;
            }
        };
    }, [isBingoOccurred, gameName]);
};

export default useDailyPlayDuration;