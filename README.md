# Entreno

PWA personal para registrar entrenamientos de gimnasio. Sin login, sin servidor: todos los datos se guardan en el dispositivo (IndexedDB) y la app funciona 100% offline una vez instalada.

## Stack

React + Vite + TypeScript, Tailwind CSS, Dexie.js (IndexedDB), vite-plugin-pwa, Recharts, lucide-react.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
npm run preview
```

## Despliegue

Se publica automáticamente a GitHub Pages vía GitHub Actions (`.github/workflows/deploy.yml`) en cada push a `main`.
