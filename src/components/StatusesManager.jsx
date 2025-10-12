import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { useToast } from './Toast';
import Modal from './Modal';
import '../styles/Settings.css';

const StatusesManager = () => {
  const toast = useToast();
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState({ value: '', label: '', emoji: '' });
  const [editingStatus, setEditingStatus] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async () => {
    try {
      const response = await apiClient.getConfigStatuses();
      setStatuses(response.data || []);
    } catch (err) {
      toast.error('Ошибка загрузки статусов: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateValue = (value) => {
    const regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(value);
  };

  const handleAddStatus = async () => {
    if (!newStatus.value.trim() || !newStatus.label.trim()) {
      toast.warning('Заполните обязательные поля (Value и Название)');
      return;
    }

    if (!validateValue(newStatus.value)) {
      toast.warning('Value может содержать только латинские буквы, цифры и подчеркивания');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.createStatus(newStatus.value, newStatus.label, newStatus.emoji);
      toast.success('Статус добавлен успешно!');
      setNewStatus({ value: '', label: '', emoji: '' });
      await loadStatuses();
    } catch (err) {
      toast.error('Ошибка добавления статуса: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditStatus = (status) => {
    setEditingStatus({
      value: status.value,
      label: status.label,
      emoji: status.emoji || '',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingStatus.label.trim()) {
      toast.warning('Название не может быть пустым');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.updateConfigStatus(
        editingStatus.value,
        editingStatus.label,
        editingStatus.emoji
      );
      toast.success('Статус обновлен успешно!');
      setShowEditModal(false);
      setEditingStatus(null);
      await loadStatuses();
    } catch (err) {
      toast.error('Ошибка обновления статуса: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (status) => {
    setStatusToDelete(status);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!statusToDelete) return;

    setIsSubmitting(true);
    try {
      await apiClient.deleteConfigStatus(statusToDelete.value);
      toast.success('Статус удален успешно!');
      setShowDeleteModal(false);
      setStatusToDelete(null);
      await loadStatuses();
    } catch (err) {
      toast.error('Ошибка удаления: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="settings-loading">Загрузка статусов...</div>;
  }

  return (
    <div className="statuses-manager">
      <h2 className="section-main-title">👥 Управление статусами клиентов</h2>
      <p className="section-description">
        Создавайте и управляйте статусами для категоризации пользователей.
        Системные статусы (🔒) нельзя удалить, но можно редактировать их название и эмодзи.
      </p>

      {/* Список существующих статусов */}
      <div className="statuses-list-section">
        <h3 className="section-title">Список статусов:</h3>
        <div className="statuses-list">
          {statuses.map((status) => (
            <div key={status.value} className="status-card">
              <div className="status-card-header">
                <div className="status-card-title">
                  <span className="status-emoji">{status.emoji || '📌'}</span>
                  <span className="status-label">{status.label}</span>
                  <span className="status-value">({status.value})</span>
                  {status.is_system && <span className="system-badge">🔒 Системный</span>}
                </div>
              </div>
              {status.is_system && (
                <p className="status-description">
                  Системный статус - нельзя удалить, можно редактировать название и эмодзи
                </p>
              )}
              <div className="status-card-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEditStatus(status)}
                >
                  ✏️ Редактировать
                </button>
                {!status.is_system && (
                  <button
                    className="btn-delete-status"
                    onClick={() => handleDeleteClick(status)}
                  >
                    🗑️ Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Форма добавления нового статуса */}
      <div className="add-status-section">
        <h3 className="section-title">Добавить новый статус:</h3>
        <div className="add-status-form">
          <div className="form-row">
            <div className="form-group">
              <label>Value (англ) *</label>
              <input
                type="text"
                className="form-input"
                placeholder="vip_client"
                value={newStatus.value}
                onChange={(e) => setNewStatus({ ...newStatus, value: e.target.value })}
              />
              <span className="form-hint">Только латиница, цифры и подчеркивания</span>
            </div>
            <div className="form-group">
              <label>Название *</label>
              <input
                type="text"
                className="form-input"
                placeholder="VIP Клиент"
                value={newStatus.label}
                onChange={(e) => setNewStatus({ ...newStatus, label: e.target.value })}
              />
            </div>
            <div className="form-group form-group-small">
              <label>Эмодзи</label>
              <input
                type="text"
                className="form-input"
                placeholder="⭐"
                value={newStatus.emoji}
                onChange={(e) => setNewStatus({ ...newStatus, emoji: e.target.value })}
                maxLength={2}
              />
            </div>
          </div>
          <button
            className="btn-add"
            onClick={handleAddStatus}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Добавление...' : '➕ Добавить статус'}
          </button>
        </div>
      </div>

      {/* Модальное окно редактирования */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="✏️ Редактировать статус"
      >
        {editingStatus && (
          <div className="edit-status-modal">
            <div className="form-group">
              <label>Value</label>
              <input
                type="text"
                className="form-input"
                value={editingStatus.value}
                disabled
              />
              <span className="form-hint">Value нельзя изменить</span>
            </div>
            <div className="form-group">
              <label>Название *</label>
              <input
                type="text"
                className="form-input"
                value={editingStatus.label}
                onChange={(e) =>
                  setEditingStatus({ ...editingStatus, label: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Эмодзи</label>
              <input
                type="text"
                className="form-input"
                value={editingStatus.emoji}
                onChange={(e) =>
                  setEditingStatus({ ...editingStatus, emoji: e.target.value })
                }
                maxLength={2}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={handleSaveEdit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Сохранение...' : '💾 Сохранить'}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowEditModal(false)}
                disabled={isSubmitting}
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Модальное окно удаления */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="⚠️ Удалить статус?"
        className="delete-modal"
      >
        {statusToDelete && (
          <div className="delete-status-modal">
            <div className="warning-box">
              <p className="warning-text">
                ⚠️ <strong>Это действие необратимо!</strong>
              </p>
              <p className="warning-description">Будет удален статус:</p>
              <ul className="delete-info-list">
                <li>
                  <strong>Value:</strong> {statusToDelete.value}
                </li>
                <li>
                  <strong>Название:</strong> {statusToDelete.label}
                </li>
                <li>
                  <strong>Эмодзи:</strong> {statusToDelete.emoji || 'нет'}
                </li>
              </ul>
              <p className="warning-footer">
                Пользователи с этим статусом останутся в системе, но их статус будет пустым.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-danger"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Удаление...' : '🗑️ Да, удалить'}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting}
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StatusesManager;

