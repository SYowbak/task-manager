// Додаток для управління завданнями
let tasks = [];
let currentFilter = 'all';
let taskIdCounter = 0;

// DOM елементи
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.btn-filter');
const clearCompletedBtn = document.getElementById('clearCompleted');
const exportBtn = document.getElementById('exportBtn');

// Ініціалізація додатку
function init() {
    loadTasksFromStorage();
    renderTasks();
    updateStats();
    attachEventListeners();
}

// Обробники подій
function attachEventListeners() {
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    searchInput.addEventListener('input', handleSearch);

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterButtons.forEach((b) => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderTasks();
        });
    });

    clearCompletedBtn.addEventListener('click', clearCompleted);
    exportBtn.addEventListener('click', exportTasks);
}

// Додавання нового завдання
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Будь ласка, введіть текст завдання!');
        return;
    }

    const task = {
        id: ++taskIdCounter,
        text: taskText,
        completed: false,
        priority: prioritySelect.value,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    taskInput.value = '';

    saveTasksToStorage();
    renderTasks();
    updateStats();
}

// Перемикання статусу завдання
function toggleTask(id) {
    const task = tasks.find((t) => {
        return t.id === id;
    });

    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        renderTasks();
        updateStats();
    }
}

// Видалення завдання
function deleteTask(id) {
    tasks = tasks.filter((t) => {
        return t.id !== id;
    });

    saveTasksToStorage();
    renderTasks();
    updateStats();
}

// Створення елемента завдання
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    const prioritySpan = document.createElement('span');
    prioritySpan.className = 'task-priority priority-' + task.priority;
    prioritySpan.textContent = getPriorityLabel(task.priority);

    const dateSpan = document.createElement('span');
    dateSpan.className = 'task-date';
    dateSpan.textContent = formatDate(task.createdAt);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete';
    deleteBtn.textContent = 'Видалити';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(prioritySpan);
    li.appendChild(dateSpan);
    li.appendChild(deleteBtn);

    return li;
}

// Відображення завдань
function renderTasks() {
    let filteredTasks = getFilteredTasks();
    const searchTerm = searchInput.value.toLowerCase();

    if (searchTerm) {
        filteredTasks = filteredTasks.filter((task) => {
            return task.text.toLowerCase().includes(searchTerm);
        });
    }

    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">Немає завдань для відображення</div>';
        return;
    }

    filteredTasks.forEach((task) => {
        taskList.appendChild(createTaskElement(task));
    });
}

// Отримання відфільтрованих завдань
function getFilteredTasks() {
    if (currentFilter === 'active') {
        return tasks.filter((task) => {
            return !task.completed;
        });
    } else if (currentFilter === 'completed') {
        return tasks.filter((task) => {
            return task.completed;
        });
    }
    return tasks;
}

// Обробка пошуку
function handleSearch() {
    renderTasks();
}

// Оновлення статистики
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter((t) => {
        return t.completed;
    }).length;
    const active = total - completed;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('activeTasks').textContent = active;
    document.getElementById('completedTasks').textContent = completed;
}

// Очищення виконаних завдань
function clearCompleted() {
    tasks = tasks.filter((task) => {
        return !task.completed;
    });

    saveTasksToStorage();
    renderTasks();
    updateStats();
}

// Експорт завдань у TXT
function exportTasks() {
    let textContent = 'СПИСОК ЗАВДАНЬ\n';
    textContent += '='.repeat(50) + '\n\n';

    textContent += 'Загальна статистика:\n';
    textContent += '- Всього завдань: ' + tasks.length + '\n';
    textContent += '- Активних: ' + tasks.filter((t) => {
        return !t.completed;
    }).length + '\n';
    textContent += '- Виконаних: ' + tasks.filter((t) => {
        return t.completed;
    }).length + '\n\n';
    textContent += '='.repeat(50) + '\n\n';

    if (tasks.length === 0) {
        textContent += 'Немає завдань для експорту.\n';
    } else {
        tasks.forEach((task, index) => {
            textContent += (index + 1) + '. ';
            textContent += (task.completed ? '[✓] ' : '[ ] ');
            textContent += task.text + '\n';
            textContent += '   Пріоритет: ' + getPriorityLabel(task.priority) + '\n';
            textContent += '   Створено: ' + formatDate(task.createdAt) + '\n';
            textContent += '\n';
        });
    }

    textContent += '='.repeat(50) + '\n';
    textContent += 'Експортовано: ' + formatDate(new Date().toISOString()) + '\n';

    const dataBlob = new Blob([textContent], {type: 'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks-' + new Date().getTime() + '.txt';
    link.click();
}

// Функції для роботи з LocalStorage
function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('taskIdCounter', taskIdCounter.toString());
}

function loadTasksFromStorage() {
    const storedTasks = localStorage.getItem('tasks');
    const storedCounter = localStorage.getItem('taskIdCounter');

    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }

    if (storedCounter) {
        taskIdCounter = parseInt(storedCounter);
    }
}

// Допоміжні функції
function getPriorityLabel(priority) {
    const labels = {
        'low': 'Низький',
        'medium': 'Середній',
        'high': 'Високий'
    };
    return labels[priority] || priority;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
}

// Ініціалізація додатку після завантаження DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
