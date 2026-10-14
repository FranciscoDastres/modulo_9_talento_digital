import { Task } from "./Task.js";

/**
 * Gestor global de tareas: estado en memoria, LocalStorage y DOM.
 */
export class TaskManager {
  constructor(containerElement, notificationElement) {
    this.tasks = [];
    this.containerElement = containerElement;
    this.notificationElement = notificationElement;
    this.countdownInterval = null; // contador global de demo
    this.tickerInterval = null; // ticker de contadores por tarea
    this.loadFromLocalStorage();
    this.startTicker();
  }

  /* ---------- Persistencia ---------- */

  saveToLocalStorage() {
    localStorage.setItem("modulo9.taskflow.tasks", JSON.stringify(this.tasks));
  }

  loadFromLocalStorage() {
    const stored = localStorage.getItem("modulo9.taskflow.tasks");
    if (!stored) return;

    // Destructuring + map a instancias Task
    const parsed = JSON.parse(stored);
    this.tasks = parsed.map(
      ({ id, title, descripcion, completed, fechaCreacion, fechaLimite }) =>
        new Task(id, title, descripcion, completed, fechaCreacion, fechaLimite),
    );
  }

  /* ---------- Notificaciones ---------- */

  /**
   * Notificación diferida 2s (requisito del PDF).
   * @param {string} message
   */
  showNotification(message) {
    setTimeout(() => {
      if (!this.notificationElement) return;
      this.notificationElement.textContent = message;
      this.notificationElement.style.display = "block";
      setTimeout(() => {
        this.notificationElement.style.display = "none";
      }, 3000);
    }, 2000);
  }

  /* ---------- Operaciones ---------- */

  /**
   * Agrega una tarea simulando retardo asíncrono.
   * Usa REST para aceptar argumentos flexibles (requisito ES6+).
   * @returns {Promise<Task>}
   */
  addTaskAsync(...args) {
    const [
      title,
      descripcion = "",
      id = Date.now(),
      completed = false,
      fechaLimite = null,
    ] = args;

    return new Promise((resolve) => {
      setTimeout(() => {
        const task = new Task(
          id,
          title,
          descripcion,
          completed,
          new Date(),
          fechaLimite,
        );
        // Spread: no mutamos, creamos nuevo array
        this.tasks = [...this.tasks, task];
        this.saveToLocalStorage();
        this.render();
        this.showNotification(`Tarea "${title}" agregada exitosamente.`);
        resolve(task);
      }, 1000);
    });
  }

  /**
   * Agrega múltiples tareas de una sola vez (usado tras fetch a la API).
   * Aplica rest operator.
   * @param  {...Task} tasks
   */
  addTasksFromApi(...tasks) {
    const existing = new Set(this.tasks.map(task => String(task.id)));
    const newTasks = tasks.filter(task => !existing.has(String(task.id)) && existing.add(String(task.id)));
    this.tasks = [...this.tasks, ...newTasks];
    this.saveToLocalStorage();
    this.render();
  }

  /**
   * Elimina una tarea por ID.
   * @param {number|string} id
   */
  deleteTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;
    // Encapsula la intención de eliminar en el modelo
    if (task.delete()) {
      this.tasks = this.tasks.filter((t) => t.id !== id);
      this.saveToLocalStorage();
      this.render();
      this.showNotification(`Tarea "${task.title}" eliminada.`);
    }
  }

  toggleTaskStatus(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      task.toggleStatus();
      this.saveToLocalStorage();
      this.render();
    }
  }

  editTask(id, newTitle) {
    const task = this.tasks.find((t) => t.id === id);
    if (task && newTitle.trim() !== "") {
      task.updateTitle(newTitle);
      this.saveToLocalStorage();
      this.render();
    }
  }

  /* ---------- Contadores ---------- */

  /**
   * Contador global de demo (botón "Iniciar temporizador").
   * @param {number} seconds
   * @param {HTMLElement} displayElement
   */
  startCountdown(seconds, displayElement) {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    let timeRemaining = seconds;

    this.countdownInterval = setInterval(() => {
      if (timeRemaining <= 0) {
        clearInterval(this.countdownInterval);
        displayElement.textContent = "¡Tiempo finalizado!";
      } else {
        displayElement.textContent = `${timeRemaining}s`;
        timeRemaining--;
      }
    }, 1000);
  }

  /**
   * Ticker global que actualiza TODOS los contadores por tarea cada segundo.
   * Requisito PDF: "contador regresivo para tareas con fecha límite".
   */
  startTicker() {
    if (this.tickerInterval) clearInterval(this.tickerInterval);
    this.tickerInterval = setInterval(() => {
      this.containerElement
        .querySelectorAll("[data-countdown]")
        .forEach((el) => {
          const id = el.getAttribute("data-countdown");
          const task = this.tasks.find((t) => String(t.id) === String(id));
          if (!task) return;
          const remaining = task.getTiempoRestante();
          if (remaining === null) return;
          el.textContent = this.formatRemaining(remaining);
          el.classList.toggle("expired", remaining <= 0);
        });
    }, 1000);
  }

  /** @param {number} s */
  formatRemaining(s) {
    if (s <= 0) return "⏰ Vencida";
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `⏱ ${m}m ${sec}s` : `⏱ ${sec}s`;
  }

  /* ---------- Render ---------- */

  render() {
    this.containerElement.innerHTML = "";
    const fragment = document.createDocumentFragment();

    this.tasks.forEach((task) => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      // ---- Info ----
      const infoDiv = document.createElement("div");
      infoDiv.className = "task-info";

      const titleSpan = document.createElement("strong");
      titleSpan.textContent = task.title;

      const statusSpan = document.createElement("small");
      statusSpan.className = "task-status";
      statusSpan.textContent = ` [${task.getEstado()}]`;

      const descP = document.createElement("p");
      descP.textContent = task.descripcion || "Sin descripción";

      infoDiv.append(titleSpan, statusSpan, descP);

      // ---- Contador por tarea ----
      if (task.fechaLimite) {
        const countdown = document.createElement("span");
        countdown.className = "task-countdown";
        countdown.setAttribute("data-countdown", task.id);
        const remaining = task.getTiempoRestante();
        countdown.textContent = this.formatRemaining(remaining);
        if (remaining <= 0) countdown.classList.add("expired");
        infoDiv.appendChild(countdown);
      }

      // ---- Acciones ----
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "task-actions";

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "btn btn-secondary btn-sm";
      toggleBtn.textContent = task.completed ? "Desmarcar" : "Completar";
      toggleBtn.addEventListener("click", () => this.toggleTaskStatus(task.id));

      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-secondary btn-sm";
      editBtn.textContent = "Editar";
      editBtn.addEventListener("click", () => {
        const newTitle = prompt("Nuevo título:", task.title);
        if (newTitle) this.editTask(task.id, newTitle);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-delete btn-sm";
      deleteBtn.textContent = "Eliminar";
      deleteBtn.addEventListener("click", () => this.deleteTask(task.id));

      actionsDiv.append(toggleBtn, editBtn, deleteBtn);
      li.append(infoDiv, actionsDiv);
      fragment.appendChild(li);
    });

    this.containerElement.appendChild(fragment);
    this.containerElement.dispatchEvent(new CustomEvent("taskschange"));
  }
}
