# 📱 Telegram Bot Admin Panel

> Современная веб-админка для управления Telegram ботом с адаптивным дизайном

## 🎯 О проекте

Полнофункциональная админ-панель на React.js для управления Telegram ботом. Позволяет просматривать чаты, отвечать на сообщения клиентов, управлять статусами пользователей и выполнять массовые рассылки.

## ✨ Возможности

- 📊 **Дашборд** - статистика по чатам и пользователям
- 💬 **Управление чатами** - просмотр и ответы на сообщения
- 🔔 **Уведомления** - звуковые и визуальные оповещения
- 📢 **Массовая рассылка** - отправка сообщений по группам
- 🎨 **Адаптивный дизайн** - работает на всех устройствах
- ⚡ **Автообновление** - данные обновляются в реальном времени

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm start

# Сборка для production
npm run build
```

Приложение откроется в браузере по адресу `http://localhost:3000`

## 📚 Документация

- 📖 [**Полная документация**](ADMIN_PANEL_README.md) - детальное руководство
- ⚡ [**Быстрый старт**](QUICK_START.md) - начните работу за 3 минуты
- 🎨 [**Руководство по стилям**](STYLE_GUIDE.md) - все цвета и UI компоненты

## 🛠️ Технологии

- **React.js** - фреймворк для UI
- **React Hooks** - управление состоянием
- **CSS3** - адаптивные стили и анимации
- **Fetch API** - работа с REST API
- **Browser Notifications API** - уведомления

## 📦 Структура проекта

```
src/
├── api/              # API клиент
├── components/       # React компоненты
├── hooks/            # Custom hooks
├── constants/        # Константы и настройки
├── styles/           # CSS стили
├── App.js            # Главный компонент
└── index.js          # Точка входа
```

## 🎨 Дизайн

- Современный минималистичный интерфейс
- Фиолетовые градиенты для акцентов
- Полностью адаптивный дизайн
- Плавные анимации и переходы

## 📱 Поддержка устройств

- ✅ Desktop (1920px+)
- ✅ Laptop (1024px - 1920px)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 768px)

## 🔧 Конфигурация

### API Endpoint

По умолчанию используется `http://0.0.0.0:80/api`

Для изменения отредактируйте файл `src/api/client.js`:

```javascript
const API_BASE_URL = 'http://ваш-адрес:порт/api';
```

### Интервалы обновления

В `src/constants/statuses.js`:

```javascript
export const UPDATE_INTERVALS = {
  CHAT_LIST: 5000,      // Список чатов
  CHAT_HISTORY: 3000,   // История чата
  DASHBOARD: 30000      // Дашборд
};
```

## 🎯 Использование

### Просмотр чатов
1. Откройте раздел "Чаты"
2. Используйте поиск и фильтры
3. Кликните на чат для открытия

### Ответ на сообщение
1. Откройте чат
2. Введите ответ в поле внизу
3. Нажмите кнопку отправки

### Массовая рассылка
1. Откройте раздел "Рассылка"
2. Выберите целевые группы
3. Введите текст и отправьте

## 📊 API Endpoints

Используются следующие endpoints:

- `GET /api/chats` - список чатов
- `GET /api/chats/:id` - история чата
- `POST /api/chats/:id/send` - отправка сообщения
- `POST /api/chats/:id/mark-read` - пометка как прочитанное
- `PUT /api/chats/:id/status` - изменение статуса
- `POST /api/broadcast` - массовая рассылка
- `GET /api/stats` - статистика

## 🐛 Отладка

### Проверка backend
```bash
curl http://0.0.0.0:80/api/health
```

### Консоль браузера
Откройте DevTools (F12) для просмотра:
- API запросов
- Ошибок
- Логов автообновления

## 📝 Лицензия

Этот проект создан для управления Telegram ботом учебного заведения.

---

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

---

**Разработано с ❤️ для Telegram Bot Admin Panel**
# cpm-bot-admin
