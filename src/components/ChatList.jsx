import React, { useState, useMemo } from 'react';
import { useChats } from '../hooks';
import { getStatusLabel, getStatusColor, STATUS_OPTIONS } from '../constants';
import '../styles/ChatList.css';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const { chats, loading, error } = useChats();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('time'); // 'time' или 'unread'

  // Фильтрация и сортировка чатов
  const filteredChats = useMemo(() => {
    let result = [...chats];

    // Поиск по имени
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(chat => 
        chat.user_info?.name?.toLowerCase().includes(query) ||
        chat.user_info?.username?.toLowerCase().includes(query)
      );
    }

    // Фильтр по статусу
    if (filterStatus !== 'all') {
      result = result.filter(chat => chat.status === filterStatus);
    }

    // Сортировка
    if (sortBy === 'time') {
      result.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } else if (sortBy === 'unread') {
      result.sort((a, b) => (b.unread_count || 0) - (a.unread_count || 0));
    }

    return result;
  }, [chats, searchQuery, filterStatus, sortBy]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Меньше минуты
    if (diff < 60000) return 'только что';
    
    // Меньше часа
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} мин назад`;
    }
    
    // Сегодня
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    
    // Вчера
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'вчера';
    }
    
    // Другая дата
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  if (loading && chats.length === 0) {
    return (
      <div className="chat-list">
        <div className="loading">Загрузка чатов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-list">
        <div className="error">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2 className="chat-list-title">
          Чаты <span className="chat-count">({filteredChats.length})</span>
        </h2>
      </div>

      <div className="chat-filters">
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Поиск по имени..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Все статусы</option>
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="time">По времени</option>
            <option value="unread">По непрочитанным</option>
          </select>
        </div>
      </div>

      <div className="chat-items">
        {filteredChats.length === 0 ? (
          <div className="no-chats">
            {searchQuery || filterStatus !== 'all' 
              ? 'Ничего не найдено' 
              : 'Нет чатов'}
          </div>
        ) : (
          filteredChats.map(chat => (
            <div
              key={chat.chat_id}
              className={`chat-item ${selectedChatId === chat.chat_id ? 'active' : ''} ${chat.unread_count > 0 ? 'unread' : ''}`}
              onClick={() => onSelectChat(chat.chat_id)}
            >
              <div className="chat-item-avatar">
                {chat.user_info?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              
              <div className="chat-item-content">
                <div className="chat-item-header">
                  <span className="chat-item-name">
                    {chat.user_info?.name || 'Без имени'}
                  </span>
                  <span className="chat-item-time">
                    {formatTime(chat.updated_at)}
                  </span>
                </div>

                <div className="chat-item-message">
                  {chat.last_message?.from_user ? '' : '✓ '}
                  {chat.last_message?.text || 'Нет сообщений'}
                </div>

                <div className="chat-item-footer">
                  {chat.status && (
                    <span 
                      className="chat-item-status"
                      style={{ 
                        backgroundColor: getStatusColor(chat.status),
                        color: '#fff'
                      }}
                    >
                      {getStatusLabel(chat.status)}
                    </span>
                  )}
                  
                  {chat.unread_count > 0 && (
                    <span className="chat-item-unread">
                      {chat.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;

