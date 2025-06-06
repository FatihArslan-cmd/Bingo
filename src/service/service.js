import api from "../../../../src/shared/states/api";
import { getToken } from "../../../../src/shared/states/api";

const getUserBingoCard = async (username) => {
    try {
        const token = getToken();
        const response = await api.get('/lobby/listUserLobby', {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.lobby) {
            const lobby = response.data.lobby;
            let membersInfo = null;

            if (lobby.members && Array.isArray(lobby.members)) {
                membersInfo = lobby.members.map(member => ({
                    username: member.username,
                    profilePhoto: member.profilePhoto,
                    userId: member.id,
                }));
            } else {
                membersInfo = null; 
            }


            if (lobby.bingoCards && lobby.cardColors) {
                const userBingoCard = lobby.bingoCards[username];
                const userCardColor = lobby.cardColors[username];

                if (userBingoCard) {
                    return { bingoCard: userBingoCard, cardColor: userCardColor, membersInfo: membersInfo };
                } else {
                    return { bingoCard: null, cardColor: null, membersInfo: membersInfo };
                }
            } else {
                return { bingoCard: null, cardColor: null, membersInfo: membersInfo };
            }
        } else {
            return { bingoCard: null, cardColor: null, membersInfo: null }; 
        }
    } catch (error) {
        throw error;
    }
};

export default getUserBingoCard;