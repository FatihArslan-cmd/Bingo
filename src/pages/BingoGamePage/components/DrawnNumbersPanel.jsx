import React, { memo, useContext, useEffect, useRef, useState } from "react";
import Sound from "react-native-sound";
import { BingoContext } from "bingo/src/context/BingoGameContext";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../../src/context/ThemeContext";
import { isTablet } from "../../../../../../src/utils/isTablet";

const TABLET_DEVICE = isTablet();

const NumberBox = memo(({ number, isLast }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.numberBox, { backgroundColor: colors.card }, isLast ? styles.lastNumberBox : {}]}>
      <Text style={[styles.numberText, { color: colors.text }, isLast ? styles.lastNumberText : {}]}>{number}</Text>
    </View>
  );
});
NumberBox.displayName = 'NumberBox';

const DrawnNumbersPanel = () => {
  const { drawnNumbers } = useContext(BingoContext);
  const [isVisible, setIsVisible] = useState(true);
  const scrollRef = useRef(null);
  const totalNumbersInBingo = 90;
  const { colors } = useTheme();

  const bingoSoundRef = useRef(null);
  const previousDrawnCountRef = useRef(0);

  useEffect(() => {
    const soundFileName = 'number_draw.wav';

    const sound = new Sound(soundFileName, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log(`Failed to load the sound ${soundFileName}`, error);
      } else {
         console.log(`Sound ${soundFileName} loaded successfully`);
      }
      bingoSoundRef.current = sound;
    });

    return () => {
      if (bingoSoundRef.current) {
        bingoSoundRef.current.release();
        console.log(`Sound ${soundFileName} released`);
      }
    };
  }, []);

    useEffect(() => {
        if (scrollRef.current && drawnNumbers.length > 0) {
            scrollToEnd();
        }

        if (drawnNumbers.length > previousDrawnCountRef.current && bingoSoundRef.current) {
             console.log('Playing sound for new number');
             bingoSoundRef.current.play((success) => {
                if (success) {
                    console.log('Sound played successfully');
                } else {
                    console.log('Sound playback failed');
                }
             });
        }

        previousDrawnCountRef.current = drawnNumbers.length;

    }, [drawnNumbers]);

  const scrollToEnd = () => {
      if (scrollRef.current) {
          setTimeout(() => {
             scrollRef.current.scrollToEnd({ animated: true });
          }, 10);
      }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isVisible && (
        <View>
          <View style={styles.header}>
            <Text style={[styles.drawnCountText, { color: colors.text }]}>
              {drawnNumbers.length}/{totalNumbersInBingo}
            </Text>
          </View>
           <ScrollView
             horizontal={true}
             contentContainerStyle={styles.scrollContent}
             showsHorizontalScrollIndicator={false}
             fadingEdgeLength={50}
             ref={scrollRef}
              onContentSizeChange={() => scrollToEnd()}
           >
             {drawnNumbers.map((number, index) => (
               <NumberBox
                 key={index}
                 number={number}
                 isLast={index === drawnNumbers.length - 1}
               />
             ))}
           </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingHorizontal: TABLET_DEVICE ? 20 : 10,
  },
    header:{
      flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
    },
    closeButton:{
        padding: 5,
    },
    showButton:{
        padding: 5,
        alignItems: 'center'
    },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  numberBox: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: TABLET_DEVICE ? 16 : 12,
    fontWeight: 'bold',
  },
  drawnCountText: {
    fontSize: TABLET_DEVICE ? 16 : 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  lastNumberBox: {
    backgroundColor: '#8B0000',
  },
  lastNumberText: {
    color: 'white',
  },
});

DrawnNumbersPanel.displayName = 'DrawnNumbersPanel';
export default memo(DrawnNumbersPanel);