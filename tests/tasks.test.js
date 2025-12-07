const TaskManager = require('../lib/tasks');

describe('TaskManager', () => {
    let manager;

    beforeEach(() => {
        manager = new TaskManager();
    });

    // 1. Тестування створення завдань (4 тести)
    describe('addTask', () => {
        test('додає нове завдання', () => {
            const task = manager.addTask('Купити хліб', 'high');
            expect(task.text).toBe('Купити хліб');
            expect(task.priority).toBe('high');
            expect(task.completed).toBe(false);
        });

        test('обрізує пробіли з тексту', () => {
            const task = manager.addTask('  Тест  ');
            expect(task.text).toBe('Тест');
        });

        test('присвоює послідовні ID', () => {
            const t1 = manager.addTask('перша');
            const t2 = manager.addTask('друга');
            expect(t1.id).toBe(1);
            expect(t2.id).toBe(2);
        });

        test('викидає помилку для порожнього тексту', () => {
            expect(() => manager.addTask('   ')).toThrow();
        });
    });

    // 2. Тестування зміни статусу (2 як тести)
    describe('toggleTask', () => {
        test('перемикає completed на true', () => {
            const task = manager.addTask('Тест');
            manager.toggleTask(task.id);
            expect(manager.tasks[0].completed).toBe(true);
        });

        test('перемикає completed назад на false', () => {
            const task = manager.addTask('Тест');
            manager.toggleTask(task.id);
            manager.toggleTask(task.id);
            expect(manager.tasks[0].completed).toBe(false);
        });
    });

    // 3. Тестування видалення (3 тести)
    describe('deleteTask', () => {
        test('видаляє завдання', () => {
            const task = manager.addTask('Видалити');
            manager.deleteTask(task.id);
            expect(manager.tasks.length).toBe(0);
        });

        test('повертає false для невірного ID', () => {
            const result = manager.deleteTask(999);
            expect(result).toBe(false);
        });

        test('видаляє одне завдання серед кількох', () => {
            const t1 = manager.addTask('1');
            const t2 = manager.addTask('2');
            const t3 = manager.addTask('3');
            manager.deleteTask(t2.id);
            expect(manager.tasks.length).toBe(2);
            expect(manager.tasks.find(t => t.id === t2.id)).toBeUndefined();
        });
    });

    // 4. Тестування фільтрації (3 тести)
    describe('getFilteredTasks', () => {
        test('повертає всі завдання для фільтру all', () => {
            manager.addTask('завдання 1');
            manager.addTask('завдання 2');
            const result = manager.getFilteredTasks('all');
            expect(result.length).toBe(2);
        });

        test('повертає тільки активні завдання', () => {
            const t1 = manager.addTask('активна');
            const t2 = manager.addTask('виконана');
            manager.toggleTask(t2.id);
            const result = manager.getFilteredTasks('active');
            expect(result.length).toBe(1);
            expect(result[0].id).toBe(t1.id);
        });

        test('повертає тільки виконані завдання', () => {
            const t1 = manager.addTask('активна');
            const t2 = manager.addTask('виконана');
            manager.toggleTask(t2.id);
            const result = manager.getFilteredTasks('completed');
            expect(result.length).toBe(1);
            expect(result[0].id).toBe(t2.id);
        });
    });

    // 5. Тестування масового видалення (2 тести)
    describe('clearCompleted', () => {
        test('видаляє всі виконані завдання', () => {
            const t1 = manager.addTask('активна');
            const t2 = manager.addTask('виконана1');
            const t3 = manager.addTask('виконана2');
            manager.toggleTask(t2.id);
            manager.toggleTask(t3.id);
            const removed = manager.clearCompleted();
            expect(removed).toBe(2);
            expect(manager.tasks.length).toBe(1);
        });

        test('повертає 0 якщо немає виконаних завдань', () => {
            manager.addTask('активна1');
            manager.addTask('активна2');
            const removed = manager.clearCompleted();
            expect(removed).toBe(0);
        });
    });

    // 6. Тестування експорту даних (2 тести)
    describe('exportText', () => {
        test('експортує завдання в текстовому форматі', () => {
            const task = manager.addTask('Купити хліб', 'high');
            const text = manager.exportText();
            expect(text).toContain('Купити хліб');
            expect(text).toContain('Пріоритет: Високий');
        });

        test('показує статистику', () => {
            manager.addTask('завдання 1');
            manager.addTask('завдання 2');
            const text = manager.exportText();
            expect(text).toContain('Всього завдань: 2');
            expect(text).toContain('Активних: 2');
        });
    });

    // 7. Тестування утиліт (2 тести)
    describe('getPriorityLabel', () => {
        test('перекладає пріоритети', () => {
            expect(TaskManager.getPriorityLabel('low')).toBe('Низький');
            expect(TaskManager.getPriorityLabel('medium')).toBe('Середній');
            expect(TaskManager.getPriorityLabel('high')).toBe('Високий');
        });
    });

    describe('formatDate', () => {
        test('форматує дату', () => {
            const formatted = TaskManager.formatDate('2024-12-07T10:30:00.000Z');
            expect(formatted).toMatch(/\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}/);
        });
    });
});
