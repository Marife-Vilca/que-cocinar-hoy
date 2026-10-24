import { FALLBACK_PHOTOS } from "../config/constants.js";

// Funciones puras que devuelven HTML. Todo texto de usuario pasa por esc().
const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ESCAPES[c]);

const img = (dish, classes) =>
  `<img src="${esc(dish.image)}" alt="${esc(dish.name)}" onerror="this.onerror=null;this.src='${FALLBACK_PHOTOS[0]}'" class="${classes}">`;

const CHIP_BASE = "chip-btn flex-shrink-0 px-3 py-1.5 rounded-full transition";
const CHIP_ON = `${CHIP_BASE} font-bold bg-terracotta text-white`;
const CHIP_OFF = `${CHIP_BASE} font-medium bg-white text-subText border border-amberAccent/20 hover:bg-amberLight`;

export const chip = (category, isActive) =>
  `<button data-action="filter" data-id="${esc(category)}" class="${isActive ? CHIP_ON : CHIP_OFF}">${esc(category)}</button>`;

export const loading = () => `
  <div class="glass-card rounded-2xl p-7 text-center flex flex-col items-center justify-center gap-2">
    <i class="fa-solid fa-spinner animate-spin text-terracotta text-2xl"></i>
    <p class="text-xs font-bold text-darkText">Filtrando y escogiendo opciones...</p>
  </div>`;

export const assigned = (day) => `
  <div class="glass-card rounded-2xl p-5 text-center text-xs text-darkText">
    <i class="fa-solid fa-circle-check text-emerald-500 text-2xl mb-1 block"></i>
    ¡Asignado con éxito al <strong>${esc(day)}</strong>!
    <p class="text-[10px] text-subText mt-1">Gira nuevamente para obtener más opciones.</p>
  </div>`;

export const emptyCatalog = () => `
  <div class="glass-card rounded-2xl p-6 text-center text-subText text-xs">
    <i class="fa-solid fa-magnifying-glass-minus text-2xl text-amberAccent mb-2 block"></i>
    No se encontraron platos con esos criterios.
  </div>`;

export const noDishesLeft = () =>
  `<div class="p-4 text-center text-xs text-subText">¡Todos los platos del catálogo ya han sido asignados esta semana!</div>`;

export const resultCard = (dish, index) => `
  <div class="glass-card rounded-2xl p-3 flex gap-3 items-center card-enter shadow-sm" style="animation-delay:${index * 0.12}s">
    <div class="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-amberLight">${img(dish, "w-full h-full object-cover")}</div>
    <div class="flex-1 min-w-0 flex flex-col justify-between h-16 py-0.5">
      <div>
        <div class="flex justify-between items-start gap-1">
          <h3 class="font-bold text-darkText text-xs truncate">${esc(dish.name)}</h3>
          <span class="text-[9px] bg-amberLight text-amberAccent font-bold px-1.5 py-0.5 rounded-md flex-shrink-0">${esc(dish.category)}</span>
        </div>
        <p class="text-[10px] text-subText mt-0.5 flex items-center gap-2">
          <span><i class="fa-regular fa-clock"></i> ${esc(dish.time)}</span>
          <span>• ${esc(dish.difficulty)}</span>
        </p>
      </div>
      <button data-action="pick" data-id="${dish.id}" class="w-full py-1 bg-terracotta hover:bg-terracotta/90 text-white font-bold rounded-lg text-[10px] transition shadow-sm active:scale-95 flex items-center justify-center gap-1">
        <span>Elegir para un Día</span><i class="fa-solid fa-chevron-right text-[8px]"></i>
      </button>
    </div>
  </div>`;

const todayTag = (isToday) =>
  isToday ? '<span class="bg-terracotta text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">HOY</span>' : "";

export const weekRow = (day, dish, isToday) => {
  const frame = `glass-card rounded-2xl p-3 flex gap-3 items-center transition ${isToday ? "border-2 border-terracotta/60 bg-amber-50/30" : ""}`;
  const dayColor = isToday ? "text-terracotta" : "text-darkText";

  if (!dish) {
    return `
      <div class="${frame}">
        <div class="w-14 h-14 rounded-xl border-2 border-dashed border-amberAccent/30 flex items-center justify-center text-amberAccent text-base flex-shrink-0 bg-warmBg"><i class="fa-solid fa-plus"></i></div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5"><span class="text-xs font-bold ${dayColor}">${day}</span>${todayTag(isToday)}</div>
          <p class="text-xs text-subText italic mt-0.5">Sin plato asignado</p>
        </div>
        <button data-action="choose-day" data-id="${day}" class="px-3 py-1.5 rounded-xl bg-amberLight text-amberAccent hover:bg-amber-200 text-xs font-bold transition">Elegir</button>
      </div>`;
  }

  return `
    <div class="${frame}">
      ${img(dish, "w-14 h-14 rounded-xl object-cover bg-amberLight flex-shrink-0")}
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5"><span class="text-xs font-extrabold ${dayColor}">${day}</span>${todayTag(isToday)}</div>
        <h4 class="font-bold text-darkText text-xs truncate mt-0.5">${esc(dish.name)}</h4>
        <p class="text-[10px] text-subText"><i class="fa-regular fa-clock"></i> ${esc(dish.time)} • ${esc(dish.category)}</p>
      </div>
      <button data-action="clear-day" data-id="${day}" title="Quitar" class="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition">
        <i class="fa-solid fa-xmark text-xs"></i>
      </button>
    </div>`;
};

export const catalogItem = (dish, index) => `
  <div class="glass-card rounded-2xl p-2.5 flex gap-3 items-center shadow-sm hover:shadow transition card-enter" style="animation-delay:${index * 0.04}s">
    ${img(dish, "w-14 h-14 rounded-xl object-cover bg-amberLight flex-shrink-0")}
    <div class="flex-1 min-w-0">
      <h4 class="font-bold text-darkText text-xs truncate">${esc(dish.name)}</h4>
      <div class="flex items-center gap-1.5 text-[10px] text-subText mt-1">
        <span class="bg-amberLight text-amberAccent font-bold px-2 py-0.5 rounded-full">${esc(dish.category)}</span>
        <span><i class="fa-regular fa-clock"></i> ${esc(dish.time)}</span>
      </div>
    </div>
    <div class="flex items-center gap-1">
      <button data-action="edit" data-id="${dish.id}" title="Editar" class="w-7 h-7 rounded-lg bg-amber-50 text-amberAccent hover:bg-amber-100 flex items-center justify-center transition"><i class="fa-solid fa-pen text-xs"></i></button>
      <button data-action="request-delete" data-id="${dish.id}" title="Eliminar" class="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition"><i class="fa-solid fa-trash-can text-xs"></i></button>
    </div>
  </div>`;

export const selectorItem = (dish) => `
  <div data-action="assign-to-day" data-id="${dish.id}" class="glass-card rounded-xl p-2.5 flex items-center justify-between hover:bg-amberLight/40 transition cursor-pointer">
    <div class="flex items-center gap-2.5 min-w-0">
      ${img(dish, "w-10 h-10 rounded-lg object-cover")}
      <div class="truncate">
        <h5 class="font-bold text-xs text-darkText truncate">${esc(dish.name)}</h5>
        <span class="text-[10px] text-subText">${esc(dish.category)}</span>
      </div>
    </div>
    <i class="fa-solid fa-circle-plus text-terracotta text-sm"></i>
  </div>`;
