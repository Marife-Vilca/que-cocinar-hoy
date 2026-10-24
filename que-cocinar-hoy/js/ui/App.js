import { CATEGORIES, ROULETTE_SIZE, SPIN_MS, WEEK_DAYS } from "../config/constants.js";
import { Dish } from "../models/Dish.js";
import { Roulette } from "../services/Roulette.js";
import { Modal } from "./Modal.js";
import * as tpl from "./templates.js";

const $ = (id) => document.getElementById(id);
const VIEWS = ["ruleta", "semana", "catalogo"];
const todayName = () => WEEK_DAYS[(new Date().getDay() + 6) % 7];

// Controlador: conecta eventos del DOM con los servicios.
export class App {
  #repo;
  #plan;
  #modals;
  #category = "Todos";
  #pendingDishId = null; 
  #targetDay = null; 
  #pendingDeleteId = null;
  #spinning = false;
  #spinning = false;
  #backup;

  constructor(repo, plan, backup) {
    this.#backup = backup;
    this.#repo = repo;
    this.#plan = plan;
  }

  init() {
    this.#modals = {
      form: new Modal("modalDishForm"),
      assign: new Modal("modalAssignDay"),
      select: new Modal("modalSelectDish"),
      remove: new Modal("modalDeleteConfirm"),
    };

    const options = (items) => items.map((i) => `<option value="${i}">${i}</option>`).join("");
    $("formCategory").innerHTML = options(CATEGORIES);
    $("selectAssignDay").innerHTML = options(WEEK_DAYS);
    $("headerDayBadge").textContent = `${todayName()} de Menú`;

    document.addEventListener("click", (e) => this.#onClick(e));
    $("searchInput").addEventListener("input", () => this.#renderCatalog());
    $("dishForm").addEventListener("submit", (e) => this.#saveDish(e));
    $("importFile").addEventListener("change", (e) => this.#importData(e));

    this.#showView("ruleta");
  }

  // ---------- Eventos ----------
  #onClick(event) {
    const el = event.target.closest("[data-action]");
    if (!el) return;
    const { action, id } = el.dataset;
    const dishId = Number(id);

    const handlers = {
      view: () => this.#showView(id),
      spin: () => this.#spin(),
      pick: () => this.#openAssignModal(dishId),
      "confirm-assign": () => this.#confirmAssign(),
      "choose-day": () => this.#openSelectModal(id),
      "assign-to-day": () => this.#assignToTargetDay(dishId),
      "clear-day": () => { this.#plan.clear(id); this.#refresh(); },
      "reset-week": () => confirm("¿Deseas vaciar el plan semanal completo?") && (this.#plan.reset(), this.#refresh()),
      add: () => this.#openFormModal(),
      edit: () => this.#openFormModal(this.#repo.getById(dishId)),
      "request-delete": () => this.#openDeleteModal(dishId),
      "confirm-delete": () => this.#confirmDelete(),
      "reset-menu": () => confirm("¿Restaurar el catálogo con los platos iniciales?") && (this.#repo.restoreDefaults(), this.#refresh()),
      filter: () => { this.#category = id; this.#renderCatalog(); },
      "export-data": () => this.#backup.export(),
      "import-data": () => $("importFile").click(),
      "close-modal": () => this.#modals[id].close(),
    };
    handlers[action]?.();
  }

  // ---------- Navegación ----------
  #showView(name) {
    VIEWS.forEach((view) => {
      $(`view-${view}`).classList.toggle("hidden", view !== name);
      $(`view-${view}`).classList.toggle("flex", view === name);
    });
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      const active = btn.dataset.id === name;
      btn.classList.toggle("text-terracotta", active);
      btn.classList.toggle("text-subText", !active);
    });
    this.#refresh();
  }

  // Redibuja todo lo que depende de los datos.
  #refresh() {
    this.#renderBadge();
    this.#renderWeek();
    this.#renderCatalog();
  }

  // ---------- Ruleta ----------
  #availableDishes() {
    const cooked = this.#plan.cookedIds();
    return this.#repo.getAll().filter((d) => !cooked.includes(d.id));
  }

  #renderBadge() {
    $("availableRuletaBadge").textContent = `${this.#availableDishes().length} de ${this.#repo.getAll().length} disponibles`;
  }

  #spin() {
    if (this.#spinning) return;
    const available = this.#availableDishes();
    if (available.length === 0) {
      alert("¡Todos los platos ya están asignados en el plan semanal o no hay platos creados! Reinicia la semana o agrega más platos.");
      return;
    }

    this.#spinning = true;
    $("rouletteWheel").classList.add("spinning");
    $("resultsContainer").innerHTML = tpl.loading();

    setTimeout(() => {
      $("rouletteWheel").classList.remove("spinning");
      $("resultsContainer").innerHTML = Roulette.pick(available, ROULETTE_SIZE).map(tpl.resultCard).join("");
      this.#spinning = false;
    }, SPIN_MS);
  }

    async #importData(event) {
    const [file] = event.target.files;
    event.target.value = ""; 
    if (!file || !confirm("Esto reemplazará los platos y el plan actuales. ¿Continuar?")) return;
    try {
      await this.#backup.import(file);
      this.#refresh();
      alert("Datos importados correctamente.");
    } catch {
      alert("El archivo no es válido.");
    }
  }

  #openAssignModal(dishId) {
    const dish = this.#repo.getById(dishId);
    if (!dish) return;
    this.#pendingDishId = dishId;
    $("assignDishTitle").textContent = `"${dish.name}"`;
    $("selectAssignDay").value = this.#plan.firstEmptyDay();
    this.#modals.assign.open();
  }

  #confirmAssign() {
    const day = $("selectAssignDay").value;
    this.#plan.assign(day, this.#pendingDishId);
    this.#modals.assign.close();
    $("resultsContainer").innerHTML = tpl.assigned(day);
    this.#refresh();
  }

  // ---------- Plan semanal ----------
  #renderWeek() {
    const today = todayName();
    $("weeklyPlanContainer").innerHTML = WEEK_DAYS.map((day) => {
      const dishId = this.#plan.get(day);
      return tpl.weekRow(day, dishId ? this.#repo.getById(dishId) : null, day === today);
    }).join("");
  }

  #openSelectModal(day) {
    this.#targetDay = day;
    $("selectForDayTitle").textContent = `Elegir para el ${day}`;
    const available = this.#availableDishes();
    $("dishSelectorList").innerHTML = available.length
      ? available.map(tpl.selectorItem).join("")
      : tpl.noDishesLeft();
    this.#modals.select.open();
  }

  #assignToTargetDay(dishId) {
    this.#plan.assign(this.#targetDay, dishId);
    this.#modals.select.close();
    this.#refresh();
  }

  // ---------- Catálogo ----------
  #renderCatalog() {
    const query = $("searchInput").value.toLowerCase().trim();
    const all = this.#repo.getAll();
    const filtered = all.filter(
      (d) =>
        (this.#category === "Todos" || d.category === this.#category) &&
        d.name.toLowerCase().includes(query)
    );

    $("categoryChips").innerHTML = ["Todos", ...CATEGORIES].map((c) => tpl.chip(c, c === this.#category)).join("");
    $("catalogCounterText").textContent = `Mostrando ${filtered.length} de ${all.length} platos`;
    $("catalogContainer").innerHTML = filtered.length
      ? filtered.map(tpl.catalogItem).join("")
      : tpl.emptyCatalog();
  }

  #openFormModal(dish = null) {
    const form = $("dishForm");
    form.reset();
    $("formModalTitle").textContent = dish ? "Editar Plato" : "Agregar Nuevo Plato";
    if (dish) {
      Object.entries(dish).forEach(([key, value]) => {
        if (form.elements[key]) form.elements[key].value = value;
      });
    }
    this.#modals.form.open();
  }

  #saveDish(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    this.#repo.save(new Dish({ ...data, id: Number(data.id) || undefined, name: data.name.trim() }));
    this.#modals.form.close();
    this.#refresh();
  }

  #openDeleteModal(dishId) {
    const dish = this.#repo.getById(dishId);
    if (!dish) return;
    this.#pendingDeleteId = dishId;
    $("deleteDishNameText").textContent = `¿Estás seguro de eliminar "${dish.name}" del catálogo?`;
    this.#modals.remove.open();
  }

  #confirmDelete() {
    this.#repo.remove(this.#pendingDeleteId);
    this.#plan.removeDish(this.#pendingDeleteId);
    this.#pendingDeleteId = null;
    this.#modals.remove.close();
    this.#refresh();
  }
}
