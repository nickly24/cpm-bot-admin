import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import { UPDATE_INTERVALS } from '../constants';

export const useChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0);

  const fetchChats = useCallback(async () => {
    try {
      const response = await apiClient.getChats();
      const newChats = response.data || [];
      
      // Подсчитываем общее количество непрочитанных
      const totalUnread = newChats.reduce((sum, chat) => sum + (chat.unread_count || 0), 0);
      
      // Если непрочитанных стало больше - воспроизводим звук
      if (totalUnread > previousUnreadCount && previousUnreadCount > 0) {
        playNotificationSound();
        showBrowserNotification(newChats);
      }
      
      setPreviousUnreadCount(totalUnread);
      setChats(newChats);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [previousUnreadCount]);

  useEffect(() => {
    fetchChats();
    
    // Автообновление каждые 5 секунд
    const interval = setInterval(fetchChats, UPDATE_INTERVALS.CHAT_LIST);
    return () => clearInterval(interval);
  }, [fetchChats]);

  return { chats, loading, error, refetch: fetchChats };
};

// Воспроизведение звука уведомления
const playNotificationSound = () => {
  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizcIG2m98OScTgwOUKfj8LdkHQc4ktjz0X8xBSl+zPLaizsKGGO67uylUBELTKXh8bllHgU2jdXzzIU2Bytzi/LemUYOF1yw6OyrWBUIRJzd8sNuJAU=');
  audio.volume = 0.5;
  audio.play().catch(e => console.log('Sound play failed:', e));
};

// Показ browser notification
const showBrowserNotification = (chats) => {
  if (!('Notification' in window)) return;
  
  if (Notification.permission === 'granted') {
    const unreadChats = chats.filter(chat => chat.unread_count > 0);
    if (unreadChats.length > 0) {
      const firstChat = unreadChats[0];
      new Notification('Новое сообщение', {
        body: `${firstChat.user_info?.name || 'Пользователь'}: ${firstChat.last_message?.text || ''}`,
        icon: '/logo192.png'
      });
    }
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
};

