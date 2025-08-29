# Kanban App

Полноценное канбан приложение с возможностью регистрации и входа под своим логином.

## Технологии

- **Next.js 15** - React фреймворк
- **TypeScript** - типизация
- **Material-UI** - UI компоненты
- **Zustand** - управление состоянием
- **Prisma** - ORM для работы с БД
- **PostgreSQL** - база данных
- **Tailwind CSS** - стилизация

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Настройка базы данных
# 1. Создайте .env файл с DATABASE_URL
# 2. Запустите миграции
npx prisma migrate dev --name init

# Генерация Prisma Client
npx prisma generate

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен версии
npm start
```

## Настройка базы данных

1. **Выберите хостинг БД** (рекомендуется Supabase)
2. **Создайте проект** и получите DATABASE_URL
3. **Создайте .env файл**:
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database_name"
   ```
4. **Запустите миграции**:
   ```bash
   npx prisma migrate dev --name init
   ```
5. **Проверьте подключение**:
   ```bash
   npx prisma studio
   ```

## Структура проекта

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API роуты
│   │   └── tasks/      # API для задач
│   ├── layout.tsx      # Корневой layout
│   ├── page.tsx        # Главная страница
│   └── globals.css     # Глобальные стили
├── components/         # React компоненты
│   ├── Header/         # Заголовок
│   ├── Panel/          # Панель добавления
│   ├── TodoList/       # Список задач
│   └── Providers.tsx   # Material-UI провайдер
├── lib/                # Утилиты
│   └── prisma.ts       # Prisma клиент
├── store/              # Zustand stores
│   └── todoStore.ts    # Store для задач
└── types/              # TypeScript типы
    ├── todo.ts         # Типы для задач
    └── database.ts     # Типы БД
```

## API Endpoints

### Задачи
- `GET /api/tasks` - получить все задачи
- `POST /api/tasks` - создать новую задачу
- `GET /api/tasks/[id]` - получить задачу по ID
- `PUT /api/tasks/[id]` - обновить задачу
- `DELETE /api/tasks/[id]` - удалить задачу

## Полезные команды

```bash
# Работа с Prisma
npx prisma generate          # Генерация клиента
npx prisma migrate dev       # Создание и применение миграций
npx prisma studio           # Просмотр БД в браузере
npx prisma db push          # Применение изменений схемы

# Разработка
npm run dev                 # Запуск в режиме разработки
npm run build              # Сборка проекта
npm run lint               # Проверка кода
npx tsc --noEmit           # Проверка типов
```
