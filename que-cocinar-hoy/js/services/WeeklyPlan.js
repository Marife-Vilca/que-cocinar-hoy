import { WEEK_DAYS } from "../config/constants.js";

// Plan semanal: guarda solo IDs (como texto). Se reinicia cada lunes.
export class WeeklyPlan {
  #storage;
  #plan;

  constructor(storage) {
    this.#storage = storage;
    this.#load();
  }

  get(day) {
    return this.#plan[day];
  }

  assign(day, dishId) {
    this.#plan[day] = dishId == null ? null : String(dishId);
    this.#persist();
  }

  clear(day) {
    this.assign(day, null);
  }

  removeDish(dishId) {
    WEEK_DAYS.forEach((day) => {
      if (this.#plan[day] === String(dishId)) this.#plan[day] = null;
    });
    this.#persist();
  }

  cookedIds() {
    return Object.values(this.#plan).filter((id) => id !== null);
  }

  firstEmptyDay() {
    return WEEK_DAYS.find((day) => this.#plan[day] === null) ?? WEEK_DAYS[0];
  }

  snapshot() {
    return { weekKey: this.#mondayKey(), plan: { ...this.#plan } };
  }

  // Solo restaura el plan si pertenece a la semana actual.
  restore({ weekKey, plan }) {
    if (weekKey !== this.#mondayKey()) return;
    this.#plan = this.#normalize(plan);
    this.#persist();
  }

  reset() {
    this.#plan = this.#normalize({});
    this.#persist();
  }

  #load() {
    const currentWeek = this.#mondayKey();
    if (this.#storage.get("weekKey") !== currentWeek) {
      this.#storage.set("weekKey", currentWeek);
      this.reset();
    } else {
      this.#plan = this.#normalize(this.#storage.get("plan", {}));
    }
  }

  // Asegura todos los días y IDs como texto (compatible con datos antiguos).
  #normalize(plan) {
    return Object.fromEntries(WEEK_DAYS.map((day) => [day, plan?.[day] == null ? null : String(plan[day])]));
  }

  // Identifica la semana por la fecha de su lunes.
  #mondayKey() {
    const date = new Date();
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return date.toDateString();
  }

  #persist() {
    this.#storage.set("plan", this.#plan);
  }
}
