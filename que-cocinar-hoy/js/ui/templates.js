import { FALLBACK_PHOTOS } from "../config/constants.js";

// Funciones puras que devuelven HTML. Todo texto de usuario pasa por esc().
const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ESCAPES[c]);

const img = (dish, classes) =>
  `<img src="${esc(dish.image)}" alt="${esc(dish.name)}" onerror="this.onerror=null;this.src='${FALLBACK_PHOTOS[0]}'" class="${classes}">`;

const categoryBadge = (category) =>
  `<span class="inline-block text-sm bg-amberLight text-amber-900 font-bold px-2.5 py-1 rounded-lg">${esc(category)}</span>`;

const CHIP_BASE = "flex-shrink-0 px-5 py-2.5 rounded-full text-base transition";
const CHIP_ON = `${CHIP_BASE} font-bold bg-terracotta text-white`;
const CHIP_OFF = `${CHIP_BASE} font-semibold bg-white text-darkText border-2 border-amberAccent/40`;

export const chip = (category, isActive) =>
  `<button data-action="filter" data-id="${esc(category)}" class="${isActive ? CHIP_ON : CHIP_OFF}">${esc(category)}</button>`;

export const loading = () => `
  <div class="glass-card rounded-2xl p-7 text-center flex flex-col items-center justify-center gap-2">
    <i class="fa-solid fa-spinner animate-spin text-terracotta text-3xl"></i>
    <p class="text-lg font-bold text-darkText">Escogiendo opciones...</p>
  </div>`;

export const assigned = (day) => `
  <div class="glass-card rounded-2xl p-5 text-center text-lg text-darkText">
    <i class="fa-solid fa-circle-check text-emerald-600 text-3xl mb-2 block"></i>
    ¡Asignado al <strong>${esc(day)}</strong>!
    <p class="text-base text-subText mt-1">Gira de nuevo para ver más opciones.</p>
  </div>`;

export const emptyCatalog = () => `
  <div class="glass-card rounded-2xl p-6 text-center text-subText text-lg">
    <i class="fa-solid fa-magnifying-glass-minus text-3xl text-amberAccent mb-2 block"></i>
    No se encontraron platos.
  </div>`;

export const noDishesLeft = () =>
  `<div class="p-4 text-center text-lg text-subText">Todos los platos ya están en el plan de esta semana.</div>`;

export const resultCard = (dish, index) => `
  <div class="glass-card rounded-2xl p-3 flex gap-3 items-center card-enter" style="animation-delay:${index * 0.12}s">
    ${img(dish, "w-24 h-24 rounded-xl object-cover flex-shrink-0 bg-amberLight")}
    <div class="flex-1 min-w-0 flex flex-col gap-2">
      <div>
        <h3 class="font-bold text-darkText text-lg leading-tight break-words">${esc(dish.name)}</h3>
        <div class="mt-1">${categoryBadge(dish.category)}</div>
      </div>
      <button data-action="pick" data-id="${esc(dish.id)}" class="w-full py-2.5 bg-terracotta text-white font-bold rounded-xl text-base transition shadow-sm active:scale-95">
        Elegir día
      </button>
    </div>
  </div>`;

const todayTag = (isToday) =>
  isToday ? '<span class="bg-terracotta text-white text-sm font-bold px-2 py-0.5 rounded-full">HOY</span>' : "";

export const weekRow = (day, dish, isToday) => {
  const frame = `glass-card rounded-2xl p-3 flex gap-3 items-center ${isToday ? "border-2 border-terracotta bg-amber-50/40" : ""}`;
  const dayLine = `<div class="flex items-center gap-2"><span class="text-base font-extrabold ${isToday ? "text-terracotta" : "text-darkText"}">${day}</span>${todayTag(isToday)}</div>`;

  if (!dish) {
    return `
      <div class="${frame}">
        <div class="w-16 h-16 rounded-xl border-2 border-dashed border-amberAccent/50 flex items-center justify-center text-amberAccent text-2xl flex-shrink-0 bg-warmBg"><i class="fa-solid fa-plus"></i></div>
        <div class="flex-1 min-w-0">
          ${dayLine}
          <p class="text-base text-subText italic">Sin plato asignado</p>
        </div>
        <button data-action="choose-day" data-id="${day}" class="px-5 py-3 rounded-xl bg-amberLight text-amber-900 hover:bg-amber-200 text-base font-bold transition">Elegir</button>
      </div>`;
  }

  return `
    <div class="${frame}">
      ${img(dish, "w-16 h-16 rounded-xl object-cover bg-amberLight flex-shrink-0")}
      <div class="flex-1 min-w-0">
        ${dayLine}
        <h4 class="font-bold text-darkText text-lg leading-tight break-words">${esc(dish.name)}</h4>
        <p class="text-base text-subText">${esc(dish.category)}</p>
      </div>
      <button data-action="clear-day" data-id="${day}" aria-label="Quitar plato de ${day}" class="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 flex items-center justify-center text-lg transition flex-shrink-0">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>`;
};

export const catalogItem = (dish, index) => `
  <div class="glass-card rounded-2xl p-3 flex gap-3 items-center card-enter" style="animation-delay:${Math.min(index, 8) * 0.04}s">
    ${img(dish, "w-20 h-20 rounded-xl object-cover bg-amberLight flex-shrink-0")}
    <div class="flex-1 min-w-0">
      <h4 class="font-bold text-darkText text-lg leading-tight break-words">${esc(dish.name)}</h4>
      <div class="mt-1">${categoryBadge(dish.category)}</div>
    </div>
    <div class="flex flex-col gap-2 flex-shrink-0">
      <button data-action="edit" data-id="${esc(dish.id)}" aria-label="Editar ${esc(dish.name)}" class="w-12 h-12 rounded-xl bg-amberLight text-amber-900 hover:bg-amber-200 flex items-center justify-center text-lg transition"><i class="fa-solid fa-pen"></i></button>
      <button data-action="request-delete" data-id="${esc(dish.id)}" aria-label="Eliminar ${esc(dish.name)}" class="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 flex items-center justify-center text-lg transition"><i class="fa-solid fa-trash-can"></i></button>
    </div>
  </div>`;

export const selectorItem = (dish) => `
  <div data-action="assign-to-day" data-id="${esc(dish.id)}" role="button" tabindex="0" class="glass-card rounded-xl p-3 flex items-center justify-between gap-3 hover:bg-amberLight/50 transition cursor-pointer">
    <div class="flex items-center gap-3 min-w-0">
      ${img(dish, "w-16 h-16 rounded-lg object-cover flex-shrink-0")}
      <div class="min-w-0">
        <h5 class="font-bold text-lg text-darkText leading-tight break-words">${esc(dish.name)}</h5>
        <span class="text-base text-subText">${esc(dish.category)}</span>
      </div>
    </div>
    <i class="fa-solid fa-circle-plus text-terracotta text-2xl flex-shrink-0"></i>
  </div>`;
