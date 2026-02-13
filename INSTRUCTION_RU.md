# Инструкция по использованию PNPM

## Установка PNPM

Если PNPM еще не установлен на вашей системе, выполните команду:

```bash
npm install -g pnpm
```

Или используйте другой менеджер пакетов:

```bash
# Используя Yarn
yarn global add pnpm

# Или используя Homebrew (macOS)
brew install pnpm

# Или используя Corepack (если поддерживается)
corepack enable pnpm
```

## Установка зависимостей в проектах

Переходите в каждый из проектов и устанавливайте зависимости с помощью PNPM:

### 1. Проект users-regs-main-fasty

```bash
cd users-regs-main-fasty
pnpm install
```

### 2. Проект vi-users-reg-1x-fy

```bash
cd ../vi-users-reg-1x-fy  # или укажите полный путь
pnpm install
```

## Запуск проектов

После установки зависимостей вы можете запускать проекты следующим образом:

### 1. Проект users-regs-main-fasty

```bash
# Для разработки
pnpm run dev

# Для сборки
pnpm run build

# Для запуска продакшн-версии
pnpm run start

# Другие доступные команды
pnpm run db:generate  # генерация миграций
pnpm run db:migrate   # применение миграций
pnpm run db:push      # применение изменений в БД
pnpm run db:studio    # запуск Drizzle Studio
```

### 2. Проект vi-users-reg-1x-fy

```bash
# Для разработки
pnpm run dev

# Для разработки с отслеживанием изменений
pnpm run dev:watch

# Для сборки
pnpm run build

# Для запуска продакшн-версии
pnpm run start
```

## Полезные команды PNPM

```bash
# Обновить все зависимости
pnpm update

# Обновить конкретную зависимость
pnpm update [package-name]

# Добавить новую зависимость
pnpm add [package-name]

# Добавить dev зависимость
pnpm add [package-name] --save-dev

# Удалить зависимость
pnpm remove [package-name]

# Очистить кэш
pnpm store prune
```

## Важная информация

- Все зависимости будут установлены в соответствии с `pnpm-lock.yaml`
- PNPM использует жесткие ссылки для экономии места на диске
- Убедитесь, что у вас есть права на запись в директории проектов
- Файлы `.bak` содержат резервные копии старых Yarn-конфигураций

## Восстановление Yarn (если понадобится)

Если вы захотите вернуться к использованию Yarn, восстановите файлы из резервных копий:

```bash
# В проекте users-regs-main-fasty
mv .yarnrc.yml.bak .yarnrc.yml
mv yarn.lock.bak yarn.lock

# В проекте vi-users-reg-1x-fy
mv yarn.lock.bak yarn.lock
```

Затем удалите файлы `pnpm-workspace.yaml` и снова используйте `yarn install`.