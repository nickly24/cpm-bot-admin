import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export const useStatuses = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatuses();
  }, []);

  const loadStatuses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Сначала пробуем новый API
      try {
        const response = await apiClient.getConfigStatuses();
        if (response.success && response.data) {
          setStatuses(response.data);
          return;
        }
      } catch (err) {
        console.warn('Новый API статусов недоступен, используем старый:', err.message);
      }

      // Fallback на старый API
      const response = await apiClient.getStatuses();
      if (response.success && response.data) {
        // Преобразуем старый формат в новый
        const convertedStatuses = response.data.map((status, index) => ({
          value: status.value,
          label: status.label,
          emoji: '', // Старый API не содержит эмодзи
          is_system: status.value === 'student' || status.value === 'reserve',
          order: index,
          created_at: new Date().toISOString()
        }));
        setStatuses(convertedStatuses);
      }
    } catch (err) {
      console.error('Ошибка загрузки статусов:', err);
      setError(err.message);
      
      // Fallback на статические статусы
      setStatuses([
        { value: 'student', label: 'Студент', emoji: '👨‍🎓', is_system: true, order: 0 },
        { value: 'reserve', label: 'Резерв', emoji: '📝', is_system: true, order: 1 },
        { value: 'applicant', label: 'Абитуриент', emoji: '🎓', is_system: false, order: 2 },
        { value: 'parent_student', label: 'Родитель студента', emoji: '👨‍👩‍👧', is_system: false, order: 3 },
        { value: 'parent_applicant', label: 'Родитель абитуриента', emoji: '👨‍👩‍👧', is_system: false, order: 4 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (statusValue) => {
    const status = statuses.find(s => s.value === statusValue);
    return status ? status.label : 'Нет статуса';
  };

  const getStatusColor = (statusValue) => {
    // Цветовая схема на основе типа статуса
    const colorMap = {
      student: '#4CAF50',
      reserve: '#FF9800',
      applicant: '#2196F3',
      parent_student: '#9C27B0',
      parent_applicant: '#E91E63'
    };
    
    return colorMap[statusValue] || '#999999';
  };

  const getStatusEmoji = (statusValue) => {
    const status = statuses.find(s => s.value === statusValue);
    return status ? status.emoji : '';
  };

  const getStatusOptions = () => {
    return statuses.map(status => ({
      value: status.value,
      label: status.label,
      emoji: status.emoji
    }));
  };

  const refreshStatuses = () => {
    loadStatuses();
  };

  return {
    statuses,
    loading,
    error,
    getStatusLabel,
    getStatusColor,
    getStatusEmoji,
    getStatusOptions,
    refreshStatuses
  };
};
