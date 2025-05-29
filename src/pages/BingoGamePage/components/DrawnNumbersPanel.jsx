import React, { memo, useContext, useEffect, useRef } from "react";
import Sound from "react-native-sound";
import { BingoContext } from "bingo/src/context/BingoGameContext";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../../src/context/ThemeContext";
import { isTablet } from "../../../../../../src/utils/isTablet";

const TABLET_DEVICE = isTablet();

const NumberBox = memo(({ number, isLast }) => {
  const { colors } = useTheme();
  const backgroundColor = isLast ? '#8B0000' : colors.card;
  const textColor = isLast ? 'white' : colors.text;

  return (
    <View style={[styles.numberBox, { backgroundColor: backgroundColor }]}>
      <Text style={[styles.numberText, { color: textColor }, isLast ? styles.lastNumberText : {}]}>{number}</Text>
    </View>
  );
});
NumberBox.displayName = 'NumberBox';

const DrawnNumbersPanel = () => {
  const { drawnNumbers, gameSettings } = useContext(BingoContext); 
  const scrollRef = useRef(null);
  const totalNumbersInBingo = 90;
  const { colors } = useTheme();
  const { t } = useTranslation();

  const bingoSoundRef = useRef(null);
  const previousDrawnCountRef = useRef(0);

  useEffect(() => {
    const soundFileName = 'number_draw.wav';
    Sound.setCategory('Playback');

    const sound = new Sound(soundFileName, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log(`Failed to load the sound ${soundFileName}`, error);
      }
      bingoSoundRef.current = sound;
    });

    return () => {
      if (bingoSoundRef.current) {
        bingoSoundRef.current.release();
        bingoSoundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current && drawnNumbers.length > 0) {
      setTimeout(() => {
        scrollRef.current.scrollToEnd({ animated: true });
      }, 50);
    }

    const currentDrawnCount = drawnNumbers.length;
    const previousDrawnCount = previousDrawnCountRef.current;

    if (currentDrawnCount > previousDrawnCount && bingoSoundRef.current && gameSettings?.sound) {
      bingoSoundRef.current.play((success) => {
        if (!success) {
          console.log('Sound playback failed');
        }
      });
    }

    previousDrawnCountRef.current = currentDrawnCount;

  }, [drawnNumbers, gameSettings]); 

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View>
        <View style={styles.header}>
          <Text style={[styles.drawnCountText, { color: colors.text }]}>
{t("bingoGame.numbers") + ": " + drawnNumbers.length + "/" + totalNumbersInBingo}          </Text>
        </View>
         <ScrollView
           horizontal={true}
           contentContainerStyle={styles.scrollContent}
           showsHorizontalScrollIndicator={false}
           fadingEdgeLength={50}
           ref={scrollRef}
           keyboardShouldPersistTaps="handled"
         >
           {drawnNumbers.map((number, index) => (
             <NumberBox
               key={`drawn-number-${index}`}
               number={number}
               isLast={index === drawnNumbers.length - 1}
             />
           ))}
         </ScrollView>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberBox: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  numberText: {
    fontSize: TABLET_DEVICE ? 16 : 12,
    fontWeight: 'bold',
  },
  drawnCountText: {
    fontSize: TABLET_DEVICE ? 16 : 14,
    fontWeight: 'bold',
  },
  lastNumberText: {
    color: 'white',
  },
});

DrawnNumbersPanel.displayName = 'DrawnNumbersPanel';
export default memo(DrawnNumbersPanel);