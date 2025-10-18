import React, { useState, useEffect, useRef } from 'react';
import { useChatHistory, useStatuses } from '../hooks';
import { apiClient } from '../api/client';
import Modal from './Modal';
import { useToast } from './Toast';
import '../styles/ChatWindow.css';

const ChatWindow = ({ chatId }) => {
  const { messages, userInfo, status, loading, error, sendMessage, updateStatus } = useChatHistory(chatId);
  const { getStatusLabel, getStatusColor, getStatusOptions } = useStatuses();
  const toast = useToast();
  const [newMessage, setNewMessage] = useState('');
  const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || 'Администратор');
  const [isSending, setIsSending] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
      toast.success('Сообщение отправлено');
    } catch (err) {
      toast.error('Ошибка отправки: ' + err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatus(newStatus);
      setShowStatusMenu(false);
      toast.success('Статус пользователя обновлен');
    } catch (err) {
      toast.error('Ошибка изменения статуса: ' + err.message);
    }
  };

  const handleOpenEditName = () => {
    setEditedName(userInfo?.name || '');
    setShowEditNameModal(true);
  };

  const handleSaveEditName = async () => {
    if (!editedName.trim()) {
      toast.warning('Имя не может быть пустым');
      return;
    }

    setIsUpdatingName(true);
    try {
      const result = await apiClient.updateUserName(chatId, editedName);
      if (result.success) {
        setShowEditNameModal(false);
        toast.success('Имя обновлено успешно!');
        // Обновляем данные
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      toast.error('Ошибка обновления имени: ' + err.message);
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleDeleteChat = async () => {
    setIsDeleting(true);
    try {
      const result = await apiClient.deleteChat(chatId);
      if (result.success) {
        toast.success(`Чат удален успешно! Удалено сообщений: ${result.deleted.messages_count}`, 3000);
        setShowDeleteModal(false);
        // Перезагружаем страницу или возвращаемся к списку
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (err) {
      toast.error('Ошибка удаления чата: ' + err.message);
    } finally {
      setIsDeleting(false);
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

  // Сортировка сообщений по времени (от старых к новым)
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  // Группировка сообщений по датам
  const groupedMessages = sortedMessages.reduce((groups, message) => {
    const date = formatMessageDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  // Сортировка дат (от старых к новым)
  const sortedDates = Object.keys(groupedMessages).sort((a, b) => {
    // Получаем первое сообщение каждой группы для сравнения дат
    const dateA = new Date(groupedMessages[a][0].timestamp);
    const dateB = new Date(groupedMessages[b][0].timestamp);
    return dateA - dateB;
  });

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
            <div className="chat-user-name-row">
              <h3 className="chat-user-name">{userInfo?.name || 'Без имени'}</h3>
              <button 
                className="edit-name-btn" 
                onClick={handleOpenEditName}
                title="Редактировать имя"
              >
                ✏️
              </button>
            </div>
            {userInfo?.username && (
              <p className="chat-user-username">@{userInfo.username}</p>
            )}
          </div>
        </div>

        <div className="chat-header-actions">
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
              {getStatusOptions().map(option => (
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
                  {option.emoji} {option.label}
                </button>
              ))}
            </div>
          )}
          </div>

          <button 
            className="delete-chat-btn"
            onClick={() => setShowDeleteModal(true)}
            title="Удалить чат"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Сообщения */}
      <div className="chat-messages" ref={messagesContainerRef}>
        {sortedDates.length === 0 ? (
          <div className="no-messages">
            <p>Нет сообщений</p>
          </div>
        ) : (
          sortedDates.map(date => (
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

      {/* Модальное окно редактирования имени */}
      <Modal
        isOpen={showEditNameModal}
        onClose={() => setShowEditNameModal(false)}
        title="✏️ Редактировать имя"
      >
        <div className="edit-name-modal">
          <p className="modal-description">Изменить имя пользователя</p>
          <input
            type="text"
            className="edit-name-input"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="Введите новое имя"
            disabled={isUpdatingName}
          />
          <div className="modal-actions">
            <button
              className="btn-primary"
              onClick={handleSaveEditName}
              disabled={isUpdatingName || !editedName.trim()}
            >
              {isUpdatingName ? 'Сохранение...' : '✅ Сохранить'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => setShowEditNameModal(false)}
              disabled={isUpdatingName}
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно удаления чата */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="⚠️ Удалить чат?"
        className="delete-modal"
      >
        <div className="delete-chat-modal">
          <div className="warning-box">
            <p className="warning-text">
              ⚠️ <strong>Это действие необратимо!</strong>
            </p>
            <p className="warning-description">
              Будет удалено:
            </p>
            <ul className="delete-info-list">
              <li><strong>Пользователь:</strong> {userInfo?.name || 'Без имени'}</li>
              <li><strong>Username:</strong> @{userInfo?.username || 'нет'}</li>
              <li><strong>Сообщений:</strong> {messages.length}</li>
            </ul>
            <p className="warning-footer">
              Чат будет удален из базы данных безвозвратно!
            </p>
          </div>
          <div className="modal-actions">
            <button
              className="btn-danger"
              onClick={handleDeleteChat}
              disabled={isDeleting}
            >
              {isDeleting ? 'Удаление...' : '🗑️ Да, удалить'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChatWindow;

