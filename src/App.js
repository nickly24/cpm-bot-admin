import React, { useState, useEffect } from 'react';
import { Header, Sidebar, Dashboard, ChatList, ChatWindow, BroadcastForm } from './components';
import { useChats } from './hooks';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { chats } = useChats();

  // Подсчет непрочитанных сообщений
  const totalUnread = chats.reduce((sum, chat) => sum + (chat.unread_count || 0), 0);

  // Обработчик выбора чата
  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    // На мобильных устройствах переключаемся в режим просмотра чата
    if (window.innerWidth <= 768) {
      setCurrentView('chat-detail');
    }
  };

  // Обработчик возврата к списку чатов (для мобильных)
  const handleBackToList = () => {
    setSelectedChatId(null);
    setCurrentView('chats');
  };

  // Навигация из Dashboard в Чаты
  const handleNavigateToChats = () => {
    setCurrentView('chats');
  };

  // Закрытие мобильного меню
  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Обработчик изменения вида
  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view !== 'chats') {
      setSelectedChatId(null);
    }
  };

  // Запрос разрешения на уведомления при загрузке
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Рендер основного контента в зависимости от текущего вида
  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigateToChats={handleNavigateToChats} />;
      
      case 'chats':
        return (
          <div className="chats-view">
            <div className={`chats-list-panel ${selectedChatId ? 'hidden-mobile' : ''}`}>
              <ChatList 
                onSelectChat={handleSelectChat} 
                selectedChatId={selectedChatId} 
              />
            </div>
            <div className={`chats-window-panel ${!selectedChatId ? 'hidden-mobile' : ''}`}>
              {selectedChatId && window.innerWidth <= 768 && (
                <button className="back-button" onClick={handleBackToList}>
                  ← Назад к списку
                </button>
              )}
              <ChatWindow chatId={selectedChatId} />
            </div>
          </div>
        );
      
      case 'chat-detail':
        return (
          <div className="chats-view">
            <div className="chats-window-panel">
              <button className="back-button" onClick={handleBackToList}>
                ← Назад к списку
              </button>
              <ChatWindow chatId={selectedChatId} />
            </div>
          </div>
        );
      
      case 'broadcast':
        return <BroadcastForm />;
      
      default:
        return <Dashboard onNavigateToChats={handleNavigateToChats} />;
    }
  };

  return (
    <div className="app">
      <Header unreadCount={totalUnread} />
      
      <div className="app-container">
        {/* Кнопка меню для мобильных */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>

        <Sidebar 
          currentView={currentView} 
          onViewChange={handleViewChange}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={handleCloseMobileMenu}
        />
        
        <main className="app-main">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
