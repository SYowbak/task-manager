# Лабораторна робота №5 — Статичний аналіз коду

Дата: 05.11.2025  
Проєкт: Task Manager (HTML/CSS/JS)

---

## 1. Мета роботи
- Застосувати інструменти статичного аналізу (ESLint, SonarQube).
- Налаштувати автоматизовані перевірки коду.
- Відрефакторити код на основі рекомендацій.

---

## 2. Опис проєкту
Невеликий веб-додаток для керування завданнями з пріоритетами, фільтрацією, пошуком та експортом у TXT.  
Структура: `index.html`, `styles.css`, `app.js`.

---

## 3. Виконання: ESLint

### 3.1 Встановлення
Команди, виконані в каталозі `e:/LAB/task-manager`:

```bash
npm init -y
npm install --save-dev eslint
```

Скріншот: встановлення ESLint (успішний вихід npm)

### 3.2 Налаштування ESLint (конфігурація v9)
Спочатку запуск показав, що потрібен новий формат конфігурації (eslint.config.js).  
Створено файл конфігурації: `e:/LAB/task-manager/eslint.config.js` зі змістом:

```js
module.exports = [
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2025,
            sourceType: 'script',
            globals: {
                window: 'readonly',
                document: 'readonly',
                localStorage: 'readonly',
                alert: 'readonly',
                Blob: 'readonly',
                URL: 'readonly'
            }
        },
        rules: {
            indent: ['error', 4],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'no-unused-vars': 'warn',
            'no-var': 'warn',
            'prefer-const': 'warn',
            eqeqeq: ['error', 'always'],
            complexity: ['warn', 10],
            'max-lines-per-function': ['warn', {max: 50}]
        }
    }
];
```

Скріншот: створений файл `eslint.config.js` у корені `e:/LAB/task-manager/`.

### 3.3 Перший аналіз (ДО виправлення)
Команда:
```bash
npm run lint
```
Результат: 12 попереджень (основні — `no-var`, `max-lines-per-function`).

Скріншот #1: вивід терміналу з 12 warnings.

### 3.4 Рефакторинг коду (ПІСЛЯ)
Внесені зміни у `app.js`.

- Заміна оголошень змінних (`var` → `let/const`):

```diff
- var tasks = [];
- var currentFilter = 'all';
- var taskIdCounter = 0;
+ let tasks = [];
+ let currentFilter = 'all';
+ let taskIdCounter = 0;

- var taskInput = document.getElementById('taskInput');
- var prioritySelect = document.getElementById('prioritySelect');
- var addTaskBtn = document.getElementById('addTaskBtn');
- var taskList = document.getElementById('taskList');
- var searchInput = document.getElementById('searchInput');
- var filterButtons = document.querySelectorAll('.btn-filter');
- var clearCompletedBtn = document.getElementById('clearCompleted');
- var exportBtn = document.getElementById('exportBtn');
+ const taskInput = document.getElementById('taskInput');
+ const prioritySelect = document.getElementById('prioritySelect');
+ const addTaskBtn = document.getElementById('addTaskBtn');
+ const taskList = document.getElementById('taskList');
+ const searchInput = document.getElementById('searchInput');
+ const filterButtons = document.querySelectorAll('.btn-filter');
+ const clearCompletedBtn = document.getElementById('clearCompleted');
+ const exportBtn = document.getElementById('exportBtn');
```

- Розбиття довгої функції відмалювання списку на дві:

```diff
- // Відображення завдань
- function renderTasks() {
-   ... (створення DOM елементів безпосередньо в циклі)
- }
+ // Створення елемента завдання
+ function createTaskElement(task) {
+   // створення checkbox, тексту, пріоритету, дати, кнопки видалення
+   // та складання li
+   return li;
+ }
+
+ // Відображення завдань
+ function renderTasks() {
+   // фільтрація, пошук, очищення списку
+   for (const task of filteredTasks) {
+     taskList.appendChild(createTaskElement(task));
+   }
+ }
```

### 3.5 Повторний аналіз
Команда:
```bash
npm run lint
```
Результат: 0 помилок, 0 попереджень.

Скріншот #2: чистий вивід ESLint (успіх).

---

## 4. Git hooks (pre-commit)
Налаштовано автоматичний запуск ESLint перед кожним комітом.

### 4.1 Реалізація
- Варіант на Windows: файл `.git/hooks/pre-commit.cmd` зі запуском `npm run lint`.
- Додатково створено `.husky/pre-commit` з тією ж командою (кросплатформено).

### 4.2 Перевірка роботи
- Імітовано синтаксичну помилку → коміт заблоковано ESLint.
- Виправлено помилку → коміт пройшов успішно, ESLint вивів «0 problems».

Скріншоти:
- Невдалий коміт (помилка ESLint у pre-commit).
- Успішний коміт після виправлень.

---

## 5. SonarQube (фактичні дії та результати)
### 5.1 Встановлення і підготовка
- Встановлено SonarQube Community Edition локально: `http://localhost:9000`.
- Встановлено SonarScanner CLI (Windows x64).
- У проєкті створено `sonar-project.properties` у `e:/LAB/task-manager`:
```properties
sonar.projectKey=task-manager
sonar.projectName=Task Manager
sonar.sources=.
sonar.inclusions=**/*.js,**/*.html,**/*.css
sonar.exclusions=node_modules/**
sonar.sourceEncoding=UTF-8
```

### 5.2 Запуск аналізу
У PowerShell налаштовано змінні середовища і виконано аналіз:
```powershell
$env:SONAR_HOST_URL="http://localhost:9000"
$env:SONAR_TOKEN="<USER_TOKEN>"
sonar-scanner
```

Початкові результати показали: 1 Bug і 7 Code Smells (Reliability C, Maintainability A).

### 5.3 Рефакторинг за рекомендаціями SonarQube
- `forEach` → `for...of` у циклах відмалювання і експорту.
- `getAttribute('data-filter')` → `dataset.filter`.
- Очищення DOM: замість `innerHTML = ''` використано `while (firstChild) firstChild.remove()`.
- Часові мітки: `Date.now()`.
- Парсинг числа: `Number.parseInt(value, 10)`.

Коміт змін:
```powershell
git add app.js
git commit -m "refactor: for...of, child.remove(), Date.now(), parseInt radix"
```
Повторний аналіз:
```powershell
sonar-scanner
```

### 5.4 Підсумок аналізу
- Quality Gate (New Code): **Passed**.
- New Issues на новому коді: **0**.
- Дублювання: 0.0%, Security Hotspots: 0.

Скріншоти:
- Overview з бейджем «Passed».
- Issues → вкладка New Code (0 елементів).

---

## 6. Висновки
- Налаштовано ESLint (flat config v9), первинний аналіз виконано.
- Виконано рефакторинг: `var→let/const`, декомпозиція довгих функцій, стилістичні правки; ESLint — 0 проблем.
- Налаштовано pre-commit hook: коміт блокується при помилках, проходить після виправлення.
- Проведено аналіз у SonarQube, виконано рекомендовані зміни; Quality Gate (New Code) — **Passed**, нових issues — 0.
- Після завершення роботи рекомендовано відкликати користувацький токен SonarQube.

---

## 7. Чекліст скріншотів
- [ ] S1: Структура проєкту у провіднику/IDE
- [ ] S2: Встановлення ESLint (npm install)
- [ ] S3: Перший `npm run lint` з warnings
- [ ] S4: ДО/ПІСЛЯ фрагменти коду (var→let/const, декомпозиція, forEach→for...of, dataset, remove())
- [ ] S5: Повторний `npm run lint` — 0 problems
- [ ] S6: Pre-commit hook — невдалий коміт з помилкою ESLint
- [ ] S7: Pre-commit hook — успішний коміт після виправлення
- [ ] S8: SonarQube Overview з «Quality Gate: Passed»
- [ ] S9: SonarQube Issues → New Code = 0

---

## 8. Додатки
- Посилання на проект/репозиторій: [вставити]
- Версія Node.js: `node -v`
- Версія ESLint: 9.39.1
