import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import { UPDATE_INTERVALS } from '../constants';

export const useChatHistory = (chatId) => {
  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [status, setStatus] = useState(null);

  const fetchHistory = useCallback(async () => {
    if (!chatId) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await apiClient.getChatHistory(chatId);
      const data = response.data;
      
      setChatData(data);
      setMessages(data.messages || []);
      setUserInfo(data.user_info);
      setStatus(data.status);
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [chatId]);

  const sendMessage = useCallback(async (message, adminName = 'Администратор') => {
    if (!chatId || !message.trim()) return;
    
    try {
      await apiClient.sendMessage(chatId, message, adminName);
      await fetchHistory();
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  }, [chatId, fetchHistory]);

  const markAsRead = useCallback(async () => {
    if (!chatId) return;
    
    try {
      await apiClient.markAsRead(chatId);
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  }, [chatId]);

  const updateStatus = useCallback(async (newStatus) => {
    if (!chatId) return;
    
    try {
      await apiClient.updateUserStatus(chatId, newStatus);
      setStatus(newStatus);
      await fetchHistory();
    } catch (err) {
      console.error('Error updating status:', err);
      throw err;
    }
  }, [chatId, fetchHistory]);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchHistory();
    markAsRead();
    
    // Автообновление каждые 3 секунды
    const interval = setInterval(() => {
      fetchHistory();
      markAsRead();
    }, UPDATE_INTERVALS.CHAT_HISTORY);
    
    return () => clearInterval(interval);
  }, [chatId, fetchHistory, markAsRead]);

  return {
    chatData,
    messages,
    userInfo,
    status,
    loading,
    error,
    sendMessage,
    updateStatus,
    refetch: fetchHistory
  };
};

