import { FALLBACK_PHOTOS } from "../config/constants.js";

// Entidad: representa un plato del catálogo.
export class Dish {
  constructor({ id = Date.now(), name, category = "Criollo", time = "25 min", difficulty = "Media", image = "" }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.time = time || "25 min";
    this.difficulty = difficulty;
    this.image = image || FALLBACK_PHOTOS[Math.floor(Math.random() * FALLBACK_PHOTOS.length)];
  }
}
