import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    resultScreenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between', 
        padding: 20,
    },
    winnerCardStyle: {
        marginTop: '10%',
        marginBottom: 20,
    },
    winnerCard: {
        width: '100%',
        marginBottom: 20,
        borderRadius: 15,
        elevation: 8,
    },
    winnerCardContent: {
        alignItems: 'center',
        padding: 20,
    },
    bingoWinnerTitle: {
        fontSize: 22,
        fontFamily: 'Orbitron-ExtraBold',
        color: '#6a11cb',
        marginBottom: 15,
    },
    winnerAvatar: {
        backgroundColor: '#6a11cb',
        marginBottom: 10,
    },
    winnerName: {
        fontSize: 24,
        fontFamily: 'Orbitron-ExtraBold',
        marginBottom: 5,
    },
    winnerBadge: {
        backgroundColor: '#6a11cb',
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    winnerBadgeText: {
        color: 'white',
        fontFamily: 'Orbitron-ExtraBold',
        marginLeft: 5,
    },
    scoresCardStyle: {
        marginBottom: 30,
    },
    scoresCard: {
        width: '100%',
        marginBottom: 20,
        borderRadius: 15,
        elevation: 4,
        maxHeight: '45%',
    },
    scoresScrollView: {
        maxHeight: 300,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    rankBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    rankText: {
        color: 'white',
        fontFamily: 'Orbitron-ExtraBold',
        marginLeft: 2,
    },
    playerAvatar: {
        marginRight: 10,
    },
    playerName: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Orbitron-ExtraBold',
    },
    playerScore: {
        fontSize: 16,
        fontFamily: 'Orbitron-ExtraBold',
        color: '#2575fc',
    },
    buttonsContainer: {
        width: '80%',
        marginBottom: 20, 
        marginTop: 0,
    },
    logoutButtonContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
    },
    playAgainButton: {
        backgroundColor: '#6a11cb',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        elevation: 3,
    },
    shareButton: {
        backgroundColor: '#6a11cb',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        elevation: 3,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Orbitron-ExtraBold',
        marginLeft: 10,
        textAlign: 'center',
    },
    lottieAnimation: { 
        width: 400,  
        height: 400, 
        marginBottom: 20,
        marginTop: 10,
    },
});

export default styles;