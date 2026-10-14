/**
 * Servicio encargado del consumo de APIs externas usando Fetch API.
 * Encapsula comunicación HTTP y manejo de errores con try/catch.
 */
export class ApiService {
  /** @param {string} baseUrl */
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Obtiene tareas remotas.
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async fetchRemoteTasks(limit = 5) {
    try {
      const response = await fetch(`${this.baseUrl}/todos?_limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
      return [];
    }
  }

  /**
   * Simula persistencia con POST. Aplica destructuring y spread.
   * @param {Object} task
   * @returns {Promise<Object|null>}
   */
  async saveRemoteTask(task) {
    try {
      // Destructuring: extrae solo lo que necesita la API
      const { title, completed } = task;
      const payload = { title, completed, userId: 1 };

      const response = await fetch(`${this.baseUrl}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Spread: construye el body a partir del payload
        body: JSON.stringify({ ...payload }),
      });

      if (!response.ok) {
        throw new Error(`Error al guardar en la API: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error al enviar datos a la API:", error);
      return null;
    }
  }
}
