import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useToast } from './Toast';
import '../styles/Settings.css';

const MESSAGE_INFO = {
  welcome: {
    title: 'Приветствие при первом контакте',
    placeholders: 'нет плейсхолдеров',
  },
  ask_status: {
    title: 'Просьба выбрать статус',
    placeholders: '{name} - имя пользователя',
  },
  status_selected: {
    title: 'Подтверждение выбора статуса',
    placeholders: '{status_name} - название выбранного статуса',
  },
  welcome_back: {
    title: 'Приветствие при повторном контакте',
    placeholders: '{name} - имя пользователя, {status_name} - статус',
  },
  message_received: {
    title: 'Подтверждение получения сообщения',
    placeholders: 'нет плейсхолдеров',
  },
  unsupported_message: {
    title: 'Сообщение о неподдерживаемом типе',
    placeholders: 'нет плейсхолдеров',
  },
  need_status: {
    title: 'Просьба сначала выбрать статус',
    placeholders: 'нет плейсхолдеров',
  },
  admin_message_prefix: {
    title: 'Префикс для сообщений от админа',
    placeholders: '{admin_name} - имя администратора',
  },
};

const BotMessages = () => {
  const toast = useToast();
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await apiClient.getBotMessages();
      setMessages(response.data || {});
    } catch (err) {
      toast.error('Ошибка загрузки сообщений: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (messageKey) => {
    const text = messages[messageKey];
    
    if (!text || !text.trim()) {
      toast.warning('Сообщение не может быть пустым');
      return;
    }

    setSavingKey(messageKey);
    try {
      await apiClient.updateBotMessage(messageKey, text);
      toast.success(`Сообщение "${MESSAGE_INFO[messageKey].title}" обновлено`);
    } catch (err) {
      toast.error('Ошибка сохранения: ' + err.message);
    } finally {
      setSavingKey(null);
    }
  };

  const handleChange = (messageKey, value) => {
    setMessages(prev => ({
      ...prev,
      [messageKey]: value,
    }));
  };

  if (loading) {
    return <div className="settings-loading">Загрузка сообщений...</div>;
  }

  return (
    <div className="bot-messages">
      <h2 className="section-main-title">📝 Настройка сообщений бота</h2>
      <p className="section-description">
        Здесь вы можете изменить текстовые сообщения, которые отправляет бот пользователям.
      </p>

      <div className="messages-list">
        {Object.keys(MESSAGE_INFO).map((key) => (
          <div key={key} className="message-item">
            <div className="message-header">
              <h3 className="message-title">
                {MESSAGE_INFO[key].title}
              </h3>
              <span className="message-key">({key})</span>
            </div>

            <textarea
              className="message-textarea"
              value={messages[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              rows={4}
              placeholder="Введите текст сообщения..."
            />

            <div className="message-footer">
              <div className="message-placeholders">
                💡 <strong>Плейсхолдеры:</strong> {MESSAGE_INFO[key].placeholders}
              </div>
              <button
                className="btn-save"
                onClick={() => handleSave(key)}
                disabled={savingKey === key}
              >
                {savingKey === key ? 'Сохранение...' : '💾 Сохранить'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BotMessages;

