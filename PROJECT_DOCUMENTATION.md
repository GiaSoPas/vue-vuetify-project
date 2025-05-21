# Документация проекта ресторана

## Структура проекта

```
vue-vuetify-project/
├── public/                 # Статические файлы
├── src/                    # Исходный код
│   ├── assets/            # Ресурсы (изображения, стили)
│   ├── components/        # Переиспользуемые компоненты
│   ├── views/             # Компоненты страниц
│   ├── router/            # Конфигурация маршрутизации
│   ├── store/             # Хранилище Vuex
│   ├── services/          # Сервисы для работы с API
│   ├── utils/             # Вспомогательные функции
│   ├── App.vue            # Корневой компонент
│   └── main.js            # Точка входа
├── .env                   # Переменные окружения
├── package.json           # Зависимости и скрипты
└── vue.config.js          # Конфигурация Vue
```

## Технологический стек

- **Vue.js 2.x** - Основной фреймворк
- **Vuetify** - UI библиотека
- **Vue Router** - Маршрутизация
- **Vuex** - Управление состоянием
- **Axios** - HTTP клиент
- **ESLint** - Линтинг кода
- **SCSS** - Препроцессор CSS

## Архитектура приложения

### Компонентная структура

1. **Компоненты страниц (views/)**
   - `Dashboard.vue` - Главная страница с дашбордом
   - `Profile.vue` - Личный кабинет
   - `Login.vue` - Страница входа
   - `Register.vue` - Страница регистрации
   - `Menu.vue` - Управление меню
   - `Orders.vue` - Управление заказами

2. **Переиспользуемые компоненты (components/)**
   - `OrderCard.vue` - Карточка заказа
   - `MenuItem.vue` - Элемент меню
   - `StatusChip.vue` - Индикатор статуса

### Маршрутизация

Маршруты определены в `router/index.js`:
```javascript
const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  // ... другие маршруты
]
```

### Управление состоянием

Используется Vuex для централизованного управления состоянием:
- Модули для разных частей приложения
- Геттеры для доступа к данным
- Мутации для синхронных изменений
- Действия для асинхронных операций

## Взаимодействие с бэкендом

### API сервисы

Сервисы для работы с API находятся в `services/`:
```javascript
// services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 5000
})

// Интерцепторы для обработки ошибок и токенов
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

### Основные эндпоинты

- `/api/auth` - Аутентификация
- `/api/orders` - Управление заказами
- `/api/menu` - Управление меню
- `/api/users` - Управление пользователями

## Стилизация

### Темизация

Используется Vuetify для создания единого стиля:
```javascript
// vuetify.js
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#B85B3E',
        secondary: '#F8F7F4',
        // ... другие цвета
      }
    }
  }
})
```

### Компонентные стили

- Используется SCSS
- Стили компонентов изолированы (scoped)
- Переменные для цветов и размеров

## Безопасность

### Аутентификация

1. **JWT токены**
   - Хранение в localStorage
   - Автоматическое добавление в заголовки запросов
   - Обновление токенов

2. **Защита маршрутов**
   ```javascript
   router.beforeEach((to, from, next) => {
     const isAuthenticated = localStorage.getItem('token')
     if (to.meta.requiresAuth && !isAuthenticated) {
       next('/login')
     } else {
       next()
     }
   })
   ```

### Валидация данных

- Валидация форм на клиенте
- Проверка входных данных
- Обработка ошибок API

## Оптимизация

### Производительность

1. **Ленивая загрузка компонентов**
   ```javascript
   const Dashboard = () => import('@/views/Dashboard.vue')
   ```

2. **Кэширование данных**
   - Кэширование в Vuex
   - Мемоизация вычисляемых свойств

### Сборка

- Оптимизация бандла
- Минификация кода
- Оптимизация изображений

## Разработка

### Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск сервера разработки
npm run serve

# Сборка для продакшена
npm run build
```

### Переменные окружения

```
VUE_APP_API_URL=http://localhost:3000
VUE_APP_TITLE=Ресторан
```

## Тестирование

- Unit тесты (Jest)
- E2E тесты (Cypress)
- Тестирование компонентов

## Деплой

1. Сборка проекта
2. Настройка nginx
3. Настройка CI/CD
4. Мониторинг

## Рекомендации по разработке

1. **Стиль кода**
   - Следование Vue Style Guide
   - Использование ESLint
   - Комментирование кода

2. **Компонентный подход**
   - Разделение на логические компоненты
   - Переиспользование компонентов
   - Props валидация

3. **Управление состоянием**
   - Использование Vuex для глобального состояния
   - Локальное состояние в компонентах
   - Чистые мутации

4. **Работа с API**
   - Централизованные сервисы
   - Обработка ошибок
   - Индикация загрузки

## Детальное описание ключевых концепций

### Маршрутизация (Routes)

Маршрутизация в Vue.js реализована с помощью Vue Router. Это официальная библиотека для создания одностраничных приложений (SPA).

#### Основные концепции маршрутизации:

1. **Определение маршрутов**
   ```javascript
   const routes = [
     {
       path: '/',              // URL путь
       name: 'Dashboard',      // Имя маршрута
       component: Dashboard,   // Компонент для отображения
       meta: {                 // Метаданные маршрута
         requiresAuth: true    // Требуется авторизация
       }
     }
   ]
   ```

2. **Навигация**
   - Программная навигация: `this.$router.push('/profile')`
   - Ссылки: `<router-link to="/profile">Профиль</router-link>`

3. **Защита маршрутов**
   - Навигационные guards
   - Проверка авторизации
   - Редиректы

### Взаимодействие с бэкендом

#### Axios - HTTP клиент

Axios используется для выполнения HTTP запросов к бэкенду:

```javascript
// Пример GET запроса
api.get('/orders')
  .then(response => {
    this.orders = response.data
  })
  .catch(error => {
    console.error('Ошибка:', error)
  })

// Пример POST запроса
api.post('/orders', {
  items: this.selectedItems,
  table: this.tableNumber
})
```

#### Структура API запросов:

1. **Базовый URL**
   ```javascript
   const api = axios.create({
     baseURL: process.env.VUE_APP_API_URL
   })
   ```

2. **Интерцепторы**
   - Добавление токенов
   - Обработка ошибок
   - Логирование

3. **Обработка ответов**
   - Трансформация данных
   - Обработка ошибок
   - Кэширование

### Структура страниц Vue

#### Компонент страницы:

```vue
<template>
  <!-- HTML разметка -->
  <div class="page">
    <h1>{{ title }}</h1>
    <component-name />
  </div>
</template>

<script>
export default {
  name: 'PageName',
  
  // Данные компонента
  data() {
    return {
      title: 'Заголовок'
    }
  },

  // Вычисляемые свойства
  computed: {
    formattedTitle() {
      return this.title.toUpperCase()
    }
  },

  // Методы
  methods: {
    handleClick() {
      // Логика
    }
  },

  // Хуки жизненного цикла
  mounted() {
    // Код при монтировании
  }
}
</script>

<style scoped>
/* Стили компонента */
.page {
  padding: 20px;
}
</style>
```

#### Жизненный цикл компонента:

1. **Создание**
   - `beforeCreate`
   - `created`

2. **Монтирование**
   - `beforeMount`
   - `mounted`

3. **Обновление**
   - `beforeUpdate`
   - `updated`

4. **Уничтожение**
   - `beforeDestroy`
   - `destroyed`

### Переиспользуемые компоненты

Переиспользуемые компоненты - это строительные блоки приложения, которые можно использовать в разных местах.

#### Пример компонента:

```vue
<!-- components/Button.vue -->
<template>
  <v-btn
    :color="color"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  name: 'CustomButton',
  
  // Валидация входных параметров
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
```

#### Использование компонента:

```vue
<template>
  <custom-button
    color="success"
    @click="handleClick"
  >
    Нажми меня
  </custom-button>
</template>
```

#### Преимущества переиспользуемых компонентов:

1. **Переиспользование кода**
   - Уменьшение дублирования
   - Единый стиль
   - Легкость поддержки

2. **Инкапсуляция**
   - Изолированная логика
   - Собственные стили
   - Четкий интерфейс

3. **Гибкость**
   - Настраиваемые параметры
   - События
   - Слоты для контента

4. **Тестируемость**
   - Изолированное тестирование
   - Простая отладка
   - Документированный API 