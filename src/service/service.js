import api from "../../../../src/shared/states/api";
import { getToken } from "../../../../src/shared/states/api";

const getUserBingoCard = async (username) => {
    if (!username) {
        console.error("Kullanıcı adı bulunamadı.");
        return { bingoCard: null, cardColor: null }; // Return an object with null values if username is missing
    }

    try {
        const token = getToken();
        const response = await api.get('/lobby/listUserLobby', {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.lobby) {
            const lobby = response.data.lobby;

            if (lobby.bingoCards && lobby.cardColors) { // Check if both bingoCards and cardColors exist in the lobby data
                const userBingoCard = lobby.bingoCards[username];
                const userCardColor = lobby.cardColors[username]; // Get the card color for the user

                if (userBingoCard) {
                    return { bingoCard: userBingoCard, cardColor: userCardColor }; // Return both bingoCard and cardColor as an object
                } else {
                    console.warn(`${username} için bingo kartı bulunamadı.`);
                    return { bingoCard: null, cardColor: null }; // Return null for both if bingoCard is not found
                }
            } else {
                console.warn("API'da bingoCards veya cardColors verisi yok.");
                return { bingoCard: null, cardColor: null }; // Return null for both if bingoCards or cardColors is missing in lobby data
            }
        } else {
            console.warn("API'da lobby verisi yok.");
            return { bingoCard: null, cardColor: null }; // Return null for both if lobby data is missing
        }
    } catch (error) {
        console.error("Bingo kartı alınamadı:", error);
        throw error;
    }
};

export default getUserBingoCard;