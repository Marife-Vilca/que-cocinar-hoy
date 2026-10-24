import { STORAGE_PREFIX } from "./config/constants.js";
import { DEFAULT_DISHES } from "./config/defaultDishes.js";
import { DishRepository } from "./services/DishRepository.js";
import { StorageService } from "./services/StorageService.js";
import { WeeklyPlan } from "./services/WeeklyPlan.js";
import { App } from "./ui/App.js";

// Composición: aquí se crean y conectan las dependencias.
const storage = new StorageService(STORAGE_PREFIX);
const repository = new DishRepository(storage, DEFAULT_DISHES);
const weeklyPlan = new WeeklyPlan(storage);

new App(repository, weeklyPlan).init();
