// Modal reutilizable: solo abre y cierra (la animación vive en el CSS).
export class Modal {
  #element;

  constructor(id) {
    this.#element = document.getElementById(id);
  }

  open() {
    this.#element.classList.remove("is-closed");
  }

  close() {
    this.#element.classList.add("is-closed");
  }
}
