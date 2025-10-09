import React from 'react';
import '../styles/Header.css';

const Header = ({ unreadCount }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">
            <span className="header-icon">📱</span>
            Telegram Bot Admin Panel
          </h1>
        </div>
        <div className="header-right">
          {unreadCount > 0 && (
            <div className="header-notification">
              <span className="notification-icon">🔔</span>
              <span className="notification-count">{unreadCount}</span>
              <span className="notification-text">непрочитанных</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

