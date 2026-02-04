class HabitTracker {
    constructor() {
        this.habits = JSON.parse(localStorage.getItem('habits') || '[]');
        this.init();
    }
    init() {
        document.getElementById('habitForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const habit = {
                id: Date.now(),
                name: document.getElementById('habitName').value,
                category: document.getElementById('habitCategory').value,
                frequency: document.getElementById('habitFrequency').value,
                createdAt: new Date().toISOString(),
                completions: [],
                streak: 0
            };
            this.habits.push(habit);
            localStorage.setItem('habits', JSON.stringify(this.habits));
            this.renderHabits();
            e.target.reset();
        });
        this.renderHabits();
    }
    completeHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        const today = new Date().toDateString();
        if (!habit.completions.includes(today)) {
            habit.completions.push(today);
            habit.streak++;
            localStorage.setItem('habits', JSON.stringify(this.habits));
            this.renderHabits();
        }
    }
    deleteHabit(id) {
        this.habits = this.habits.filter(h => h.id !== id);
        localStorage.setItem('habits', JSON.stringify(this.habits));
        this.renderHabits();
    }
    renderHabits() {
        const list = document.getElementById('habitsList');
        const empty = document.getElementById('emptyState');
        if (this.habits.length === 0) {
            list.style.display = 'none';
            empty.style.display = 'block';
            return;
        }
        list.style.display = 'grid';
        empty.style.display = 'none';
        list.innerHTML = this.habits.map(habit => {
            const total = habit.completions.length;
            const today = new Date().toDateString();
            const completed = habit.completions.includes(today);
            return `
                <div class="habit-card">
                    <div class="habit-header">
                        <div class="habit-name">${habit.name}</div>
                        <div class="habit-category">${habit.category}</div>
                    </div>
                    <div class="habit-stats">
                        <div class="stat-item">
                            <div class="stat-value">${total}</div>
                            <div class="stat-label">Total</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${habit.streak}</div>
                            <div class="stat-label">Streak</div>
                        </div>
                    </div>
                    <div class="habit-actions">
                        <button class="btn btn-success btn-small" onclick="habitTracker.completeHabit(${habit.id})" ${completed ? 'disabled' : ''}>
                            ${completed ? 'Completed' : 'Complete'}
                        </button>
                        <button class="btn btn-danger btn-small" onclick="habitTracker.deleteHabit(${habit.id})">
                            Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}
const habitTracker = new HabitTracker();