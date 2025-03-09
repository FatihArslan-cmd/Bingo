import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const UserListPanel = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [animation] = useState(new Animated.Value(0));
    
    const initialUsers = [
        { id: 1, name: 'User 1', score: '0/15', cinko: '0/3', isOnline: true },
        { id: 2, name: 'User 2', score: '0/15', cinko: '0/3', isOnline: false },
        { id: 3, name: 'User 3', score: '0/15', cinko: '0/3', isOnline: true },
        { id: 4, name: 'User 4', score: '0/15', cinko: '0/3', isOnline: true },
    ];

    const additionalUsers = [
        { id: 5, name: 'User 5', score: '0/15', cinko: '0/3', isOnline: false },
        { id: 6, name: 'User 6', score: '0/15', cinko: '0/3', isOnline: true },
        { id: 7, name: 'User 7', score: '0/15', cinko: '0/3', isOnline: false },
        { id: 8, name: 'User 8', score: '0/15', cinko: '0/3', isOnline: true },
    ];

    useEffect(() => {
        Animated.timing(animation, {
            toValue: isExpanded ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isExpanded]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const users = isExpanded ? [...initialUsers, ...additionalUsers] : initialUsers;

    const rotate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-20, 0],
    });

    const opacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.headerContainer} 
                onPress={toggleExpand}
                activeOpacity={0.7}
            >
                <View style={styles.headerContent}>
                    <Icon name="people" size={24} color="#2196F3" />
                    <Text style={styles.headerText}>Players</Text>
                    <Animated.View style={{ transform: [{ rotate }] }}>
                        <Icon name="expand-more" size={24} color="#2196F3" />
                    </Animated.View>
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <Animated.View 
                    style={[
                        styles.listContainer,
                        {
                            opacity,
                            transform: [{ translateY }],
                        }
                    ]}
                >
                    <ScrollView 
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        {users.map(user => (
                            <TouchableOpacity 
                                key={user.id} 
                                style={styles.userItem}
                                activeOpacity={0.7}
                            >
                                <View style={styles.userInfo}>
                                    <View style={styles.nameContainer}>
                                        <View 
                                            style={[
                                                styles.onlineIndicator,
                                                { backgroundColor: user.isOnline ? '#4CAF50' : '#9E9E9E' }
                                            ]} 
                                        />
                                        <Text style={styles.userName}>{user.name}</Text>
                                        <View style={styles.scoreSeparator} />

                                    </View>
                                    <View style={styles.scoreContainer}>
                                        <Text style={styles.userScore}>{user.score}</Text>
                                        <View style={styles.scoreSeparator} />
                                        <View style={styles.cinkoContainer}>
                                            <Text style={styles.cinkoScore}>{user.cinko}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    headerContainer: {
        padding: 16,
        borderRadius: 12,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2196F3',
        marginLeft: 8,
    },
    listContainer: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        overflow: 'hidden',
    },
    scrollView: {
        maxHeight: 300,
    },
    userItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    onlineIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    userName: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userScore: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    scoreSeparator: {
        width: 1,
        height: 12,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 8,
    },
    cinkoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cinkoScore: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
});

export default UserListPanel;