// Модуль для управління завданнями
class TaskManager {
    constructor(initialTasks = [], initialCounter = 0) {
        this.tasks = initialTasks.map(t => ({ ...t }));
        this.counter = initialCounter;
    }

    addTask(text, priority = 'low') {
        if (!text || text.toString().trim() === '') {
            throw new Error('Empty task text');
        }

        const task = {
            id: ++this.counter,
            text: text.toString().trim(),
            completed: false,
            priority,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        return task;
    }

    toggleTask(id) {
        const t = this.tasks.find(x => x.id === id);
        if (!t) return false;
        t.completed = !t.completed;
        return true;
    }

    deleteTask(id) {
        const before = this.tasks.length;
        this.tasks = this.tasks.filter(x => x.id !== id);
        return this.tasks.length !== before;
    }

    getFilteredTasks(filter = 'all') {
        if (filter === 'active') return this.tasks.filter(t => !t.completed);
        if (filter === 'completed') return this.tasks.filter(t => t.completed);
        return this.tasks;
    }

    clearCompleted() {
        const before = this.tasks.length;
        this.tasks = this.tasks.filter(t => !t.completed);
        return before - this.tasks.length;
    }

    exportText() {
        let textContent = 'СПИСОК ЗАВДАНЬ\n';
        textContent += '='.repeat(50) + '\n\n';

        textContent += 'Загальна статистика:\n';
        textContent += '- Всього завдань: ' + this.tasks.length + '\n';
        textContent += '- Активних: ' + this.tasks.filter(t => !t.completed).length + '\n';
        textContent += '- Виконаних: ' + this.tasks.filter(t => t.completed).length + '\n\n';
        textContent += '='.repeat(50) + '\n\n';

        if (this.tasks.length === 0) {
            textContent += 'Немає завдань для експорту.\n';
        } else {
            for (const [index, task] of this.tasks.entries()) {
                textContent += (index + 1) + '. ';
                textContent += (task.completed ? '[✓] ' : '[ ] ');
                textContent += task.text + '\n';
                textContent += '   Пріоритет: ' + TaskManager.getPriorityLabel(task.priority) + '\n';
                textContent += '   Створено: ' + TaskManager.formatDate(task.createdAt) + '\n';
                textContent += '\n';
            }
        }

        textContent += '='.repeat(50) + '\n';
        textContent += 'Експортовано: ' + TaskManager.formatDate(new Date().toISOString()) + '\n';
        return textContent;
    }

    static getPriorityLabel(priority) {
        const labels = {
            'low': 'Низький',
            'medium': 'Середній',
            'high': 'Високий'
        };
        return labels[priority] || priority;
    }

    static formatDate(dateString) {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return dateString;
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }
}

module.exports = TaskManager;
