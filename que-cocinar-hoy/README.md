# ¡Qué Cocinar Hoy!

Planificador semanal con ruleta de platos. JavaScript vanilla (ES Modules) + Tailwind por CDN, sin build.

## Ejecutar
Los módulos ES **no funcionan con doble clic en el HTML**. Usa uno de estos:

- VS Code → extensión *Live Server*
- `python -m http.server 8000` y abrir http://localhost:8000

## Estructura
| Carpeta | Responsabilidad |
|---|---|
| `js/config` | Constantes y datos iniciales |
| `js/models` | Entidades (`Dish`) |
| `js/services` | Lógica y persistencia (`DishRepository`, `WeeklyPlan`, `Roulette`, `StorageService`) |
| `js/ui` | Controlador (`App`), `Modal` y plantillas HTML |
| `css` | Animaciones y estilos que Tailwind no cubre |

## Publicar en GitHub Pages
Settings → Pages → Branch `main` / root.
