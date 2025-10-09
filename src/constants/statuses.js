// Статусы клиентов
export const CLIENT_STATUSES = {
  student: 'Студент',
  applicant: 'Абитуриент',
  parent_student: 'Родитель студента',
  parent_applicant: 'Родитель абитуриента'
};

// Цвета для статусов
export const STATUS_COLORS = {
  student: '#4CAF50',
  applicant: '#2196F3',
  parent_student: '#FF9800',
  parent_applicant: '#9C27B0'
};

// Интервалы обновления (мс)
export const UPDATE_INTERVALS = {
  CHAT_LIST: 5000,
  CHAT_HISTORY: 3000,
  DASHBOARD: 30000
};

// Список статусов для форм
export const STATUS_OPTIONS = [
  { value: 'student', label: 'Студент' },
  { value: 'applicant', label: 'Абитуриент' },
  { value: 'parent_student', label: 'Родитель студента' },
  { value: 'parent_applicant', label: 'Родитель абитуриента' }
];

// Получить название статуса
export const getStatusLabel = (status) => {
  return CLIENT_STATUSES[status] || 'Нет статуса';
};

// Получить цвет статуса
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || '#999999';
};

