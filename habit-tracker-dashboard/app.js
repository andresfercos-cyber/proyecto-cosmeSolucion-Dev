const STORAGE_KEY = "habit-tracker-dashboard:v1";
const THEME_KEY = "habit-tracker-dashboard:theme";

const state = {
  habits: [],
  filter: "all"
};

const form = document.querySelector("#habit-form");
const habitInput = document.querySelector("#habit-name");
const habitList = document.querySelector("#habit-list");
const template = document.querySelector("#habit-template");
const weeklyScore = document.querySelector("#weekly-score");
const weeklyMessage = document.querySelector("#weekly-message");
const streakScore = document.querySelector("#streak-score");
const weekChart = document.querySelector("#week-chart");
const todayLabel = document.querySelector("#today-label");
const resetButton = document.querySelector("#reset-demo");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const filterButtons = [...document.querySelectorAll(".filter-btn")];

const todayKey = toDateKey(new Date());

init();

function init() {
  loadState();
  applySavedTheme();
  seedDemoData();
  bindEvents();
  render();
}

function bindEvents() {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = habitInput.value.trim();

    if (!name) return;

    state.habits.unshift({
      id: createId(),
      name,
      createdAt: todayKey,
      completed: {}
    });

    habitInput.value = "";
    saveState();
    render();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      render();
    });
  });

  resetButton.addEventListener("click", () => {
    state.habits = [];
    localStorage.removeItem(STORAGE_KEY);
    seedDemoData(true);
    render();
  });

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcon();
  });
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    state.habits = Array.isArray(parsed.habits) ? parsed.habits : [];
  } catch {
    state.habits = [];
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits: state.habits }));
}

function seedDemoData(force = false) {
  if (state.habits.length && !force) return;

  const days = getLastSevenDays();
  state.habits = [
    createDemoHabit("Leer 20 minutos", days, [0, 1, 2, 4, 5, 6]),
    createDemoHabit("Tomar 8 vasos de agua", days, [0, 1, 3, 4, 6]),
    createDemoHabit("Caminar 30 minutos", days, [1, 2, 3, 5])
  ];

  saveState();
}

function createDemoHabit(name, days, completedIndexes) {
  const completed = {};
  completedIndexes.forEach((index) => {
    completed[days[index].key] = true;
  });

  return {
    id: createId(),
    name,
    createdAt: days[0].key,
    completed
  };
}

function render() {
  renderHeader();
  renderFilters();
  renderHabits();
  renderStats();
  renderChart();
}

function renderHeader() {
  todayLabel.textContent = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date());
}

function renderFilters() {
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === state.filter);
  });
}

function renderHabits() {
  habitList.innerHTML = "";
  const visibleHabits = getFilteredHabits();

  if (!visibleHabits.length) {
    habitList.innerHTML = `<div class="empty-state">${getEmptyMessage()}</div>`;
    return;
  }

  visibleHabits.forEach((habit) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const isDone = Boolean(habit.completed[todayKey]);
    const checkButton = node.querySelector(".check-btn");
    const deleteButton = node.querySelector(".delete-btn");

    node.classList.toggle("done", isDone);
    node.querySelector("h3").textContent = habit.name;
    node.querySelector("p").textContent = isDone ? "Completado hoy" : "Pendiente para hoy";
    checkButton.setAttribute("aria-pressed", String(isDone));

    checkButton.addEventListener("click", () => toggleHabit(habit.id));
    deleteButton.addEventListener("click", () => deleteHabit(habit.id));

    habitList.appendChild(node);
  });
}

function renderStats() {
  const weekData = getWeeklyData();
  const total = weekData.reduce((sum, day) => sum + day.total, 0);
  const done = weekData.reduce((sum, day) => sum + day.done, 0);
  const percent = total ? Math.round((done / total) * 100) : 0;

  weeklyScore.textContent = `${percent}%`;
  weeklyMessage.textContent = getWeeklyMessage(percent, total);
  streakScore.textContent = `${getCurrentStreak(weekData)} dias`;
}

function renderChart() {
  weekChart.innerHTML = "";

  getWeeklyData().forEach((day) => {
    const percent = day.total ? Math.round((day.done / day.total) * 100) : 0;
    const item = document.createElement("div");
    item.className = "day-bar";
    item.innerHTML = `
      <div class="bar-track">
        <div class="bar-fill" style="height: ${Math.max(percent, 4)}%"></div>
      </div>
      <span class="bar-label">${day.label}</span>
      <span class="bar-percent">${percent}%</span>
    `;
    weekChart.appendChild(item);
  });
}

function getFilteredHabits() {
  return state.habits.filter((habit) => {
    const isDone = Boolean(habit.completed[todayKey]);
    if (state.filter === "done") return isDone;
    if (state.filter === "pending") return !isDone;
    return true;
  });
}

function getWeeklyData() {
  return getLastSevenDays().map((day) => {
    const activeHabits = state.habits.filter((habit) => habit.createdAt <= day.key);
    const done = activeHabits.filter((habit) => habit.completed[day.key]).length;

    return {
      ...day,
      done,
      total: activeHabits.length
    };
  });
}

function getCurrentStreak(weekData) {
  let streak = 0;

  for (let index = weekData.length - 1; index >= 0; index -= 1) {
    const day = weekData[index];
    if (!day.total || day.done !== day.total) break;
    streak += 1;
  }

  return streak;
}

function getLastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    return {
      key: toDateKey(date),
      label: new Intl.DateTimeFormat("es-CO", { weekday: "short" }).format(date).replace(".", "")
    };
  });
}

function toggleHabit(id) {
  state.habits = state.habits.map((habit) => {
    if (habit.id !== id) return habit;

    return {
      ...habit,
      completed: {
        ...habit.completed,
        [todayKey]: !habit.completed[todayKey]
      }
    };
  });

  saveState();
  render();
}

function deleteHabit(id) {
  state.habits = state.habits.filter((habit) => habit.id !== id);
  saveState();
  render();
}

function getWeeklyMessage(percent, total) {
  if (!total) return "Agrega un habito para empezar.";
  if (percent >= 85) return "Semana fuerte. Vas con muy buen ritmo.";
  if (percent >= 55) return "Buen avance. Todavia puedes cerrar mejor.";
  return "Un paso hoy ya cambia la grafica.";
}

function getEmptyMessage() {
  if (!state.habits.length) return "Todavia no tienes habitos. Agrega el primero para comenzar.";
  if (state.filter === "done") return "Aun no completaste habitos hoy.";
  if (state.filter === "pending") return "Todo listo por hoy. Excelente cierre.";
  return "No hay habitos para mostrar.";
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `habit-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  document.body.classList.toggle("dark", savedTheme ? savedTheme === "dark" : prefersDark);
  updateThemeIcon();
}

function updateThemeIcon() {
  themeIcon.textContent = document.body.classList.contains("dark") ? "☾" : "☀";
}
