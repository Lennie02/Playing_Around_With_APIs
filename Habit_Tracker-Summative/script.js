// State
let habits = [];
let darkMode = false;

// DOM Elements
let themeToggle;
let showAddFormBtn;
let addHabitForm;
let habitNameInput;
let addHabitBtn;
let cancelAddBtn;
let habitsList;
let totalHabitsEl;
let completedTodayEl;
let longestStreakEl;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements after page loads
    themeToggle = document.getElementById('themeToggle');
    showAddFormBtn = document.getElementById('showAddFormBtn');
    addHabitForm = document.getElementById('addHabitForm');
    habitNameInput = document.getElementById('habitNameInput');
    addHabitBtn = document.getElementById('addHabitBtn');
    cancelAddBtn = document.getElementById('cancelAddBtn');
    habitsList = document.getElementById('habitsList');
    totalHabitsEl = document.getElementById('totalHabits');
    completedTodayEl = document.getElementById('completedToday');
    longestStreakEl = document.getElementById('longestStreak');

    // Add event listeners
    themeToggle.addEventListener('click', function() {
        darkMode = !darkMode;
        document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    });

    showAddFormBtn.addEventListener('click', function() {
        showAddFormBtn.classList.add('hidden');
        addHabitForm.classList.remove('hidden');
        habitNameInput.focus();
    });

    cancelAddBtn.addEventListener('click', function() {
        addHabitForm.classList.add('hidden');
        showAddFormBtn.classList.remove('hidden');
        habitNameInput.value = '';
    });

    addHabitBtn.addEventListener('click', addHabit);
    habitNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addHabit();
        }
    });

    loadHabits();
    renderHabits();
    updateStats();
});

function addHabit() {
    const name = habitNameInput.value.trim();
    
    if (name) {
        const habit = {
            id: Date.now(),
            name: name,
            streak: 0,
            lastCompleted: null,
            completedToday: false
        };
        
        habits.push(habit);
        saveHabits();
        renderHabits();
        updateStats();
        
        habitNameInput.value = '';
        addHabitForm.classList.add('hidden');
        showAddFormBtn.classList.remove('hidden');
    }
}

// Delete Habit
function deleteHabit(id) {
    habits = habits.filter(function(h) { return h.id !== id; });
    saveHabits();
    renderHabits();
    updateStats();
}

// Toggle Habit
function toggleHabit(id) {
    const habit = habits.find(function(h) { return h.id === id; });
    
    if (habit) {
        const today = new Date().toDateString();
        const isCompletingToday = !habit.completedToday;
        
        habit.completedToday = isCompletingToday;
        habit.streak = isCompletingToday ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        habit.lastCompleted = isCompletingToday ? today : habit.lastCompleted;
        
        saveHabits();
        renderHabits();
        updateStats();
    }
}

// Render Habits
function renderHabits() {
    if (habits.length === 0) {
        habitsList.innerHTML = `
            <div class="empty-state">
                <p>No habits yet. Start building your routine!</p>
            </div>
        `;
        return;
    }
    
    habitsList.innerHTML = habits.map(habit => `
        <div class="habit-card ${habit.completedToday ? 'completed' : ''}">
            <div class="habit-card-content">
                <div class="habit-left">
                    <button class="habit-checkbox ${habit.completedToday ? 'checked' : ''}" onclick="toggleHabit(${habit.id})">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </button>
                    
                    <div class="habit-info">
                        <h3 class="habit-name ${habit.completedToday ? 'completed-text' : ''}">${habit.name}</h3>
                        <div class="habit-meta">
                            <div class="streak-info ${habit.streak > 0 ? 'active' : 'inactive'}">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2c1.5 4.5 4.5 7.5 7 9-2.5 3-4 6-4 9 0 2.5 2 4.5 4.5 4.5-3.5 0-6.5-2-8.5-5-2 3-5 5-8.5 5 2.5 0 4.5-2 4.5-4.5 0-3-1.5-6-4-9 2.5-1.5 5.5-4.5 7-9z"/>
                                </svg>
                                <span>${habit.streak} day streak</span>
                            </div>
                            ${habit.lastCompleted ? `<span class="last-completed">Last: ${habit.lastCompleted}</span>` : ''}
                        </div>
                    </div>
                </div>
                
                <button class="delete-btn" onclick="deleteHabit(${habit.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

// Update Stats
function updateStats() {
    totalHabitsEl.textContent = habits.length;
    completedTodayEl.textContent = habits.filter(function(h) { return h.completedToday; }).length;
    longestStreakEl.textContent = habits.length > 0 ? Math.max.apply(Math, habits.map(function(h) { return h.streak; })) : 0;
}

// Save Habits
function saveHabits() {
    const habitsData = JSON.stringify(habits);
    document.cookie = `habits=${habitsData}; path=/; max-age=31536000`;
}

// Load Habits
function loadHabits() {
    const cookies = document.cookie.split('; ');
    const habitsCookie = cookies.find(function(c) { return c.startsWith('habits='); });
    
    if (habitsCookie) {
        try {
            const habitsData = habitsCookie.split('=')[1];
            habits = JSON.parse(decodeURIComponent(habitsData));
        } catch (e) {
            habits = [];
        }
    }
}