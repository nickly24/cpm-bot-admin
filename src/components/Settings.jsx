import React, { useState } from 'react';
import BotMessages from './BotMessages';
import StatusesManager from './StatusesManager';
import '../styles/Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('messages');

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">⚙️ Настройки бота</h1>
        <p className="settings-subtitle">
          Управляйте сообщениями и статусами вашего Telegram бота
        </p>
      </div>

      <div className="settings-tabs">
        <button
          className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <span className="tab-icon">📝</span>
          <span className="tab-label">Сообщения</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'statuses' ? 'active' : ''}`}
          onClick={() => setActiveTab('statuses')}
        >
          <span className="tab-icon">👥</span>
          <span className="tab-label">Статусы</span>
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'messages' && <BotMessages />}
        {activeTab === 'statuses' && <StatusesManager />}
      </div>
    </div>
  );
};

export default Settings;

