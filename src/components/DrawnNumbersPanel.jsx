import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { BingoContext } from 'bingo/src/context/BingoGameContext';

const DrawnNumbersPanel = () => {
  const { drawnNumbers } = useContext(BingoContext);
  const [isVisible, setIsVisible] = useState(true);
  const scrollRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

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
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
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
               <View key={index} style={styles.numberBox}>
                 <Text style={styles.numberText}>{number}</Text>
               </View>
             ))}
           </ScrollView>
        </View>
      )}

    </Animated.View>
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

export default DrawnNumbersPanel;