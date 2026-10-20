# assets

Coloca aquí los archivos multimedia del hero.

## Video de fondo

1. Copia tu video en esta carpeta con el nombre exacto:

   ```
   assets/hero.mp4
   ```

2. Opcional: agrega una imagen de portada que se muestra antes de que el video
   cargue:

   ```
   assets/hero-poster.jpg
   ```

## Recomendaciones para el video

- **Resolución:** 1920×1080 es suficiente (el velo cubre el fondo, no necesitas 4K).
- **Duración:** 8–20 segundos, sin cortes bruscos para que el loop se sienta natural.
- **Peso:** menos de 8 MB idealmente. Comprime con HandBrake (H.264, CRF 26–30).
- **Sin audio:** el video se reproduce en silencio automáticamente.
- **Formato alternativo:** si usas `.webm`, cambia el `src` en `index.html`.

## Cómo lo usa la página

El `<video>` tiene los atributos:

```html
<video class="hero__bg" autoplay muted loop playsinline preload="auto">
```

- `autoplay` + `muted` → arranca solo, sin sonido (requisito de los navegadores)
- `loop` → repite infinitamente
- `playsinline` → no abre pantalla completa en móviles
- El velo verde (`.hero__scrim`) garantiza que el texto blanco siempre sea legible
