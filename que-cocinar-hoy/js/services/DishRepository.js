import { Dish } from "../models/Dish.js";

// CRUD del catálogo de platos.
export class DishRepository {
  #storage;
  #defaults;
  #dishes;

  constructor(storage, defaults) {
    this.#storage = storage;
    this.#defaults = defaults;
    this.#dishes = storage.get("dishes", defaults).map((d) => new Dish(d));
  }

  // Siempre ordenados alfabéticamente.
  getAll() {
    return [...this.#dishes].sort(Dish.compareByName);
  }

  getById(id) {
    return this.#dishes.find((d) => d.id === String(id)) ?? null;
  }

  // Busca un plato con el mismo nombre en la misma categoría.
  findDuplicate(name, category, ignoreId = null) {
    const key = Dish.normalizeName(name);
    return (
      this.#dishes.find(
        (d) => d.id !== String(ignoreId) && d.category === category && Dish.normalizeName(d.name) === key
      ) ?? null
    );
  }

  save(dish) {
    const index = this.#dishes.findIndex((d) => d.id === dish.id);
    if (index >= 0) this.#dishes[index] = dish;
    else this.#dishes.push(dish);
    this.#persist();
  }

  remove(id) {
    this.#dishes = this.#dishes.filter((d) => d.id !== String(id));
    this.#persist();
  }

  replaceAll(dishes) {
    this.#dishes = dishes.map((d) => new Dish(d));
    this.#persist();
  }

  restoreDefaults() {
    this.#dishes = this.#defaults.map((d) => new Dish(d));
    this.#persist();
  }

  #persist() {
    this.#storage.set("dishes", this.#dishes);
  }
}
