import { StyleSheet, useWindowDimensions } from "react-native";
import { isTablet } from "../../../../../../src/utils/isTablet";

export default function getStyles() {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const TABLET_DEVICE = isTablet();

    const lottieSize = isLandscape
        ? (TABLET_DEVICE ? 300 : 200)
        : (TABLET_DEVICE ? 400 : 300);

    return StyleSheet.create({
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
            fontSize: TABLET_DEVICE ? 22 : 14,
            fontFamily: 'Orbitron-ExtraBold',
            color: '#6a11cb',
            marginBottom: 15,
        },
        winnerAvatar: {
            backgroundColor: '#6a11cb',
            marginBottom: 10,
        },
        winnerName: {
            fontSize: TABLET_DEVICE ? 24 : 16,
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
            width: TABLET_DEVICE ? 40 : 30,
            height: TABLET_DEVICE ? 40 : 30,
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
            fontSize: TABLET_DEVICE ? 16 : 12,
            fontFamily: 'Orbitron-ExtraBold',
        },
        playerScore: {
            fontSize: TABLET_DEVICE ? 16 : 12,
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
            fontSize: TABLET_DEVICE ? 16 : 13,
            fontFamily: 'Orbitron-ExtraBold',
            marginLeft: 10,
            textAlign: 'center',
        },
        lottieAnimation: {
            width: lottieSize,
            height: lottieSize,
            marginBottom: 20,
            marginTop: 10,
        },
    });
}
