const BACKUP_VERSION = 1;

export class BackupService {
  #repo;
  #plan;

  constructor(repo, plan) {
    this.#repo = repo;
    this.#plan = plan;
  }

  export() {
    const data = {
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      dishes: this.#repo.getAll(),
      week: this.#plan.snapshot(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `que-cocinar-hoy-${data.exportedAt.slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  async import(file) {
    const data = JSON.parse(await file.text());
    if (data.version !== BACKUP_VERSION || !Array.isArray(data.dishes)) {
      throw new Error("Archivo no válido");
    }
    this.#repo.replaceAll(data.dishes.filter((d) => typeof d?.name === "string" && d.name.trim()));
    this.#plan.restore(data.week ?? {});
  }
}