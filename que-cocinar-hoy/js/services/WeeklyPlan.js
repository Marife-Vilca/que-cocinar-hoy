import { WEEK_DAYS } from "../config/constants.js";

// Plan semanal: guarda solo IDs (no copias del plato). Se reinicia cada lunes.
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
    this.#plan[day] = dishId;
    this.#persist();
  }

  clear(day) {
    this.assign(day, null);
  }

  removeDish(dishId) {
    WEEK_DAYS.forEach((day) => {
      if (this.#plan[day] === dishId) this.#plan[day] = null;
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

  restore({ weekKey, plan }) {
    if (weekKey !== this.#mondayKey()) return;
    this.#plan = { ...this.#emptyPlan(), ...plan };
    this.#persist();
  }

  reset() {
    this.#plan = this.#emptyPlan();
    this.#persist();
  }

  #load() {
    const currentWeek = this.#mondayKey();
    if (this.#storage.get("weekKey") !== currentWeek) {
      this.#storage.set("weekKey", currentWeek);
      this.reset();
    } else {
      this.#plan = { ...this.#emptyPlan(), ...this.#storage.get("plan", {}) };
    }
  }

  #emptyPlan() {
    return Object.fromEntries(WEEK_DAYS.map((day) => [day, null]));
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
