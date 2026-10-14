/**
 * Clase que representa una Tarea individual dentro del sistema.
 * Aplica principios de POO encapsulando propiedades y métodos propios de una tarea.
 */
export class Task {
  /**
   * @param {number|string} id
   * @param {string} title
   * @param {string} descripcion
   * @param {boolean} completed
   * @param {Date|string} fechaCreacion
   * @param {Date|string|null} fechaLimite
   */
  constructor(
    id,
    title,
    descripcion = "",
    completed = false,
    fechaCreacion = new Date(),
    fechaLimite = null,
  ) {
    this.id = id;
    this.title = title;
    this.descripcion = descripcion;
    this.completed = completed;
    this.fechaCreacion = new Date(fechaCreacion);
    this.fechaLimite = fechaLimite ? new Date(fechaLimite) : null;
  }

  /** Alterna el estado entre completada y pendiente. */
  toggleStatus() {
    this.completed = !this.completed;
  }

  /** Actualiza el título. */
  updateTitle(newTitle) {
    this.title = newTitle;
  }

  /** Actualiza la descripción. */
  updateDescription(newDescription) {
    this.descripcion = newDescription;
  }

  /**
   * Marca la tarea como eliminada. El filtrado real lo hace TaskManager,
   * pero este método encapsula la intención de "eliminar" en el modelo.
   * @returns {boolean} true si la tarea se puede eliminar.
   */
  delete() {
    return true;
  }

  /**
   * Retorna el estado legible.
   * @returns {string}
   */
  getEstado() {
    return this.completed ? "Completada" : "Pendiente";
  }

  /**
   * Calcula los segundos restantes hasta la fecha límite.
   * @returns {number|null} Segundos restantes o null si no hay fecha límite.
   */
  getTiempoRestante() {
    if (!this.fechaLimite) return null;
    const diff = this.fechaLimite.getTime() - Date.now();
    return Math.max(0, Math.floor(diff / 1000));
  }

  /** Serializa la tarea para LocalStorage. */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      descripcion: this.descripcion,
      completed: this.completed,
      fechaCreacion: this.fechaCreacion,
      fechaLimite: this.fechaLimite,
    };
  }
}
