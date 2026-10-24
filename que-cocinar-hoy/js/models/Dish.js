import { CATEGORIES, FALLBACK_PHOTOS } from "../config/constants.js";

// Entidad: representa un plato del catálogo.
export class Dish {
  constructor({ id, name, category, image = "" }) {
    this.id = String(id ?? Dish.newId());
    this.name = name;
    this.category = Dish.normalizeCategory(category, name);
    this.image = image || FALLBACK_PHOTOS[Math.floor(Math.random() * FALLBACK_PHOTOS.length)];
  }

  // ID único: evita que un plato nuevo pise a otro.
  static newId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // Compara nombres ignorando mayúsculas, tildes y espacios repetidos.
  static normalizeName(name) {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  static compareByName(a, b) {
    return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
  }

  // Convierte categorías antiguas (Criollo, Sopas/Guisos) a las actuales.
  static normalizeCategory(category, name = "") {
    if (CATEGORIES.includes(category)) return category;
    if (category === "Sopas/Guisos" && /sopa|caldo|chupe|aguadito/i.test(name)) return "Sopas";
    return "Guisos";
  }
}
