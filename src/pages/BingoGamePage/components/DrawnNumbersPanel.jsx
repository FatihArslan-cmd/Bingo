import React, { useState, useRef, useEffect, useContext, memo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext';

const NumberBox = memo(({ number, isLast }) => {
  return (
    <View style={[styles.numberBox, isLast ? styles.lastNumberBox : {}]}>
      <Text style={[styles.numberText, isLast ? styles.lastNumberText : {}]}>{number}</Text>
    </View>
  );
});
NumberBox.displayName = 'NumberBox';

const DrawnNumbersPanel = () => {
  const { drawnNumbers } = useContext(BingoContext);
  const [isVisible, setIsVisible] = useState(true);
  const scrollRef = useRef(null);
  const totalNumbersInBingo = 90;

    useEffect(() => {
        if (scrollRef.current && drawnNumbers.length > 0) {
            scrollToEnd();
        }
    }, [drawnNumbers]);


  const scrollToEnd = () => {
      if (scrollRef.current) {
          scrollRef.current.scrollToEnd({ animated: true });
      }
  };

  return (
    <View style={styles.container}>
      {isVisible && (
        <View>
          <View style={styles.header}>
            <Text style={styles.drawnCountText}>
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
                 isLast={index === drawnNumbers.length - 1} // Check if it's the last number
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
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingBottom: 10,
    borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
    header:{
      flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000',
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
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  drawnCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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