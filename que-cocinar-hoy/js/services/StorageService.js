// Único punto de acceso a localStorage.
export class StorageService {
  #prefix;

  constructor(prefix) {
    this.#prefix = prefix;
  }

  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(`${this.#prefix}:${key}`);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback; // JSON corrupto
    }
  }

  set(key, value) {
    localStorage.setItem(`${this.#prefix}:${key}`, JSON.stringify(value));
  }
}
