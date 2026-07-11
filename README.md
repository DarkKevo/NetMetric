# NetMetric

> Medidor de velocidad de internet con diagnóstico en tiempo real.

**NetMetric** es una Progressive Web App (PWA) construida con Next.js que mide download, upload, ping, jitter y packet loss directamente desde el navegador — sin plugins, sin registro, sin backend externo.

## Stack

- **Framework**: Next.js 16.2 (App Router, React 19)
- **Estilos**: Tailwind CSS v4
- **Linter**: Biome
- **Tipado**: TypeScript 5
- **Deploy**: Vercel (recomendado)

## Features

- ⚡ Medición real: download, upload, ping, jitter, packet loss
- 📊 Throughput chart en vivo durante la medición
- 📡 Selección automática de servidor según ubicación
- 🌙 Modo oscuro cyberpunk con paleta cyan `#00F0FF`
- 📱 Mobile-first responsive
- 📋 Historial local de resultados
- 🚀 PWA instalable en el dispositivo

## Cómo funciona

NetMetric tiene su propio backend de medición vía API Routes de Next.js:

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/ping` | Payload mínimo para medir latencia |
| `GET /api/download?size=25` | Streamea datos aleatorios para medir bajada |
| `POST /api/upload` | Recibe datos para medir subida |
| `GET /api/servers` | Detecta ubicación y devuelve servidores disponibles |

El browser orquesta el test: ping → download → upload → packet loss, muestreando velocidad cada 250ms para el chart en vivo.

## Desarrollo

```bash
# Instalar dependencias
npm install

# Dev server
npm run dev

# Build producción
npm run build

# Iniciar build
npm start
```

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

La medición es real solo cuando el servidor está desplegado en internet (no en localhost). Vercel distribuye automáticamente la app en su edge network para menor latencia.

## Licencia

MIT
