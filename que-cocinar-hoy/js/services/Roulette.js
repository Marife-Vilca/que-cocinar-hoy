// Lógica pura de sorteo (sin DOM), fácil de testear.
export class Roulette {
  static pick(items, amount) {
    const pool = [...items];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, amount);
  }
}
