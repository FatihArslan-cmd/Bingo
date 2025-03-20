import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, Animated, Platform, FlatList } from 'react-native';
import {
  Surface,
  List,
  Avatar,
  Text,
  Divider,
  Badge,
  IconButton,
  TouchableRipple
} from 'react-native-paper';
import { BingoContext } from 'bingo/src/context/BingoGameContext';
import { useBingoWebSocket } from '../../../../../../src/context/BingoGameWebsocket.js';
import { useTheme } from '../../../../../../src/context/ThemeContext.jsx';

const UserListPanel = () => {
  const { membersInfo } = useContext(BingoContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme(); // Get colors from your custom theme
  const maxListHeight = useRef(new Animated.Value(0)).current;
  const { messages } = useBingoWebSocket();
  const [users, setUsers] = useState([]);
  const primaryNavigationColor = colors.navigationFill; // Use navigationFill from theme for primary color

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, animation]);

  useEffect(() => {
    if (membersInfo) {
      const initialUsers = membersInfo.map((member, index) => ({
        ...member,
        name: member.username,
        score: '0/15',
        cinko: '0/3',
        isOnline: true,
        profilePhoto: member.profilePhoto || null,
        userId: member.userId
      }));
      setUsers(initialUsers);
    } else {
      setUsers([]);
    }

  }, [membersInfo]);


  useEffect(() => {
    const combinedUsersLength = users.length;
    const calculatedMaxHeight = combinedUsersLength * 68;
    maxListHeight.setValue(calculatedMaxHeight);
  }, [users]);


  useEffect(() => {
    if (messages && messages.length > 0) {
      messages.forEach(message => {
        if (message.type === 'number-marked' && message.playerStats) {
          setUsers(currentUsers => {
            return currentUsers.map(user => {
              const stats = message.playerStats[String(user.userId)];
              if (stats) {
                return {
                  ...user,
                  score: `${stats.markedNumbersCount}/15`,
                  cinko: `${stats.completedRowsCount}/3`,
                };
              }
              return user;
            });
          });
        } else if (message.type === 'user-disconnected') {
          const disconnectedUserId = message.userId;
          setUsers(currentUsers => {
            return currentUsers.map(user => {
              if (user.userId === disconnectedUserId) {
                return {
                  ...user,
                  isOnline: false,
                };
              }
              return user;
            });
          });
        } else if (message.type === 'user-connected') {
          const connectedUserId = message.userId;
          setUsers(currentUsers => {
            return currentUsers.map(user => {
              if (user.userId === connectedUserId) {
                return {
                  ...user,
                  isOnline: true,
                };
              }
              return user;
            });
          });
        }
      });
    }
  }, [messages]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const displayedUsers = isExpanded ? users : users.slice(0, Math.min(users.length, 4));


  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const listHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
    extrapolate: 'clamp',
  });


  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const renderUserItem = ({ item }) => (
    <TouchableRipple
      onPress={() => console.log(`Tapped on ${item.name}`)}
      rippleColor={colors.ripple} // Use themed ripple color
    >
      <List.Item
        title={item.name}
        titleStyle={[styles.userName, { color: colors.text }]} // Themed username text color
        left={() => (
          <View style={styles.avatarContainer}>
            {item.profilePhoto ? (
              <Avatar.Image size={40} source={{ uri: item.profilePhoto }} />
            ) : (
              <Avatar.Text
                size={40}
                label={item.name.substring(0, 2).toUpperCase()}
                backgroundColor={item.isOnline ? colors.primary : colors.border} // Themed avatar background
                color={colors.card} // Avatar text color
              />
            )}
            <Badge
              visible={true}
              size={12}
              style={[
                styles.onlineBadge,
                { backgroundColor: item.isOnline ? 'green' : 'red' }
              ]}
            />
          </View>
        )}
        right={() => (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.subText }]}>Bingo</Text> {/* Themed stat label color */}
              <Text style={[styles.statValue, { color: colors.text }]}>{item.score}</Text> {/* Themed stat value color */}
            </View>
            <Divider style={{ ...styles.verticalDivider, backgroundColor: colors.border }} /> {/* Themed divider color */}
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.subText }]}>Cinko</Text> {/* Themed stat label color */}
              <Text style={[styles.statValue, { color: colors.text }]}>{item.cinko}</Text> {/* Themed stat value color */}
            </View>
          </View>
        )}
      />
    </TouchableRipple>
  );

  return (
    <Surface style={[styles.container, { backgroundColor: colors.background }]} elevation={2}> {/* Themed Surface background */}
      <TouchableRipple onPress={toggleExpand}
        rippleColor={colors.ripple} // Themed ripple color
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <IconButton icon="account-group" size={24} iconColor={primaryNavigationColor} /> {/* Fixed icon color */}
            <Text variant="titleLarge" style={[styles.playerText, { color: primaryNavigationColor }]}>Players</Text> {/* Fixed "Players" text color */}
          </View>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <IconButton icon="chevron-down" size={24} iconColor={primaryNavigationColor} /> {/* Fixed icon color */}
          </Animated.View>
        </View>
      </TouchableRipple>

      <Animated.View
        style={[
          styles.listContainer,
          {
            height: listHeight,
            opacity,
          }
        ]}
      >
        <FlatList
          data={displayedUsers}
          keyExtractor={(item) => item.username || item.userId.toString()}
          renderItem={renderUserItem}
          ItemSeparatorComponent={() => <Divider style={{ backgroundColor: colors.border }} />} // Themed divider color
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </Animated.View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    overflow: 'hidden',
  },
  headerContainer: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContainer: {
    overflow: 'hidden',
  },
  listContent: {
    paddingBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 8,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  userName: {
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  verticalDivider: {
    height: 24,
    width: 1,
  },
  playerText: {
    fontWeight: 'bold',
  }
});

export default UserListPanel;