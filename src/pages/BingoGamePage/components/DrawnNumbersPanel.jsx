import React, { useState, useRef, useEffect, useContext, memo } from 'react'; // Import memo
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext';

const NumberBox = memo(({ number }) => {
  return (
    <View style={styles.numberBox}>
      <Text style={styles.numberText}>{number}</Text>
    </View>
  );
});
NumberBox.displayName = 'NumberBox'; // Optional: for better React DevTools naming

const DrawnNumbersPanel = () => {
  const { drawnNumbers } = useContext(BingoContext);
  const [isVisible, setIsVisible] = useState(true);
  const scrollRef = useRef(null);

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
           <ScrollView
             horizontal={true}
             contentContainerStyle={styles.scrollContent}
             showsHorizontalScrollIndicator={false}
             ref={scrollRef}
              onContentSizeChange={() => scrollToEnd()}
           >
             {drawnNumbers.map((number, index) => (
               <NumberBox key={index} number={number} />
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
      backgroundColor: 'transparent',
    paddingBottom: 10,
    borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    alignItems: 'center',
  },
    header:{
      flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        width: '100%',
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
});

DrawnNumbersPanel.displayName = 'DrawnNumbersPanel'; // Optional: for better React DevTools naming
export default memo(DrawnNumbersPanel); // Memoize DrawnNumbersPanel component