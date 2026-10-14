import { TaskManager } from "./TaskManager.js";
import { ApiService } from "./ApiService.js";
import { Task } from "./Task.js"; // 👈 Importación directa

/* ---------- Referencias DOM ---------- */
const taskListElement = document.getElementById("task-list");
const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskDescInput = document.getElementById("task-desc");
const taskLimitInput = document.getElementById("task-limit");
const fetchApiBtn = document.getElementById("fetch-api-btn");
const notificationEl = document.getElementById("notification");
const countdownEl = document.getElementById("countdown");
const startTimerBtn = document.getElementById("start-timer-btn");
const charCounter = document.getElementById("char-counter");
const taskCountEl = document.getElementById("task-count");

/* ---------- Instancias ---------- */
const taskManager = new TaskManager(taskListElement, notificationEl);
const apiService = new ApiService("https://jsonplaceholder.typicode.com");

/* ---------- Render inicial ---------- */
taskManager.render();
updateTaskCount();

/* ---------- Formulario: submit ---------- */
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = taskTitleInput.value.trim();
  const desc = taskDescInput.value.trim();
  const limit = taskLimitInput.value ? new Date(taskLimitInput.value) : null;

  if (!title) return;

  const newTask = await taskManager.addTaskAsync(
    title,
    desc,
    Date.now(),
    false,
    limit,
  );
  await apiService.saveRemoteTask(newTask);

  taskForm.reset();
  if (charCounter) charCounter.textContent = "0 caracteres";
  updateTaskCount();
});

/* ---------- keyup con destructuring ---------- */
taskTitleInput.addEventListener("keyup", ({ target }) => {
  if (charCounter)
    charCounter.textContent = `${target.value.length} caracteres`;
});

/* ---------- mouseover / mouseout ---------- */
taskListElement.addEventListener("mouseover", (e) => {
  const li = e.target.closest("li");
  if (li) li.classList.add("is-hovered");
});
taskListElement.addEventListener("mouseout", (e) => {
  const li = e.target.closest("li");
  if (li) li.classList.remove("is-hovered");
});

/* ---------- Importar desde API sin await ilegal ---------- */
fetchApiBtn.addEventListener("click", async () => {
  const remoteTasks = await apiService.fetchRemoteTasks(3);

  const mapped = remoteTasks.map(
    ({ title, id, completed }) =>
      new Task(
        id,
        title,
        "Importada desde API",
        completed,
        new Date(),
        new Date(Date.now() + 5 * 60 * 1000),
      ),
  );

  taskManager.addTasksFromApi(...mapped);
  updateTaskCount();
});

/* ---------- Contador global de demo ---------- */
startTimerBtn?.addEventListener("click", () => {
  taskManager.startCountdown(10, countdownEl);
});

/* ---------- UI: contador de tareas ---------- */
function updateTaskCount() {
  if (taskCountEl) {
    const n = taskManager.tasks.length;
    taskCountEl.textContent = `${n} ${n === 1 ? "tarea" : "tareas"}`;
  }
}

// Datos de ejemplo opcionales, independientes de las tareas creadas por el visitante.
document.getElementById("load-demo-tasks").addEventListener("click", () => {
  taskManager.addTasksFromApi(
    new Task("modulo9-example-1", "Explorar la billetera", "Probar un depósito con fondos ficticios"),
    new Task("modulo9-example-2", "Revisar el caso de estudio", "Explorar las respuestas verificadas de la API"),
  );
  updateTaskCount();
});

taskListElement.addEventListener("taskschange", updateTaskCount);
