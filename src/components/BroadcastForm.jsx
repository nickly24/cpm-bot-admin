import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { STATUS_OPTIONS, getStatusLabel } from '../constants';
import { useToast } from './Toast';
import '../styles/BroadcastForm.css';

const BroadcastForm = () => {
  const toast = useToast();
  const [message, setMessage] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || 'Администратор');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.warning('Введите текст сообщения');
      return;
    }

    const targetCount = selectedStatuses.length > 0 
      ? `выбранным группам (${selectedStatuses.map(s => getStatusLabel(s)).join(', ')})`
      : 'всем пользователям';

    if (!window.confirm(`Отправить рассылку ${targetCount}?`)) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await apiClient.sendBroadcast(
        message,
        selectedStatuses.length > 0 ? selectedStatuses : null,
        adminName
      );
      
      setResult({
        success: true,
        stats: response.stats,
        message: response.message
      });
      
      toast.success(`Рассылка завершена! Отправлено: ${response.stats.success} из ${response.stats.total_target}`, 5000);
      setMessage('');
    } catch (error) {
      setResult({
        success: false,
        error: error.message
      });
      toast.error('Ошибка рассылки: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (status) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const selectAll = () => {
    setSelectedStatuses(STATUS_OPTIONS.map(opt => opt.value));
  };

  const clearAll = () => {
    setSelectedStatuses([]);
  };

  return (
    <div className="broadcast-form">
      <div className="broadcast-header">
        <h2 className="broadcast-title">📢 Массовая рассылка</h2>
        <p className="broadcast-description">
          Отправьте сообщение всем пользователям или выбранным группам
        </p>
      </div>

      <div className="broadcast-section">
        <h3 className="section-title">Целевая аудитория</h3>
        
        <div className="target-controls">
          <button 
            className="target-control-btn"
            onClick={selectAll}
            disabled={loading}
          >
            Выбрать все
          </button>
          <button 
            className="target-control-btn"
            onClick={clearAll}
            disabled={loading}
          >
            Очистить
          </button>
        </div>

        <div className="target-groups">
          {STATUS_OPTIONS.map(option => (
            <label 
              key={option.value} 
              className={`target-group-item ${selectedStatuses.includes(option.value) ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedStatuses.includes(option.value)}
                onChange={() => toggleStatus(option.value)}
                disabled={loading}
              />
              <span className="target-group-label">{option.label}</span>
            </label>
          ))}
        </div>

        {selectedStatuses.length === 0 && (
          <div className="target-info">
            ℹ️ Будет отправлено <strong>всем пользователям</strong>
          </div>
        )}
      </div>

      <div className="broadcast-section">
        <h3 className="section-title">Текст сообщения</h3>
        
        <textarea
          className="broadcast-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите текст рассылки..."
          rows={6}
          disabled={loading}
        />
        
        <div className="message-counter">
          {message.length} символов
        </div>
      </div>

      <div className="broadcast-section">
        <h3 className="section-title">Отправитель</h3>
        
        <input
          type="text"
          className="admin-name-input"
          placeholder="Имя отправителя"
          value={adminName}
          onChange={(e) => setAdminName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="broadcast-actions">
        <button
          className="broadcast-send-btn"
          onClick={handleSend}
          disabled={loading || !message.trim()}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Отправка...
            </>
          ) : (
            <>
              📤 Отправить рассылку
            </>
          )}
        </button>
      </div>

      {result && (
        <div className={`broadcast-result ${result.success ? 'success' : 'error'}`}>
          <h3 className="result-title">
            {result.success ? '✅ Результат рассылки' : '❌ Ошибка'}
          </h3>
          
          {result.success ? (
            <div className="result-stats">
              <div className="result-stat">
                <div className="result-stat-value">{result.stats.total_target}</div>
                <div className="result-stat-label">Всего получателей</div>
              </div>
              <div className="result-stat success">
                <div className="result-stat-value">{result.stats.success}</div>
                <div className="result-stat-label">Успешно отправлено</div>
              </div>
              {result.stats.failed > 0 && (
                <div className="result-stat error">
                  <div className="result-stat-value">{result.stats.failed}</div>
                  <div className="result-stat-label">Ошибок</div>
                </div>
              )}
            </div>
          ) : (
            <p className="result-error-message">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BroadcastForm;

