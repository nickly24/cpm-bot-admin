import React from 'react';
import { useStats, useStatuses } from '../hooks';
import '../styles/Dashboard.css';

const Dashboard = ({ onNavigateToChats }) => {
  const { stats, loading, error } = useStats();
  const { getStatusLabel, getStatusColor, getStatusEmoji, statuses } = useStatuses();

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Загрузка статистики...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">Ошибка загрузки: {error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard">
        <div className="error">Нет данных</div>
      </div>
    );
  }

  const statusDistribution = stats.status_distribution || {};
  const total = stats.total_chats || 0;

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Статистика</h2>
      
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{total}</div>
            <div className="stat-label">Всего чатов</div>
          </div>
        </div>

        <div className="stat-card stat-card-warning" onClick={onNavigateToChats}>
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total_unread_messages || 0}</div>
            <div className="stat-label">Непрочитанных</div>
          </div>
        </div>
      </div>

      <div className="status-distribution">
        <h3 className="section-title">Распределение по статусам</h3>
        
        <div className="status-bars">
          {statuses.map(status => {
            const count = statusDistribution[status.value] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const color = getStatusColor(status.value);

            return (
              <div key={status.value} className="status-bar-item">
                <div className="status-bar-header">
                  <span className="status-bar-label">
                    <span 
                      className="status-dot" 
                      style={{ backgroundColor: color }}
                    ></span>
                    {status.emoji} {status.label}
                  </span>
                  <span className="status-bar-count">{count}</span>
                </div>
                <div className="status-bar-track">
                  <div 
                    className="status-bar-fill"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: color
                    }}
                  ></div>
                </div>
                <div className="status-bar-percentage">{percentage.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dashboard-chart">
        <h3 className="section-title">Визуализация</h3>
        <div className="pie-chart">
          {statuses.map((status, index) => {
            const count = statusDistribution[status.value] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const color = getStatusColor(status.value);

            return percentage > 0 ? (
              <div 
                key={status.value}
                className="pie-segment"
                style={{
                  '--percentage': percentage,
                  '--color': color,
                  '--rotation': index * 90
                }}
              >
                <div className="pie-label">
                  {status.emoji} {status.label}: {count}
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

