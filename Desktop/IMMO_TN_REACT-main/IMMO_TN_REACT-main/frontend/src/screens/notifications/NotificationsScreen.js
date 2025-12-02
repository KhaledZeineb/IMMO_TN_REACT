import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, formatDate } from '../../utils/constants';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationsScreen({ navigation }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const [loading, setLoading] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'property':
        return 'home';
      case 'message':
        return 'chatbubble';
      case 'favorite':
        return 'heart';
      default:
        return 'notifications';
    }
  };

  const handleNotificationPress = (notification) => {
    markAsRead(notification.id);
    
    // Parse data if it's a string
    const notifData = typeof notification.data === 'string' 
      ? JSON.parse(notification.data) 
      : notification.data;
    
    if (notifData?.propertyId) {
      navigation.navigate('PropertyDetails', { propertyId: notifData.propertyId });
    } else if (notifData?.userId) {
      navigation.navigate('Chat', {
        recipientId: notifData.userId,
        recipientName: notifData.userName,
      });
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.is_read && styles.unreadNotification]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.is_read ? COLORS.light : COLORS.primary + '20' }]}>
        <Ionicons
          name={getNotificationIcon(item.type)}
          size={24}
          color={item.is_read ? COLORS.gray : COLORS.primary}
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, !item.is_read && styles.unreadText]}>
          {item.title}
        </Text>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationTime}>{formatDate(item.created_at)}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNotification(item.id)}
      >
        <Ionicons name="close-circle" size={24} color={COLORS.gray} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {notifications.length > 0 && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={markAllAsRead}>
            <Ionicons name="checkmark-done" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Tout marquer comme lu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={clearAll}>
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
            <Text style={[styles.actionText, { color: COLORS.danger }]}>Tout supprimer</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={80} color={COLORS.gray} />
            <Text style={styles.emptyText}>Aucune notification</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginLeft: 15,
    flex: 1,
  },
  badge: {
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  unreadNotification: {
    backgroundColor: COLORS.primary + '08',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    color: COLORS.dark,
    marginBottom: 5,
  },
  unreadText: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  deleteButton: {
    padding: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 10,
  },
});
