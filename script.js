// script.js - Enhanced with Authentication, Dashboard, Charts & Analytics

// ==================== AUTHENTICATION SYSTEM ====================
let currentUser = null;
let users = [];

// Load users from localStorage
function loadUsers() {
    const savedUsers = localStorage.getItem('zenflow_users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Create default demo user
        users = [{
            id: 1,
            username: 'demo',
            email: 'demo@zenflow.com',
            password: 'demo123'
        }];
        localStorage.setItem('zenflow_users', JSON.stringify(users));
    }
}

function saveUsers() {
    localStorage.setItem('zenflow_users', JSON.stringify(users));
}

function login(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('zenflow_current_user', JSON.stringify({ id: user.id, username: user.username }));
        return true;
    }
    return false;
}

function register(username, email, password, confirmPassword) {
    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 3000);
        return false;
    }
    if (password.length < 6) {
        showToast('Password must be at least 6 characters!', 3000);
        return false;
    }
    if (users.find(u => u.username === username)) {
        showToast('Username already exists!', 3000);
        return false;
    }
    if (users.find(u => u.email === email)) {
        showToast('Email already registered!', 3000);
        return false;
    }
    
    const newUser = {
        id: Date.now(),
        username,
        email,
        password
    };
    users.push(newUser);
    saveUsers();
    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('zenflow_current_user');
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('authModal').style.display = 'flex';
    showToast('Logged out successfully');
}

function checkAutoLogin() {
    const savedUser = localStorage.getItem('zenflow_current_user');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        const user = users.find(u => u.id === userData.id);
        if (user) {
            currentUser = user;
            document.getElementById('authModal').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            loadUserData();
            return true;
        }
    }
    return false;
}

// ==================== DATA MODELS ====================
let tasks = [];
let routines = [];
let editTaskId = null;
let currentTheme = 'light';
let categoryChart, priorityChart, weeklyChart;

// ==================== DOM ELEMENTS ====================
const taskListContainer = document.getElementById('taskListContainer');
const timelineView = document.getElementById('timelineView');
const taskModal = document.getElementById('taskModal');
const routineModal = document.getElementById('routineModal');
const toastMsg = document.getElementById('toastMsg');

// ==================== USER DATA MANAGEMENT ====================
function getUserStorageKey() {
    return `zenflow_${currentUser.id}_data`;
}

function saveUserData() {
    const userData = {
        tasks: tasks,
        routines: routines,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(getUserStorageKey(), JSON.stringify(userData));
}

function loadUserData() {
    const saved = localStorage.getItem(getUserStorageKey());
    if (saved) {
        const userData = JSON.parse(saved);
        tasks = userData.tasks || [];
        routines = userData.routines || [];
    } else {
        // Initialize with sample data for new users
        tasks = [
            { id: 1001, title: 'Complete project proposal', category: 'Work', priority: 'High', dueDate: new Date(Date.now() + 86400000).toISOString().slice(0,16), completed: false, createdAt: new Date().toISOString() },
            { id: 1002, title: 'Morning meditation', category: 'Health', priority: 'Medium', dueDate: new Date().toISOString().slice(0,16), completed: false, createdAt: new Date().toISOString() },
            { id: 1003, title: 'Learn React.js', category: 'Study', priority: 'High', dueDate: new Date(Date.now() + 172800000).toISOString().slice(0,16), completed: true, createdAt: new Date().toISOString() },
            { id: 1004, title: 'Team meeting', category: 'Work', priority: 'High', dueDate: new Date(Date.now() + 43200000).toISOString().slice(0,16), completed: false, createdAt: new Date().toISOString() },
            { id: 1005, title: 'Grocery shopping', category: 'Personal', priority: 'Low', dueDate: new Date(Date.now() + 129600000).toISOString().slice(0,16), completed: false, createdAt: new Date().toISOString() }
        ];
        routines = [
            { id: 1, title: 'Wake up & stretch', section: 'Morning', time: '07:00' },
            { id: 2, title: 'Deep work session', section: 'Afternoon', time: '14:00' },
            { id: 3, title: 'Exercise', section: 'Evening', time: '18:00' },
            { id: 4, title: 'Plan tomorrow', section: 'Night', time: '22:00' }
        ];
    }
    updateUserGreeting();
    renderAll();
}

// ==================== HELPER FUNCTIONS ====================
function showToast(message, duration = 3000) {
    toastMsg.textContent = message;
    toastMsg.classList.add('show');
    setTimeout(() => toastMsg.classList.remove('show'), duration);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function updateUserGreeting() {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';
    document.getElementById('userGreeting').innerHTML = `${greeting}, ${escapeHtml(currentUser.username)} <i class="fas fa-smile-wink"></i>`;
}

// ==================== LIVE CLOCK & DATE ====================
function updateDateTime() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString(undefined, dateOptions);
    document.getElementById('liveClock').textContent = now.toLocaleTimeString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

// ==================== MOTIVATIONAL QUOTES ====================
const quotes = [
    "✨ The secret of getting ahead is getting started.",
    "💪 Believe you can and you're halfway there.",
    "🎯 Focus on being productive instead of busy.",
    "🌟 Small daily improvements are the key to staggering results.",
    "🚀 Your future self will thank you for today's efforts.",
    "⚡ Don't watch the clock; do what it does. Keep going.",
    "🏆 Success is the sum of small efforts, repeated day in and day out.",
    "📚 The only limit to your impact is your imagination and commitment.",
    "💡 Productivity isn't about being busy, it's about being effective.",
    "🎨 Make each day your masterpiece."
];
function updateQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('motivationalQuote').textContent = randomQuote;
}
setInterval(updateQuote, 30000);
updateQuote();

// ==================== DASHBOARD STATS ====================
function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.dueDate?.split('T')[0] === today && !t.completed).length;
    const overdue = tasks.filter(t => t.dueDate && t.dueDate < new Date().toISOString().slice(0,16) && !t.completed).length;
    const productivityScore = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('todayTasksCount').textContent = todayTasks;
    document.getElementById('overdueTasks').textContent = overdue;
    document.getElementById('productivityScore').textContent = productivityScore;
    document.getElementById('totalCompleted').textContent = completed;
    
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    document.getElementById('completionPercent').textContent = `${percent}%`;
    document.getElementById('progressFill').style.width = `${percent}%`;
    
    // Streak counter
    let streak = 0;
    const todayDate = new Date();
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(todayDate);
        checkDate.setDate(todayDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        const hasCompleted = tasks.some(t => t.completed && t.dueDate?.split('T')[0] === dateStr);
        if (hasCompleted) streak++;
        else break;
    }
    document.getElementById('streakCount').textContent = streak;
}

// ==================== CHARTS & ANALYTICS ====================
function updateCharts() {
    // Category distribution
    const categories = ['Study', 'Personal', 'Work', 'Health', 'Other'];
    const categoryCounts = categories.map(cat => tasks.filter(t => t.category === cat).length);
    
    if (categoryChart) categoryChart.destroy();
    const ctx1 = document.getElementById('categoryChart').getContext('2d');
    categoryChart = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: categoryCounts,
                backgroundColor: ['#7c3aed', '#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: getComputedStyle(document.body).getPropertyValue('--text-primary') } }
            }
        }
    });
    
    // Priority breakdown
    const priorities = ['High', 'Medium', 'Low'];
    const priorityCounts = priorities.map(pri => tasks.filter(t => t.priority === pri).length);
    if (priorityChart) priorityChart.destroy();
    const ctx2 = document.getElementById('priorityChart').getContext('2d');
    priorityChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: priorities,
            datasets: [{
                label: 'Tasks',
                data: priorityCounts,
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
    
    // Weekly progress (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const completedCount = tasks.filter(t => t.completed && t.dueDate?.split('T')[0] === dateStr).length;
        weeklyData.push(completedCount);
    }
    if (weeklyChart) weeklyChart.destroy();
    const ctx3 = document.getElementById('weeklyChart').getContext('2d');
    weeklyChart = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'Yesterday', 'Today'],
            datasets: [{
                label: 'Completed Tasks',
                data: weeklyData,
                borderColor: '#7c3aed',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
}

// ==================== RENDER TASKS ====================
function renderTasks() {
    const searchTerm = document.getElementById('taskSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;
    const priorityFilter = document.getElementById('filterPriority').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const sortType = document.getElementById('sortTasks').value;
    
    let filtered = tasks.filter(task => {
        const matchSearch = task.title.toLowerCase().includes(searchTerm);
        const matchCategory = categoryFilter === 'all' || task.category === categoryFilter;
        const matchPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        const matchStatus = statusFilter === 'all' || (statusFilter === 'completed' ? task.completed : !task.completed);
        return matchSearch && matchCategory && matchPriority && matchStatus;
    });
    
    // Sorting
    if (sortType === 'dateAsc') filtered.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
    else if (sortType === 'dateDesc') filtered.sort((a,b) => new Date(b.dueDate) - new Date(a.dueDate));
    else if (sortType === 'priorityHigh') {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        filtered.sort((a,b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }
    
    taskListContainer.innerHTML = filtered.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <div class="task-header">
                <span class="task-title">${escapeHtml(task.title)}</span>
                <small>${task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No date'}</small>
            </div>
            <div class="task-badges">
                <span class="badge" style="background: var(--accent-purple);">${task.category}</span>
                <span class="badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
            </div>
            <div class="task-actions">
                <button onclick="toggleComplete(${task.id})" title="Complete"><i class="fas ${task.completed ? 'fa-undo' : 'fa-check-circle'}"></i></button>
                <button onclick="editTask(${task.id})" title="Edit"><i class="fas fa-edit"></i></button>
                <button onclick="deleteTask(${task.id})" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
    updateDashboard();
    updateCharts();
}

// ==================== TASK CRUD ====================
function openTaskModal(task = null) {
    document.getElementById('modalTitle').textContent = task ? 'Edit Task' : 'Add New Task';
    document.getElementById('taskTitle').value = task ? task.title : '';
    document.getElementById('taskCategory').value = task ? task.category : 'Personal';
    document.getElementById('taskPriority').value = task ? task.priority : 'Medium';
    document.getElementById('taskDueDate').value = task && task.dueDate ? task.dueDate.slice(0,16) : '';
    editTaskId = task ? task.id : null;
    taskModal.style.display = 'block';
}

function saveTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const category = document.getElementById('taskCategory').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    
    if (!title) { showToast('Task title required'); return; }
    
    if (editTaskId !== null) {
        const index = tasks.findIndex(t => t.id === editTaskId);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], title, category, priority, dueDate };
            showToast('Task updated');
        }
    } else {
        const newTask = {
            id: Date.now(),
            title,
            category,
            priority,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        showToast('Task added successfully! 🎉');
    }
    saveUserData();
    renderTasks();
    closeModal();
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveUserData();
        renderTasks();
        showToast(task.completed ? '🎉 Task completed! Great job!' : 'Task marked as pending');
    }
}

function deleteTask(id) {
    if (confirm('Delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveUserData();
        renderTasks();
        showToast('Task deleted');
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) openTaskModal(task);
}

// ==================== ROUTINE SCHEDULER ====================
function renderRoutines() {
    const sections = { Morning: [], Afternoon: [], Evening: [], Night: [] };
    routines.forEach(routine => {
        if (sections[routine.section]) sections[routine.section].push(routine);
    });
    
    timelineView.innerHTML = Object.entries(sections).map(([section, items]) => `
        <div class="timeline-section">
            <div class="section-title"><i class="fas fa-${section === 'Morning' ? 'sun' : section === 'Afternoon' ? 'cloud-sun' : section === 'Evening' ? 'moon' : 'stars'}"></i> ${section}</div>
            ${items.map(item => `
                <div class="routine-item">
                    <div><strong>${escapeHtml(item.title)}</strong> <span class="routine-time">⏰ ${item.time}</span></div>
                    <button class="delete-routine" onclick="deleteRoutine(${item.id})"><i class="fas fa-times-circle"></i></button>
                </div>
            `).join('')}
            ${items.length === 0 ? '<div style="opacity:0.6; padding:8px;">No activities yet</div>' : ''}
        </div>
    `).join('');
}

function addRoutine() {
    routineModal.style.display = 'block';
}

function saveRoutine() {
    const title = document.getElementById('routineTitle').value.trim();
    const section = document.getElementById('routineSection').value;
    const time = document.getElementById('routineTime').value;
    if (!title) { showToast('Activity name required'); return; }
    const newRoutine = { id: Date.now(), title, section, time };
    routines.push(newRoutine);
    saveUserData();
    renderRoutines();
    closeRoutineModal();
    showToast('Routine activity added');
}

function deleteRoutine(id) {
    routines = routines.filter(r => r.id !== id);
    saveUserData();
    renderRoutines();
    showToast('Activity removed');
}

// ==================== CALENDAR WIDGET ====================
function renderCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let calendarHtml = '';
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    weekdays.forEach(day => calendarHtml += `<div style="text-align:center; font-weight:600;">${day}</div>`);
    
    for (let i = 0; i < firstDay; i++) calendarHtml += `<div></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === now.getDate();
        calendarHtml += `<div class="cal-day" style="${isToday ? 'background: var(--accent-purple); color:white;' : ''}">${d}</div>`;
    }
    document.getElementById('miniCalendar').innerHTML = calendarHtml;
}

// ==================== IMPORT/EXPORT JSON ====================
function exportTasks() {
    const dataStr = JSON.stringify({ tasks, routines, exportDate: new Date(), user: currentUser.username }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zenflow_${currentUser.username}_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully');
}

function importTasks(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.tasks) tasks = imported.tasks;
            if (imported.routines) routines = imported.routines;
            saveUserData();
            renderAll();
            showToast('Import successful!');
        } catch (err) { showToast('Invalid JSON file'); }
    };
    reader.readAsText(file);
}

// ==================== THEME TOGGLE ====================
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggleBtn').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.removeAttribute('data-theme');
        document.getElementById('themeToggleBtn').innerHTML = '<i class="fas fa-moon"></i>';
    }
    currentTheme = theme;
    localStorage.setItem('zenflow_theme', theme);
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    showToast(`${currentTheme === 'dark' ? 'Dark' : 'Light'} mode activated`);
    setTimeout(() => updateCharts(), 100);
}

// ==================== DASHBOARD VIEW TOGGLE ====================
let dashboardVisible = false;
function toggleDashboardView() {
    const dashboardView = document.getElementById('dashboardView');
    const mainDashboard = document.getElementById('mainDashboard');
    if (dashboardVisible) {
        dashboardView.style.display = 'none';
        mainDashboard.style.display = 'grid';
        dashboardVisible = false;
    } else {
        dashboardView.style.display = 'block';
        mainDashboard.style.display = 'none';
        dashboardVisible = true;
        updateCharts();
    }
}

// ==================== QUICK ADD & KEYBOARD SHORTCUTS ====================
function quickAddTask() {
    openTaskModal(null);
}

document.addEventListener('keydown', (e) => {
    if (currentUser) {
        if (e.key === 'n' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            quickAddTask();
        }
        if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            addRoutine();
        }
        if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            toggleDashboardView();
        }
        if (e.key === 'Escape') {
            closeModal();
            closeRoutineModal();
        }
    }
});

// ==================== MODAL CONTROLS ====================
function closeModal() {
    taskModal.style.display = 'none';
    editTaskId = null;
}
function closeRoutineModal() {
    routineModal.style.display = 'none';
}

// ==================== RENDER ALL ====================
function renderAll() {
    renderTasks();
    renderRoutines();
    renderCalendar();
    updateDashboard();
    updateCharts();
}

// ==================== INITIALIZATION ====================
function initAuth() {
    loadUsers();
    
    // Auth tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            document.getElementById('loginForm').classList.toggle('active', tabName === 'login');
            document.getElementById('registerForm').classList.toggle('active', tabName === 'register');
        });
    });
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        if (login(username, password)) {
            showToast(`Welcome back, ${username}!`);
            document.getElementById('authModal').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            loadUserData();
        } else {
            showToast('Invalid username or password!');
        }
    });
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        if (register(username, email, password, confirmPassword)) {
            showToast('Registration successful! Please login.');
            document.querySelector('.auth-tab[data-tab="login"]').click();
            document.getElementById('regUsername').value = '';
            document.getElementById('regEmail').value = '';
            document.getElementById('regPassword').value = '';
            document.getElementById('regConfirmPassword').value = '';
        }
    });
    
    // Check auto-login
    if (!checkAutoLogin()) {
        document.getElementById('authModal').style.display = 'flex';
    }
}

function initApp() {
    // Load theme
    const savedTheme = localStorage.getItem('zenflow_theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        applyTheme(currentTheme);
    }
    
    // Event listeners
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
    document.getElementById('exportJsonBtn').addEventListener('click', exportTasks);
    document.getElementById('importInput').addEventListener('change', (e) => { if(e.target.files[0]) importTasks(e.target.files[0]); e.target.value = ''; });
    document.getElementById('quickTaskBtn').addEventListener('click', quickAddTask);
    document.getElementById('addRoutineSlotBtn').addEventListener('click', addRoutine);
    document.getElementById('saveTaskBtn').addEventListener('click', saveTask);
    document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
    document.getElementById('saveRoutineBtn').addEventListener('click', saveRoutine);
    document.getElementById('cancelRoutineBtn').addEventListener('click', closeRoutineModal);
    document.getElementById('dashboardViewBtn').addEventListener('click', toggleDashboardView);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.querySelector('.close-routine-modal').addEventListener('click', closeRoutineModal);
    document.getElementById('taskSearch').addEventListener('input', renderTasks);
    document.getElementById('filterCategory').addEventListener('change', renderTasks);
    document.getElementById('filterPriority').addEventListener('change', renderTasks);
    document.getElementById('filterStatus').addEventListener('change', renderTasks);
    document.getElementById('sortTasks').addEventListener('change', renderTasks);
}

// Start the application
initAuth();
initApp();
