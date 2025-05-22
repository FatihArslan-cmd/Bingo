import React, { useContext, useEffect, useRef, useState } from "react";
import { TabActions } from "@react-navigation/native";
import { BingoContext } from "bingo/src/context/BingoGameContext";
import { Animated, FlatList, Platform, StyleSheet, View } from "react-native";
import { useBingoWebSocket } from "../../../../../../src/context/BingoGameWebsocket.js";
import { useTheme } from "../../../../../../src/context/ThemeContext.jsx";
import { isTablet } from "../../../../../../src/utils/isTablet.js";

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

const TABLET_DEVICE = isTablet();

const UserListPanel = () => {
  const { membersInfo } = useContext(BingoContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();
  const maxListHeight = useRef(new Animated.Value(0)).current;
  const { messages } = useBingoWebSocket();
  const [users, setUsers] = useState([]);
  const primaryNavigationColor = colors.navigationFill;

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
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const renderUserItem = ({ item }) => (
    <TouchableRipple
      onPress={() => console.log(`Tapped on ${item.name}`)}
      rippleColor={colors.ripple}
    >
      <List.Item
        title={item.name}
        titleStyle={[styles.userName, { color: colors.text }]}
        left={() => (
          <View style={styles.avatarContainer}>
            {item.profilePhoto ? (
              <Avatar.Image size={TABLET_DEVICE ? 40 : 30} source={{ uri: item.profilePhoto }} />
            ) : (
              <Avatar.Text
                size={TABLET_DEVICE ? 40 : 30}
                label={item.name.substring(0, 2).toUpperCase()}
                backgroundColor={item.isOnline ? colors.primary : colors.border}
                color={colors.card}
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
              <Text style={[styles.statLabel, { color: colors.subText }]}>Bingo</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{item.score}</Text>
            </View>
            <Divider style={{ ...styles.verticalDivider, backgroundColor: colors.border }} />
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: colors.subText }]}>Cinko</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{item.cinko}</Text>
            </View>
          </View>
        )}
      />
    </TouchableRipple>
  );

  return (
    <Surface style={[styles.container, { backgroundColor: colors.background }]} elevation={2}>
      <TouchableRipple onPress={toggleExpand}
        rippleColor={colors.ripple}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <IconButton icon="account-group" size={TABLET_DEVICE ? 24 : 18} iconColor={primaryNavigationColor} />
            <Text variant="titleLarge" style={[styles.playerText, { color: primaryNavigationColor }]}>Players</Text>
          </View>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <IconButton style={{ marginEnd: 0 }} icon="chevron-down" size={TABLET_DEVICE ? 24 : 18} iconColor={primaryNavigationColor} />
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
        {(isExpanded || displayedUsers.length > 0) && (
           <FlatList
            data={displayedUsers}
            keyExtractor={(item) => item.username || item.userId?.toString()}
            renderItem={renderUserItem}
            ItemSeparatorComponent={() => <Divider style={{ backgroundColor: colors.border }} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </Animated.View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  headerContainer: {
    paddingTop: 25,
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
    marginLeft: 4,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  statLabel: {
    fontSize: TABLET_DEVICE ? 12 : 8,
    opacity: 0.7,
  },
  statValue: {
    fontSize: TABLET_DEVICE ? 14 : 10,
    fontWeight: '600',
  },
  verticalDivider: {
    height: TABLET_DEVICE ? 24 : 16,
    width: 1,
  },
  playerText: {
    fontWeight: 'bold',
    fontSize: TABLET_DEVICE ? 16 : 10,
    marginLeft: 4,
  }
});

export default UserListPanel;