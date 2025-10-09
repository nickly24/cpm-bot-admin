# 🎨 Style Guide - Telegram Bot Admin Panel

## Руководство по стилям и UI дизайну

Этот документ содержит полное описание стилей, цветов и дизайн-системы админ-панели.

---

## 📐 Общие принципы дизайна

### Философия
- **Современный и чистый дизайн** - минимализм с акцентом на функциональность
- **Профессиональный вид** - подходит для корпоративного использования
- **Интуитивная навигация** - понятный интерфейс без обучения
- **Адаптивность** - одинаково хорошо работает на всех устройствах

### Визуальная иерархия
1. Заголовки и важные элементы выделяются размером и цветом
2. Группировка связанных элементов
3. Достаточное пространство между блоками
4. Четкие границы и разделители

---

## 🎨 Цветовая палитра

### Основные цвета

#### Фиолетовый градиент (Primary)
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
- **Использование**: Основной акцент, кнопки, заголовки
- **Компоненты**: Header, кнопки отправки, активные элементы

#### Розовый градиент (Secondary)
```css
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```
- **Использование**: Предупреждения, непрочитанные сообщения
- **Компоненты**: Статистика непрочитанных, важные уведомления

### Статусы клиентов

#### 🟢 Студент
```css
color: #4CAF50;
```
- Зеленый цвет символизирует активность и текущее обучение

#### 🔵 Абитуриент
```css
color: #2196F3;
```
- Синий цвет для будущих студентов

#### 🟠 Родитель студента
```css
color: #FF9800;
```
- Оранжевый для родителей текущих студентов

#### 🟣 Родитель абитуриента
```css
color: #9C27B0;
```
- Пурпурный для родителей будущих студентов

### Нейтральные цвета

#### Фоны
```css
/* Основной фон приложения */
background: #f5f7fa;

/* Фон карточек и панелей */
background: #ffffff;

/* Вторичный фон */
background: #fafafa;

/* Ховер состояния */
background: #f8f9fa;
```

#### Текст
```css
/* Основной текст */
color: #2c3e50;

/* Вторичный текст */
color: #666666;

/* Третичный текст / плейсхолдеры */
color: #999999;
```

#### Границы
```css
/* Основные границы */
border: 1px solid #e0e0e0;

/* Разделители */
border: 1px solid #f0f0f0;

/* Фокус состояние */
border: 2px solid #2196F3;
```

### Служебные цвета

#### Успех
```css
color: #28a745;
background: #d4edda;
```

#### Ошибка
```css
color: #dc3545;
background: #f8d7da;
```

#### Предупреждение
```css
color: #ffc107;
background: #fff3cd;
```

#### Информация
```css
color: #17a2b8;
background: #d1ecf1;
```

---

## 📝 Типографика

### Шрифты

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;
```

### Размеры заголовков

#### H1 - Главные заголовки
```css
font-size: 32px;
font-weight: 700;
color: #2c3e50;
```
**Использование**: Заголовки страниц (Dashboard, Broadcast)

#### H2 - Подзаголовки
```css
font-size: 24px;
font-weight: 700;
color: #2c3e50;
```
**Использование**: Заголовки секций (Список чатов)

#### H3 - Мелкие заголовки
```css
font-size: 20px;
font-weight: 600;
color: #2c3e50;
```
**Использование**: Заголовки блоков и карточек

### Размеры текста

#### Основной текст
```css
font-size: 15px;
line-height: 1.5;
```

#### Вторичный текст
```css
font-size: 14px;
line-height: 1.4;
```

#### Мелкий текст
```css
font-size: 13px;
line-height: 1.3;
```

#### Микро-текст
```css
font-size: 12px;
line-height: 1.2;
```

### Начертания

- **Bold (700)**: Заголовки, важная информация
- **Semi-Bold (600)**: Подзаголовки, имена пользователей
- **Medium (500)**: Метки, лейблы
- **Regular (400)**: Основной текст

---

## 📦 Компоненты

### Кнопки

#### Основная кнопка
```css
padding: 16px 48px;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
border: none;
border-radius: 14px;
font-size: 18px;
font-weight: 600;
box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
```

**Hover эффект**:
```css
transform: translateY(-2px);
box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
```

#### Вторичная кнопка
```css
padding: 10px 20px;
border: 2px solid #2196F3;
background: white;
color: #2196F3;
border-radius: 10px;
```

**Hover эффект**:
```css
background: #2196F3;
color: white;
```

#### Маленькая кнопка
```css
padding: 8px 16px;
border-radius: 20px;
font-size: 14px;
font-weight: 500;
```

### Input поля

#### Текстовое поле
```css
padding: 12px 16px;
border: 2px solid #e0e0e0;
border-radius: 12px;
font-size: 15px;
transition: all 0.3s ease;
```

**Focus состояние**:
```css
border-color: #2196F3;
background: #f8f9fa;
```

#### Textarea
```css
padding: 16px 18px;
border: 2px solid #e0e0e0;
border-radius: 12px;
font-size: 15px;
resize: vertical;
```

#### Select
```css
padding: 10px 14px;
border: 2px solid #e0e0e0;
border-radius: 10px;
font-size: 14px;
background: white;
```

### Карточки

#### Базовая карточка
```css
background: white;
border-radius: 16px;
padding: 24px;
box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
```

**Hover эффект**:
```css
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
transform: translateY(-2px);
```

#### Stat карточка (градиент)
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
border-radius: 16px;
padding: 24px;
```

### Бейджи

#### Статус бейдж
```css
font-size: 12px;
padding: 4px 10px;
border-radius: 12px;
font-weight: 500;
color: white;
background: [цвет статуса];
```

#### Счетчик непрочитанных
```css
background: #f44336;
color: white;
font-size: 12px;
font-weight: 700;
padding: 4px 8px;
border-radius: 12px;
min-width: 24px;
text-align: center;
```

### Аватары

#### Круглый аватар
```css
width: 48px;
height: 48px;
border-radius: 50%;
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
font-size: 20px;
font-weight: 600;
display: flex;
align-items: center;
justify-content: center;
```

### Сообщения в чате

#### Сообщение от пользователя
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
border-radius: 16px;
border-bottom-right-radius: 4px;
padding: 12px 16px;
max-width: 65%;
```

#### Сообщение от администратора
```css
background: white;
color: #2c3e50;
border-radius: 16px;
border-bottom-left-radius: 4px;
padding: 12px 16px;
max-width: 65%;
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
```

---

## 🎭 Анимации

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
animation: fadeIn 0.3s ease;
```

### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
animation: slideUp 0.4s ease;
```

### Slide Down
```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
animation: slideDown 0.2s ease;
```

### Pulse (для непрочитанных)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
animation: pulse 2s ease-in-out infinite;
```

### Spin (для загрузки)
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
animation: spin 0.8s linear infinite;
```

### Ring (для уведомлений)
```css
@keyframes ring {
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(-10deg); }
  20%, 40% { transform: rotate(10deg); }
}
animation: ring 2s ease-in-out infinite;
```

---

## 📐 Отступы и размеры

### Padding/Margin scale

```css
/* Micro */
4px, 6px, 8px

/* Small */
10px, 12px, 14px

/* Medium */
16px, 18px, 20px

/* Large */
24px, 28px, 32px

/* Extra Large */
40px, 48px, 64px
```

### Border Radius

```css
/* Small elements */
border-radius: 8px;

/* Medium elements */
border-radius: 12px;

/* Large cards */
border-radius: 16px;

/* Pills/badges */
border-radius: 20px, 24px;

/* Circles */
border-radius: 50%;
```

### Shadows

#### Легкая тень
```css
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
```

#### Средняя тень
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
```

#### Глубокая тень
```css
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
```

#### Цветная тень (для кнопок)
```css
box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
```

---

## 📱 Адаптивные брейкпоинты

### Desktop Large
```css
@media (min-width: 1920px) { }
```
- Максимальная ширина контента

### Desktop
```css
@media (min-width: 1024px) and (max-width: 1919px) { }
```
- Стандартные десктопы и ноутбуки

### Tablet
```css
@media (max-width: 1024px) { }
```
- Планшеты и маленькие ноутбуки

### Mobile
```css
@media (max-width: 768px) { }
```
- Смартфоны в ландшафтном режиме
- Маленькие планшеты

### Mobile Small
```css
@media (max-width: 480px) { }
```
- Смартфоны в портретном режиме

### Адаптивные изменения

**Desktop → Mobile**:
- Padding уменьшается на 25-40%
- Font-size уменьшается на 2-4px
- Grid колонки: 3-4 → 2 → 1
- Боковое меню → гамбургер меню
- Две колонки → одна колонка

---

## 🎯 Best Practices

### Доступность (A11y)

1. **Контрастность текста**
   - Минимум 4.5:1 для обычного текста
   - Минимум 3:1 для крупного текста

2. **Размеры кликабельных элементов**
   - Минимум 44x44px на мобильных
   - Минимум 40x40px на десктопе

3. **Focus состояния**
   - Всегда видимые при навигации с клавиатуры
   - Цвет: #2196F3

### Производительность

1. **Transitions**: только opacity и transform
2. **Анимации**: используйте transform вместо left/top
3. **Images**: оптимизация и lazy loading
4. **CSS**: минификация в production

### Консистентность

1. Используйте константы из `src/constants/statuses.js`
2. Следуйте единой системе отступов
3. Применяйте одинаковые border-radius для похожих элементов
4. Используйте градиенты из этого гайда

---

## 🎨 Примеры использования

### Кнопка отправки сообщения
```css
.send-button {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
```

### Карточка чата
```css
.chat-item {
  display: flex;
  gap: 14px;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-item:hover {
  background: #f8f9fa;
}

.chat-item.active {
  background: #e3f2fd;
  border-left: 4px solid #2196F3;
}
```

### Stat карточка
```css
.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}
```

---

## 📚 Ресурсы

### Инструменты для работы с цветом
- [Coolors](https://coolors.co/) - генератор палитр
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/) - проверка контрастности

### Иконки
- Используются emoji для простоты
- Альтернативы: Font Awesome, Material Icons

### Шрифты
- System fonts для производительности
- Альтернативы: Inter, Roboto, Open Sans

---

**Версия**: 1.0.0  
**Дата**: 09.10.2025  
**Автор**: Telegram Bot Admin Panel Team

