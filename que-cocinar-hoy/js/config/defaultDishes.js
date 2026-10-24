const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;

export const DEFAULT_DISHES = [
  { id: 1, name: "Lomo Saltado", category: "Criollo", time: "25 min", difficulty: "Media", image: photo("1544025162-d76694265947") },
  { id: 2, name: "Ají de Gallina", category: "Criollo", time: "35 min", difficulty: "Media", image: photo("1626777552726-4a6b54c97e46") },
  { id: 3, name: "Ceviche Tradicional", category: "Marino", time: "20 min", difficulty: "Fácil", image: photo("1535399831218-d5bd36d1a6b3") },
  { id: 4, name: "Causa Rellena", category: "Criollo", time: "30 min", difficulty: "Fácil", image: photo("1512621776951-a57141f2eefd") },
  { id: 5, name: "Seco de Res con Beans", category: "Sopas/Guisos", time: "50 min", difficulty: "Difícil", image: photo("1547496592-1b9d4be6628f") },
  { id: 6, name: "Tallarines Verdes con Bistec", category: "Pastas", time: "30 min", difficulty: "Fácil", image: photo("1621996346565-e3d5d6281270") },
  { id: 7, name: "Arroz con Pollo", category: "Criollo", time: "45 min", difficulty: "Media", image: photo("1604382354936-07c5d9983bd3") },
  { id: 8, name: "Papa a la Huancaína", category: "Criollo", time: "20 min", difficulty: "Fácil", image: photo("1600891964599-f61ba0e24092") },
  { id: 9, name: "Sopa a la Minuta", category: "Sopas/Guisos", time: "25 min", difficulty: "Fácil", image: photo("1588166524941-3bf61a9c41db") },
  { id: 10, name: "Chaufa de Pollo", category: "Rápido", time: "20 min", difficulty: "Fácil", image: photo("1512058564366-18510be2db19") },
];
