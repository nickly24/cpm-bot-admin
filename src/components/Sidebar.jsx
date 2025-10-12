import React, { useState } from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ currentView, onViewChange, isMobileMenuOpen, onCloseMobileMenu }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Дашборд', icon: '📊' },
    { id: 'chats', label: 'Чаты', icon: '💬' },
    { id: 'broadcast', label: 'Рассылка', icon: '📢' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' },
  ];

  const handleMenuClick = (viewId) => {
    onViewChange(viewId);
    onCloseMobileMenu();
  };

  return (
    <>
      {/* Overlay для мобильных */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={onCloseMobileMenu}></div>
      )}
      
      <aside className={`sidebar ${isMobileMenuOpen ? 'sidebar-open' : ''}`}>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

