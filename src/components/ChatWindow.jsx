import React, { useState, useEffect, useRef } from 'react';
import { useChatHistory } from '../hooks';
import { STATUS_OPTIONS, getStatusLabel, getStatusColor } from '../constants';
import '../styles/ChatWindow.css';

const ChatWindow = ({ chatId }) => {
  const { messages, userInfo, status, loading, error, sendMessage, updateStatus } = useChatHistory(chatId);
  const [newMessage, setNewMessage] = useState('');
  const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || 'Администратор');
  const [isSending, setIsSending] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Сохраняем имя администратора
  useEffect(() => {
    localStorage.setItem('adminName', adminName);
  }, [adminName]);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(newMessage, adminName);
      setNewMessage('');
    } catch (err) {
      alert('Ошибка отправки: ' + err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatus(newStatus);
      setShowStatusMenu(false);
    } catch (err) {
      alert('Ошибка изменения статуса: ' + err.message);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return 'Сегодня';
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    }
    
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Группировка сообщений по датам
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatMessageDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  if (!chatId) {
    return (
      <div className="chat-window">
        <div className="chat-empty">
          <div className="chat-empty-icon">💬</div>
          <h3>Выберите чат</h3>
          <p>Выберите чат из списка слева, чтобы начать общение</p>
        </div>
      </div>
    );
  }

  if (loading && !userInfo) {
    return (
      <div className="chat-window">
        <div className="loading">Загрузка чата...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-window">
        <div className="error">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Заголовок чата */}
      <div className="chat-window-header">
        <div className="chat-user-info">
          <div className="chat-user-avatar">
            {userInfo?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="chat-user-details">
            <h3 className="chat-user-name">{userInfo?.name || 'Без имени'}</h3>
            {userInfo?.username && (
              <p className="chat-user-username">@{userInfo.username}</p>
            )}
          </div>
        </div>

        <div className="chat-user-status">
          <button 
            className="status-button"
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            style={{ 
              backgroundColor: getStatusColor(status),
              color: '#fff'
            }}
          >
            {getStatusLabel(status)}
            <span className="status-arrow">▼</span>
          </button>

          {showStatusMenu && (
            <div className="status-menu">
              {STATUS_OPTIONS.map(option => (
                <button
                  key={option.value}
                  className={`status-menu-item ${status === option.value ? 'active' : ''}`}
                  onClick={() => handleStatusChange(option.value)}
                  style={{ 
                    '--status-color': getStatusColor(option.value)
                  }}
                >
                  <span 
                    className="status-menu-dot"
                    style={{ backgroundColor: getStatusColor(option.value) }}
                  ></span>
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Сообщения */}
      <div className="chat-messages" ref={messagesContainerRef}>
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="no-messages">
            <p>Нет сообщений</p>
          </div>
        ) : (
          Object.keys(groupedMessages).map(date => (
            <div key={date}>
              <div className="message-date-divider">
                <span>{date}</span>
              </div>
              {groupedMessages[date].map(msg => (
                <div
                  key={msg._id}
                  className={`message ${msg.from_user ? 'message-user' : 'message-admin'} ${
                    !msg.is_read && msg.from_user ? 'message-unread' : ''
                  }`}
                >
                  <div className="message-bubble">
                    {!msg.from_user && msg.admin_name && (
                      <div className="message-sender">{msg.admin_name}</div>
                    )}
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">
                      {formatMessageTime(msg.timestamp)}
                      {!msg.from_user && (
                        <span className="message-status"> ✓</span>
                      )}
                      {!msg.is_read && msg.from_user && (
                        <span className="message-unread-indicator"> •</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Форма отправки */}
      <div className="chat-input-container">
        <div className="chat-input-admin">
          <input
            type="text"
            className="admin-name-input"
            placeholder="Ваше имя"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
          />
        </div>
        
        <form onSubmit={handleSend} className="chat-input-form">
          <input
            type="text"
            className="message-input"
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? '⏳' : '📤'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;

