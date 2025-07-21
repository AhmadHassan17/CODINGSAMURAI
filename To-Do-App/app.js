// 🌈 Professional Joyful To-Do List - Tier 2 Complete Implementation!
console.log('🚀 Professional To-Do List with Tier 2 Features loaded successfully!');

let tasks = [];
let taskIdCounter = 0;
let currentFilter = 'all';
let currentSort = 'created';
let searchQuery = '';
let currentView = 'list'; // 'list' or 'board'
let isDarkMode = true;
let selectedTasks = new Set();

// PWA variables
let deferredPrompt;
let isInstalled = false;

// Drag and drop variables
let draggedTask = null;
let draggedElement = null;

// Task templates
const taskTemplates = {
    'daily-routine': [
        { text: 'Morning meditation', category: 'personal', priority: 'medium', timeEstimate: 15 },
        { text: 'Check emails', category: 'work', priority: 'high', timeEstimate: 30 },
        { text: 'Review daily goals', category: 'personal', priority: 'high', timeEstimate: 10 },
        { text: 'Exercise or walk', category: 'health', priority: 'medium', timeEstimate: 45 }
    ],
    'project-launch': [
        { text: 'Final code review', category: 'work', priority: 'high', timeEstimate: 120 },
        { text: 'Update documentation', category: 'work', priority: 'medium', timeEstimate: 60 },
        { text: 'Test deployment process', category: 'work', priority: 'high', timeEstimate: 90 },
        { text: 'Prepare launch announcement', category: 'work', priority: 'medium', timeEstimate: 45 },
        { text: 'Monitor system performance', category: 'work', priority: 'high', timeEstimate: 30 }
    ],
    'weekly-review': [
        { text: 'Review completed tasks', category: 'personal', priority: 'medium', timeEstimate: 20 },
        { text: 'Plan next week priorities', category: 'personal', priority: 'high', timeEstimate: 30 },
        { text: 'Update project status', category: 'work', priority: 'medium', timeEstimate: 25 },
        { text: 'Clean workspace', category: 'home', priority: 'low', timeEstimate: 15 }
    ]
};

// Get DOM elements
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const prioritySelect = document.getElementById('prioritySelect');
const dueDateInput = document.getElementById('dueDateInput');
const timeEstimate = document.getElementById('timeEstimate');
const recurringSelect = document.getElementById('recurringSelect');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const sortSelect = document.getElementById('sortSelect');
const tasksList = document.getElementById('tasksList');
const boardView = document.getElementById('boardView');
const emptyState = document.getElementById('emptyState');
const categoryLegend = document.getElementById('categoryLegend');

// Advanced input elements
const advancedInput = document.getElementById('advancedInput');
const taskNotes = document.getElementById('taskNotes');
const customTags = document.getElementById('customTags');
const fileInput = document.getElementById('fileInput');
const attachmentsList = document.getElementById('attachmentsList');

// Control elements
const themeToggle = document.getElementById('themeToggle');
const viewToggle = document.getElementById('viewToggle');
const toggleAdvanced = document.getElementById('toggleAdvanced');
const clearSearch = document.getElementById('clearSearch');

// Quick stats elements
const totalTasksEl = document.getElementById('totalTasks');
const todayTasksEl = document.getElementById('todayTasks');
const overdueTasksEl = document.getElementById('overdueTasks');
const completedTasksEl = document.getElementById('completedTasks');
const totalTimeEl = document.getElementById('totalTime');

// View indicator
const currentViewEl = document.getElementById('currentView');

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM loaded, initializing Tier 2 features...');
    
    // Load data from localStorage
    loadDataFromStorage();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup PWA
    setupPWA();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Setup drag and drop
    setupDragAndDrop();
    
    // Setup notifications
    setupNotifications();
    
    // Apply theme
    applyTheme();
    
    // Focus on input
    taskInput.focus();
    
    // Render initial tasks
    renderTasks();
    
    // Setup recurring task checker
    setupRecurringTasks();
    
    console.log('🎯 All Tier 2 features initialized successfully!');
});

// ===== EVENT LISTENERS SETUP =====

function setupEventListeners() {
    // Task input events
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
    
    // Search events
    searchInput.addEventListener('input', function(e) {
        searchQuery = e.target.value.toLowerCase();
        if (searchQuery) {
            clearSearch.style.display = 'block';
        } else {
            clearSearch.style.display = 'none';
        }
        renderTasks();
    });
    
    clearSearch.addEventListener('click', function() {
        searchInput.value = '';
        searchQuery = '';
        clearSearch.style.display = 'none';
        renderTasks();
    });
    
    // Filter and sort events
    filterSelect.addEventListener('change', function(e) {
        currentFilter = e.target.value;
        renderTasks();
    });
    
    sortSelect.addEventListener('change', function(e) {
        currentSort = e.target.value;
        renderTasks();
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // View toggle
    viewToggle.addEventListener('click', toggleView);
    
    // Advanced input toggle
    toggleAdvanced.addEventListener('click', function() {
        const isVisible = advancedInput.style.display !== 'none';
        advancedInput.style.display = isVisible ? 'none' : 'block';
        toggleAdvanced.textContent = isVisible ? '➕ Advanced Options' : '➖ Hide Advanced';
    });
    
    // File input
    fileInput.addEventListener('change', handleFileSelection);
    
    // Template selection
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('template-item')) {
            const template = e.target.dataset.template;
            if (template && template !== 'custom') {
                applyTemplate(template);
                closeModal('templatesModal');
            }
        }
    });
}

// ===== KEYBOARD SHORTCUTS =====

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ignore if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            // Allow some shortcuts even in inputs
            if (e.key === 'Escape') {
                e.target.blur();
                closeAllModals();
                return;
            }
            return;
        }
        
        // Global shortcuts
        switch(e.key) {
            case '?':
                e.preventDefault();
                showModal('shortcutsModal');
                break;
            case 'Escape':
                e.preventDefault();
                closeAllModals();
                clearSelection();
                break;
            case 'v':
            case 'V':
                e.preventDefault();
                toggleView();
                break;
            case 't':
            case 'T':
                e.preventDefault();
                toggleTheme();
                break;
            case 'Delete':
                e.preventDefault();
                deleteSelectedTasks();
                break;
        }
        
        // Ctrl/Cmd shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'n':
                case 'N':
                    e.preventDefault();
                    taskInput.focus();
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    searchInput.focus();
                    break;
                case 'e':
                case 'E':
                    e.preventDefault();
                    exportTasks();
                    break;
                case 'i':
                case 'I':
                    e.preventDefault();
                    document.getElementById('importFile').click();
                    break;
                case 'a':
                case 'A':
                    e.preventDefault();
                    selectAllTasks();
                    break;
            }
        }
    });
}

// ===== PWA SETUP =====

function setupPWA() {
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('🔧 Service Worker registered'))
            .catch(err => console.log('❌ Service Worker registration failed'));
    }
    
    // Install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });
    
    // Install button
    document.getElementById('installBtn')?.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                hideInstallPrompt();
                showNotification('App installed successfully! 🎉', 'success');
            }
            deferredPrompt = null;
        }
    });
    
    // Dismiss install
    document.getElementById('dismissInstall')?.addEventListener('click', hideInstallPrompt);
    
    // Check if already installed
    window.addEventListener('appinstalled', () => {
        isInstalled = true;
        hideInstallPrompt();
        showNotification('Welcome to the installed app! 🚀', 'success');
    });
}

function showInstallPrompt() {
    const prompt = document.getElementById('installPrompt');
    if (prompt && !isInstalled) {
        prompt.style.display = 'block';
    }
}

function hideInstallPrompt() {
    const prompt = document.getElementById('installPrompt');
    if (prompt) {
        prompt.style.display = 'none';
    }
}

// ===== DRAG AND DROP =====

function setupDragAndDrop() {
    // We'll set up drag handlers when rendering tasks
}

function makeDraggable(element, task) {
    element.draggable = true;
    element.addEventListener('dragstart', (e) => {
        draggedTask = task;
        draggedElement = element;
        element.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });
    
    element.addEventListener('dragend', () => {
        element.classList.remove('dragging');
        draggedTask = null;
        draggedElement = null;
    });
    
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });
    
    element.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedTask && draggedTask.id !== task.id) {
            reorderTasks(draggedTask.id, task.id);
        }
    });
}

function reorderTasks(draggedId, targetId) {
    const draggedIndex = tasks.findIndex(t => t.id === draggedId);
    const targetIndex = tasks.findIndex(t => t.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
        const [draggedTask] = tasks.splice(draggedIndex, 1);
        tasks.splice(targetIndex, 0, draggedTask);
        saveDataToStorage();
        renderTasks();
        showNotification('Task reordered! 📝', 'success');
    }
}

// ===== NOTIFICATIONS =====

function setupNotifications() {
    // Request notification permission
    if ('Notification' in window) {
        Notification.requestPermission();
    }
    
    // Check for due tasks every minute
    setInterval(checkDueTasks, 60000);
}

function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div>${message}</div>
        <button class="notification-close">×</button>
    `;
    
    container.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        if (container.contains(notification)) {
            container.removeChild(notification);
        }
    }, duration);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        if (container.contains(notification)) {
            container.removeChild(notification);
        }
    });
}

function checkDueTasks() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentHour = now.getHours();
    
    // Check for overdue tasks
    const overdue = tasks.filter(task => 
        task.dueDate && task.dueDate < today && !task.completed
    );
    
    if (overdue.length > 0 && currentHour >= 9 && currentHour <= 18) {
        showBrowserNotification(
            `You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}!`,
            'Don\'t forget to complete them.'
        );
    }
    
    // Check for today's tasks
    const todayTasks = tasks.filter(task => 
        task.dueDate === today && !task.completed
    );
    
    if (todayTasks.length > 0 && currentHour === 9) {
        showBrowserNotification(
            `Good morning! You have ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} due today.`,
            'Let\'s make today productive!'
        );
    }
}

function showBrowserNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png'
        });
    }
}

// ===== THEME MANAGEMENT =====

function toggleTheme() {
    isDarkMode = !isDarkMode;
    applyTheme();
    saveDataToStorage();
    showNotification(`Switched to ${isDarkMode ? 'dark' : 'light'} mode! 🌙`, 'success');
}

function applyTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeToggle');
    
    if (isDarkMode) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeIcon.textContent = '🌙';
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeIcon.textContent = '☀️';
    }
}

// ===== VIEW MANAGEMENT =====

function toggleView() {
    currentView = currentView === 'list' ? 'board' : 'list';
    updateViewIndicator();
    renderTasks();
    saveDataToStorage();
    showNotification(`Switched to ${currentView} view! 📋`, 'success');
}

function updateViewIndicator() {
    const viewIcon = document.getElementById('viewToggle');
    const viewText = currentViewEl;
    
    if (currentView === 'list') {
        viewIcon.textContent = '📋';
        viewText.textContent = '📋 List View';
    } else {
        viewIcon.textContent = '📊';
        viewText.textContent = '📊 Board View';
    }
}

// ===== TASK TEMPLATES =====

function applyTemplate(templateName) {
    const template = taskTemplates[templateName];
    if (!template) return;
    
    template.forEach(taskData => {
        const task = {
            id: ++taskIdCounter,
            text: taskData.text,
            category: taskData.category,
            priority: taskData.priority,
            timeEstimate: taskData.timeEstimate,
            dueDate: null,
            completed: false,
            createdAt: new Date().toISOString(),
            tags: [],
            notes: '',
            attachments: [],
            subtasks: [],
            recurring: null
        };
        tasks.push(task);
    });
    
    saveDataToStorage();
    renderTasks();
    showNotification(`Applied ${templateName.replace('-', ' ')} template! 📋`, 'success');
    showCelebration();
}

// ===== RECURRING TASKS =====

function setupRecurringTasks() {
    // Check for recurring tasks daily at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
        createRecurringTasks();
        // Then check every 24 hours
        setInterval(createRecurringTasks, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
}

function createRecurringTasks() {
    const today = new Date().toISOString().split('T')[0];
    
    tasks.filter(task => task.recurring && task.completed).forEach(task => {
        if (shouldCreateRecurringTask(task, today)) {
            const newTask = {
                ...task,
                id: ++taskIdCounter,
                completed: false,
                createdAt: new Date().toISOString(),
                dueDate: calculateNextDueDate(task.dueDate, task.recurring),
                completedAt: null
            };
            tasks.push(newTask);
        }
    });
    
    saveDataToStorage();
    renderTasks();
}

function shouldCreateRecurringTask(task, today) {
    if (!task.dueDate || !task.recurring) return false;
    
    const lastDue = new Date(task.dueDate);
    const todayDate = new Date(today);
    
    switch (task.recurring) {
        case 'daily':
            return todayDate > lastDue;
        case 'weekly':
            return todayDate.getTime() - lastDue.getTime() >= 7 * 24 * 60 * 60 * 1000;
        case 'monthly':
            return todayDate.getMonth() !== lastDue.getMonth() || todayDate.getFullYear() !== lastDue.getFullYear();
        case 'yearly':
            return todayDate.getFullYear() > lastDue.getFullYear();
        default:
            return false;
    }
}

function calculateNextDueDate(currentDue, recurring) {
    if (!currentDue) return null;
    
    const date = new Date(currentDue);
    
    switch (recurring) {
        case 'daily':
            date.setDate(date.getDate() + 1);
            break;
        case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'yearly':
            date.setFullYear(date.getFullYear() + 1);
            break;
    }
    
    return date.toISOString().split('T')[0];
}

// ===== ENHANCED TASK MANAGEMENT =====

function addTask() {
    const text = taskInput.value.trim();
    const category = categorySelect.value;
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;
    const timeEst = timeEstimate.value;
    const recurring = recurringSelect.value;
    const notes = taskNotes.value.trim();
    const customTagsValue = customTags.value.trim();
    
    if (text === '') {
        taskInput.style.animation = 'shake 0.5s';
        setTimeout(() => taskInput.style.animation = '', 500);
        return;
    }
    
    if (!category) {
        categorySelect.style.animation = 'shake 0.5s';
        setTimeout(() => categorySelect.style.animation = '', 500);
        return;
    }
    
    if (!priority) {
        prioritySelect.style.animation = 'shake 0.5s';
        setTimeout(() => prioritySelect.style.animation = '', 500);
        return;
    }
    
    // Parse custom tags
    const customTagsList = customTagsValue ? customTagsValue.split(' ').filter(tag => tag.startsWith('#')).map(tag => tag.substring(1)) : [];
    
    const task = {
        id: ++taskIdCounter,
        text: text,
        category: category,
        priority: priority,
        dueDate: dueDate || null,
        timeEstimate: timeEst ? parseInt(timeEst) : null,
        recurring: recurring || null,
        completed: false,
        createdAt: new Date().toISOString(),
        tags: [...extractTags(text), ...customTagsList],
        notes: notes,
        attachments: [...getCurrentAttachments()],
        subtasks: [],
        status: 'pending' // pending, in-progress, completed
    };
    
    tasks.push(task);
    
    // Clear all inputs
    clearInputs();
    
    // Save and render
    saveDataToStorage();
    renderTasks();
    
    console.log('➕ Enhanced task added:', task.text);
    showNotification('Task added successfully! ✨', 'success');
    
    // Show celebration for first task
    if (tasks.length === 1) {
        setTimeout(() => showCelebration(), 300);
    }
}

function clearInputs() {
    taskInput.value = '';
    categorySelect.selectedIndex = 0;
    prioritySelect.selectedIndex = 0;
    dueDateInput.value = '';
    timeEstimate.value = '';
    recurringSelect.selectedIndex = 0;
    taskNotes.value = '';
    customTags.value = '';
    attachmentsList.innerHTML = '';
    advancedInput.style.display = 'none';
    toggleAdvanced.textContent = '➕ Advanced Options';
}

function getCurrentAttachments() {
    const attachments = [];
    const attachmentItems = attachmentsList.querySelectorAll('.attachment-item');
    attachmentItems.forEach(item => {
        attachments.push({
            name: item.dataset.name,
            type: item.dataset.type,
            size: item.dataset.size
        });
    });
    return attachments;
}

function handleFileSelection(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showNotification(`File ${file.name} is too large (max 5MB)`, 'error');
            return;
        }
        
        const attachmentEl = document.createElement('div');
        attachmentEl.className = 'attachment-item';
        attachmentEl.dataset.name = file.name;
        attachmentEl.dataset.type = file.type;
        attachmentEl.dataset.size = file.size;
        attachmentEl.innerHTML = `
            <span>📎 ${file.name}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        attachmentsList.appendChild(attachmentEl);
    });
}

// ===== SUBTASKS =====

function addSubtask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const subtaskText = prompt('Enter subtask:');
    if (subtaskText && subtaskText.trim()) {
        task.subtasks.push({
            id: Date.now(),
            text: subtaskText.trim(),
            completed: false
        });
        saveDataToStorage();
        renderTasks();
        showNotification('Subtask added! 📝', 'success');
    }
}

function toggleSubtask(taskId, subtaskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const subtask = task.subtasks.find(s => s.id === subtaskId);
        if (subtask) {
            subtask.completed = !subtask.completed;
            saveDataToStorage();
            renderTasks();
        }
    }
}

// ===== SELECTION MANAGEMENT =====

function selectAllTasks() {
    const visibleTasks = getFilteredTasks();
    selectedTasks.clear();
    visibleTasks.forEach(task => selectedTasks.add(task.id));
    renderTasks();
    showNotification(`Selected ${selectedTasks.size} tasks`, 'info');
}

function clearSelection() {
    selectedTasks.clear();
    renderTasks();
}

function toggleTaskSelection(taskId) {
    if (selectedTasks.has(taskId)) {
        selectedTasks.delete(taskId);
    } else {
        selectedTasks.add(taskId);
    }
    renderTasks();
}

function deleteSelectedTasks() {
    if (selectedTasks.size === 0) return;
    
    if (confirm(`Delete ${selectedTasks.size} selected task${selectedTasks.size > 1 ? 's' : ''}?`)) {
        tasks = tasks.filter(task => !selectedTasks.has(task.id));
        selectedTasks.clear();
        saveDataToStorage();
        renderTasks();
        showNotification('Selected tasks deleted!', 'success');
    }
}

// ===== MODAL MANAGEMENT =====

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        // Focus trap
        const focusableElements = modal.querySelectorAll('button, input, select, textarea');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
}

// ===== TEXT FORMATTING =====

function formatText(format) {
    const textarea = taskNotes;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    switch (format) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
        case 'link':
            const url = prompt('Enter URL:');
            if (url) formattedText = `[${selectedText || 'Link'}](${url})`;
            break;
        case 'list':
            formattedText = `\n- ${selectedText}`;
            break;
    }
    
    if (formattedText) {
        textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
        textarea.focus();
    }
}

// ===== FILTER HELPERS =====

function filterByStatus(status) {
    filterSelect.value = status;
    currentFilter = status;
    renderTasks();
}

function filterByCategory(category) {
    searchInput.value = category;
    searchQuery = category.toLowerCase();
    clearSearch.style.display = 'block';
    renderTasks();
}

// ===== DATA PERSISTENCE =====

function saveDataToStorage() {
    try {
        const data = {
            tasks: tasks,
            taskIdCounter: taskIdCounter,
            currentView: currentView,
            isDarkMode: isDarkMode,
            settings: {
                notifications: true,
                autoSave: true
            }
        };
        localStorage.setItem('professionalTodoData', JSON.stringify(data));
        console.log('💾 Data saved to localStorage');
    } catch (error) {
        console.error('❌ Error saving data:', error);
        showNotification('Error saving data!', 'error');
    }
}

function loadDataFromStorage() {
    try {
        const savedData = localStorage.getItem('professionalTodoData');
        
        if (savedData) {
            const data = JSON.parse(savedData);
            tasks = data.tasks || [];
            taskIdCounter = data.taskIdCounter || 0;
            currentView = data.currentView || 'list';
            isDarkMode = data.isDarkMode !== undefined ? data.isDarkMode : true;
            
            console.log(`📂 Loaded ${tasks.length} tasks from storage`);
        }
    } catch (error) {
        console.error('❌ Error loading data:', error);
        tasks = [];
        taskIdCounter = 0;
    }
}

// Continue with existing functions (extractTags, deleteTask, toggleComplete, etc.)
// But enhance them with new features...

function extractTags(text) {
    const tagRegex = /#(\w+)/g;
    const tags = [];
    let match;
    
    while ((match = tagRegex.exec(text)) !== null) {
        tags.push(match[1].toLowerCase());
    }
    
    return tags;
}

function deleteTask(id) {
    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    if (taskElement) {
        taskElement.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            tasks = tasks.filter(task => task.id !== id);
            saveDataToStorage();
            renderTasks();
            showNotification('Task deleted!', 'success');
        }, 300);
    }
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
        console.log('🎊 Task completed:', task.text);
        showCelebration();
        showNotification('Great job! Task completed! 🎉', 'success');
    }
    
    tasks = tasks.map(t => 
        t.id === id ? { 
            ...t, 
            completed: !t.completed, 
            completedAt: !t.completed ? new Date().toISOString() : null,
            status: !t.completed ? 'completed' : 'pending'
        } : t
    );
    
    saveDataToStorage();
    renderTasks();
}

// ===== ENHANCED RENDERING =====

function renderTasks() {
    updateViewIndicator();
    
    if (currentView === 'list') {
        renderListView();
    } else {
        renderBoardView();
    }
    
    updateQuickStats();
}

function renderListView() {
    const filteredTasks = getFilteredTasks();
    
    tasksList.innerHTML = '';
    boardView.style.display = 'none';
    
    if (filteredTasks.length === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        
        // Build CSS classes
        let classes = ['task-item'];
        classes.push(`priority-${task.priority}`);
        classes.push(`category-${task.category}`);
        
        if (task.completed) classes.push('completed');
        if (task.dueDate && isOverdue(task.dueDate) && !task.completed) classes.push('overdue');
        if (task.dueDate && isToday(task.dueDate) && !task.completed) classes.push('due-today');
        if (selectedTasks.has(task.id)) classes.push('selected');
        
        li.className = classes.join(' ');
        li.setAttribute('data-task-id', task.id);
        
        // Make draggable
        makeDraggable(li, task);
        
        // Build task content
        li.innerHTML = buildTaskHTML(task);
        
        // Add click handler for selection
        li.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                toggleTaskSelection(task.id);
            }
        });
        
        tasksList.appendChild(li);
    });
    
    tasksList.style.display = 'block';
    categoryLegend.style.display = 'block';
}

function renderBoardView() {
    tasksList.style.display = 'none';
    boardView.style.display = 'grid';
    categoryLegend.style.display = 'none';
    
    const filteredTasks = getFilteredTasks();
    
    // Clear board columns
    const pendingColumn = document.getElementById('pendingTasks');
    const progressColumn = document.getElementById('progressTasks');
    const completedColumn = document.getElementById('completedTasksBoard');
    
    pendingColumn.innerHTML = '';
    progressColumn.innerHTML = '';
    completedColumn.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    
    // Distribute tasks by status
    filteredTasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'board-task-item';
        taskCard.setAttribute('data-task-id', task.id);
        taskCard.innerHTML = buildBoardTaskHTML(task);
        
        // Make draggable for board
        makeBoardDraggable(taskCard, task);
        
        if (task.completed) {
            completedColumn.appendChild(taskCard);
        } else if (task.status === 'in-progress') {
            progressColumn.appendChild(taskCard);
        } else {
            pendingColumn.appendChild(taskCard);
        }
    });
    
    // Setup drop zones
    setupBoardDropZones();
}

function buildTaskHTML(task) {
    // Build due date display
    let dueDateDisplay = '';
    if (task.dueDate) {
        const formatted = formatDate(task.dueDate);
        if (isOverdue(task.dueDate) && !task.completed) {
            dueDateDisplay = `<span class="due-date overdue">⚠️ ${formatted}</span>`;
        } else if (isToday(task.dueDate)) {
            dueDateDisplay = `<span class="due-date today">📅 Today</span>`;
        } else {
            dueDateDisplay = `<span class="due-date">📅 ${formatted}</span>`;
        }
    }
    
    // Build tags display
    let tagsDisplay = '';
    if (task.tags && task.tags.length > 0) {
        tagsDisplay = task.tags.map(tag => `<span class="tag">#${tag}</span>`).join(' ');
    }
    
    // Build time estimate display
    let timeDisplay = '';
    if (task.timeEstimate) {
        timeDisplay = `<span class="time-badge">⏱️ ${task.timeEstimate}m</span>`;
    }
    
    // Build recurring display
    let recurringDisplay = '';
    if (task.recurring) {
        recurringDisplay = `<span class="recurring-badge">🔁 ${task.recurring}</span>`;
    }
    
    // Build notes preview
    let notesDisplay = '';
    if (task.notes) {
        const preview = task.notes.length > 50 ? task.notes.substring(0, 50) + '...' : task.notes;
        notesDisplay = `<div class="task-notes-preview">${preview}</div>`;
    }
    
    // Build attachments display
    let attachmentsDisplay = '';
    if (task.attachments && task.attachments.length > 0) {
        attachmentsDisplay = `
            <div class="task-attachments">
                ${task.attachments.map(att => `<span class="attachment-preview">📎 ${att.name}</span>`).join('')}
            </div>
        `;
    }
    
    // Build subtasks display
    let subtasksDisplay = '';
    if (task.subtasks && task.subtasks.length > 0) {
        subtasksDisplay = `
            <div class="subtasks-list">
                ${task.subtasks.map(subtask => `
                    <div class="subtask-item">
                        <div class="subtask-checkbox ${subtask.completed ? 'checked' : ''}" 
                             onclick="toggleSubtask(${task.id}, ${subtask.id})"></div>
                        <span>${subtask.text}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    return `
        <div class="task-content">
            <div class="task-header">
                <span class="task-text" onclick="toggleComplete(${task.id})" title="Click to mark as complete">
                    ${task.completed ? '✅' : '⭐'} ${task.text}
                </span>
            </div>
            <div class="task-meta">
                <span class="priority-badge priority-${task.priority}">${getPriorityIcon(task.priority)} ${task.priority}</span>
                <span class="category-badge category-${task.category}">${getCategoryIcon(task.category)} ${task.category}</span>
                ${dueDateDisplay}
                ${timeDisplay}
                ${recurringDisplay}
            </div>
            ${notesDisplay}
            ${attachmentsDisplay}
            ${subtasksDisplay}
            <div class="task-tags">${tagsDisplay}</div>
        </div>
        <div class="task-buttons">
            <button onclick="addSubtask(${task.id})" class="subtask-btn" title="Add subtask">📝</button>
            <button onclick="startEdit(${task.id})" class="edit-btn" title="Edit task">✏️</button>
            <button onclick="deleteTask(${task.id})" class="delete-btn" title="Delete task">🗑️</button>
        </div>
    `;
}

function buildBoardTaskHTML(task) {
    return `
        <div class="board-task-content">
            <div class="task-text" onclick="toggleComplete(${task.id})">
                ${task.completed ? '✅' : '⭐'} ${task.text}
            </div>
            <div class="task-meta">
                <span class="priority-badge priority-${task.priority}">${getPriorityIcon(task.priority)}</span>
                <span class="category-badge category-${task.category}">${getCategoryIcon(task.category)}</span>
                ${task.timeEstimate ? `<span class="time-badge">⏱️${task.timeEstimate}m</span>` : ''}
            </div>
        </div>
    `;
}

// Continue with all the rest of the existing functions but enhanced...
// I'll include the essential remaining functions to complete the implementation

function getFilteredTasks() {
    let filtered = [...tasks];
    
    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(task => 
            task.text.toLowerCase().includes(searchQuery) ||
            task.category.toLowerCase().includes(searchQuery) ||
            (task.tags && task.tags.some(tag => tag.includes(searchQuery))) ||
            (task.notes && task.notes.toLowerCase().includes(searchQuery))
        );
    }
    
    // Apply status filter
    const today = new Date().toISOString().split('T')[0];
    
    switch (currentFilter) {
        case 'today':
            filtered = filtered.filter(task => task.dueDate === today);
            break;
        case 'overdue':
            filtered = filtered.filter(task => 
                task.dueDate && task.dueDate < today && !task.completed
            );
            break;
        case 'pending':
            filtered = filtered.filter(task => !task.completed);
            break;
        case 'completed':
            filtered = filtered.filter(task => task.completed);
            break;
        case 'recurring':
            filtered = filtered.filter(task => task.recurring);
            break;
        default: // 'all'
            break;
    }
    
    // Apply sorting
    switch (currentSort) {
        case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
            break;
        case 'dueDate':
            filtered.sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
            break;
        case 'alphabetical':
            filtered.sort((a, b) => a.text.localeCompare(b.text));
            break;
        case 'timeEstimate':
            filtered.sort((a, b) => (b.timeEstimate || 0) - (a.timeEstimate || 0));
            break;
        default: // 'created'
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }
    
    return filtered;
}

function updateQuickStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const total = tasks.length;
    const todayTasks = tasks.filter(task => task.dueDate === today).length;
    const overdue = tasks.filter(task => 
        task.dueDate && task.dueDate < today && !task.completed
    ).length;
    const completed = tasks.filter(task => task.completed).length;
    const totalTime = tasks.reduce((sum, task) => sum + (task.timeEstimate || 0), 0);
    
    totalTasksEl.textContent = total;
    todayTasksEl.textContent = todayTasks;
    overdueTasksEl.textContent = overdue;
    completedTasksEl.textContent = completed;
    totalTimeEl.textContent = Math.round(totalTime / 60 * 10) / 10; // Convert to hours
    
    // Add pulse animation to overdue if there are overdue tasks
    if (overdue > 0) {
        overdueTasksEl.style.animation = 'pulse 2s infinite';
        overdueTasksEl.style.color = '#ef4444';
    } else {
        overdueTasksEl.style.animation = '';
        overdueTasksEl.style.color = 'var(--accent-primary)';
    }
}

function showEmptyState() {
    emptyState.style.display = 'block';
    tasksList.style.display = 'none';
    boardView.style.display = 'none';
    categoryLegend.style.display = 'none';
}

function hideEmptyState() {
    emptyState.style.display = 'none';
}

// Helper functions (existing ones enhanced)
function isOverdue(dueDate) {
    if (!dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
}

function isToday(dueDate) {
    if (!dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate === today;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
}

function getPriorityIcon(priority) {
    switch (priority) {
        case 'high': return '🔴';
        case 'medium': return '🟡';
        case 'low': return '🟢';
        default: return '⚪';
    }
}

function getCategoryIcon(category) {
    switch (category) {
        case 'work': return '💼';
        case 'personal': return '📋';
        case 'shopping': return '🛒';
        case 'health': return '🏥';
        case 'home': return '🏠';
        case 'other': return '📌';
        default: return '📌';
    }
}

// Export/Import with enhanced data
function exportTasks() {
    try {
        const exportData = {
            tasks: tasks,
            exportDate: new Date().toISOString(),
            version: '2.0',
            settings: {
                currentView,
                isDarkMode
            }
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `professional-todo-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        console.log('📤 Enhanced tasks exported successfully');
        showNotification('Tasks exported successfully! 📤', 'success');
        
    } catch (error) {
        console.error('❌ Error exporting tasks:', error);
        showNotification('Error exporting tasks!', 'error');
    }
}

function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            
            if (importData.tasks && Array.isArray(importData.tasks)) {
                const importedTasks = importData.tasks;
                const existingIds = new Set(tasks.map(t => t.id));
                
                let newTasksCount = 0;
                importedTasks.forEach(task => {
                    if (!existingIds.has(task.id)) {
                        // Ensure task has all new properties
                        const enhancedTask = {
                            ...task,
                            notes: task.notes || '',
                            attachments: task.attachments || [],
                            subtasks: task.subtasks || [],
                            tags: task.tags || [],
                            timeEstimate: task.timeEstimate || null,
                            recurring: task.recurring || null,
                            status: task.status || 'pending'
                        };
                        tasks.push(enhancedTask);
                        newTasksCount++;
                        
                        if (task.id >= taskIdCounter) {
                            taskIdCounter = task.id + 1;
                        }
                    }
                });
                
                // Import settings if available
                if (importData.settings) {
                    if (importData.settings.currentView) {
                        currentView = importData.settings.currentView;
                    }
                    if (importData.settings.isDarkMode !== undefined) {
                        isDarkMode = importData.settings.isDarkMode;
                        applyTheme();
                    }
                }
                
                saveDataToStorage();
                renderTasks();
                
                console.log(`📥 Imported ${newTasksCount} new enhanced tasks`);
                showNotification(`Imported ${newTasksCount} tasks successfully! 📥`, 'success');
                
                if (newTasksCount > 0) {
                    showCelebration();
                }
                
            } else {
                throw new Error('Invalid file format');
            }
            
        } catch (error) {
            console.error('❌ Error importing tasks:', error);
            showNotification('Error importing tasks. Please check file format.', 'error');
        }
    };
    
    reader.readAsText(file);
    event.target.value = '';
}

// Enhanced celebration with more effects
function showCelebration() {
    console.log('🎉 Enhanced celebration triggered!');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#a8e6cf', '#ff9ff3', '#54a0ff'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.transition = 'all 3s linear';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.style.transform = `translateY(100vh) rotate(${Math.random() * 360}deg)`;
                confetti.style.opacity = '0';
            }, 10);
            
            setTimeout(() => {
                if (document.body.contains(confetti)) {
                    document.body.removeChild(confetti);
                }
            }, 3000);
        }, i * 30);
    }
}

// Board view specific functions
function makeBoardDraggable(element, task) {
    element.draggable = true;
    element.addEventListener('dragstart', (e) => {
        draggedTask = task;
        draggedElement = element;
        element.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
    });
    
    element.addEventListener('dragend', () => {
        element.style.opacity = '1';
        draggedTask = null;
        draggedElement = null;
    });
}

function setupBoardDropZones() {
    const columns = document.querySelectorAll('.board-tasks');
    
    columns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            column.classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });
        
        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.classList.remove('drag-over');
            
            if (draggedTask) {
                const newStatus = column.parentElement.dataset.status;
                updateTaskStatus(draggedTask.id, newStatus);
            }
        });
    });
}

function updateTaskStatus(taskId, newStatus) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = newStatus;
        if (newStatus === 'completed') {
            task.completed = true;
            task.completedAt = new Date().toISOString();
            showCelebration();
            showNotification('Task completed! 🎉', 'success');
        } else {
            task.completed = false;
            task.completedAt = null;
        }
        saveDataToStorage();
        renderTasks();
    }
}

// Enhanced edit functions (keeping existing structure but adding new features)
function startEdit(id) {
    const task = tasks.find(t => t.id === id);
    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    const taskContent = taskElement.querySelector('.task-content');
    
    taskElement.classList.add('editing');
    
    taskContent.innerHTML = `
        <div class="edit-form">
            <input type="text" value="${task.text}" class="edit-input" id="editInput${id}" autofocus>
            <div class="edit-controls">
                <select id="editCategory${id}" class="edit-select">
                    <option value="personal" ${task.category === 'personal' ? 'selected' : ''}>📋 Personal</option>
                    <option value="work" ${task.category === 'work' ? 'selected' : ''}>💼 Work</option>
                    <option value="shopping" ${task.category === 'shopping' ? 'selected' : ''}>🛒 Shopping</option>
                    <option value="health" ${task.category === 'health' ? 'selected' : ''}>🏥 Health</option>
                    <option value="home" ${task.category === 'home' ? 'selected' : ''}>🏠 Home</option>
                    <option value="other" ${task.category === 'other' ? 'selected' : ''}>📌 Other</option>
                </select>
                <select id="editPriority${id}" class="edit-select">
                    <option value="low" ${task.priority === 'low' ? 'selected' : ''}>🟢 Low</option>
                    <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>🟡 Medium</option>
                    <option value="high" ${task.priority === 'high' ? 'selected' : ''}>🔴 High</option>
                </select>
                <input type="date" id="editDueDate${id}" value="${task.dueDate || ''}" class="edit-date">
                <input type="number" id="editTime${id}" value="${task.timeEstimate || ''}" class="edit-time" placeholder="Minutes">
                <select id="editRecurring${id}" class="edit-recurring">
                    <option value="">No repeat</option>
                    <option value="daily" ${task.recurring === 'daily' ? 'selected' : ''}>Daily</option>
                    <option value="weekly" ${task.recurring === 'weekly' ? 'selected' : ''}>Weekly</option>
                    <option value="monthly" ${task.recurring === 'monthly' ? 'selected' : ''}>Monthly</option>
                    <option value="yearly" ${task.recurring === 'yearly' ? 'selected' : ''}>Yearly</option>
                </select>
            </div>
            <textarea id="editNotes${id}" class="edit-input" placeholder="Notes...">${task.notes || ''}</textarea>
            <div class="edit-buttons">
                <button onclick="saveEdit(${id})" class="save-btn">💾 Save</button>
                <button onclick="cancelEdit(${id})" class="cancel-btn">❌ Cancel</button>
            </div>
        </div>
    `;
    
    const editInput = document.getElementById(`editInput${id}`);
    editInput.focus();
    editInput.select();
    
    editInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            saveEdit(id);
        } else if (e.key === 'Escape') {
            cancelEdit(id);
        }
    });
}

function saveEdit(id) {
    const editInput = document.getElementById(`editInput${id}`);
    const editCategory = document.getElementById(`editCategory${id}`);
    const editPriority = document.getElementById(`editPriority${id}`);
    const editDueDate = document.getElementById(`editDueDate${id}`);
    const editTime = document.getElementById(`editTime${id}`);
    const editRecurring = document.getElementById(`editRecurring${id}`);
    const editNotes = document.getElementById(`editNotes${id}`);
    
    const newText = editInput.value.trim();
    
    if (newText === '') {
        editInput.style.animation = 'shake 0.5s';
        setTimeout(() => editInput.style.animation = '', 500);
        return;
    }
    
    tasks = tasks.map(t => 
        t.id === id ? { 
            ...t, 
            text: newText,
            category: editCategory.value,
            priority: editPriority.value,
            dueDate: editDueDate.value || null,
            timeEstimate: editTime.value ? parseInt(editTime.value) : null,
            recurring: editRecurring.value || null,
            notes: editNotes.value.trim(),
            tags: extractTags(newText)
        } : t
    );
    
    saveDataToStorage();
    renderTasks();
    showNotification('Task updated! ✏️', 'success');
}

function cancelEdit(id) {
    renderTasks();
}

console.log('🎯 All Tier 2 professional features loaded successfully! 🚀');