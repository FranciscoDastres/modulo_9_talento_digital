/** Rutas públicas de esta copia, incluido el prefijo requerido por GitHub Pages. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  return base + path.replace(/^\/+/, "");
}
