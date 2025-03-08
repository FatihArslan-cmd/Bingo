import api from "../../../../src/shared/states/api";
import { getToken } from "../../../../src/shared/states/api";

const getUserBingoCard = async (username) => {
    if (!username) {
        console.error("Kullanıcı adı bulunamadı.");
        return null;
    }

    try {
        const token = getToken();
        const response = await api.get('/lobby/listUserLobby', {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Düzeltilmiş kısım: lobby'nin nesne olarak varlığını kontrol et
        if (response.data?.lobby) { 
            const lobby = response.data.lobby;
            
            if (lobby.bingoCards) {
                const userBingoCard = lobby.bingoCards[username];
                
                if (userBingoCard) {
                    return userBingoCard;
                } else {
                    console.warn(`${username} için bingo kartı bulunamadı.`);
                    return null;
                }
            } else {
                console.warn("API'da bingoCards verisi yok.");
                return null;
            }
        } else {
            console.warn("API'da lobby verisi yok.");
            return null;
        }
    } catch (error) {
        console.error("Bingo kartı alınamadı:", error);
        throw error;
    }
};

export default getUserBingoCard;