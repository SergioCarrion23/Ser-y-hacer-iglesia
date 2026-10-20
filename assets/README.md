# Archivos del hero

- `hero-background.mp4`: video de 5,5 segundos proporcionado por el organizador.
  Conserva la imagen y la duración originales, sin recodificar el video.
  Se eliminó la pista de audio y se preparó el MP4 para comenzar a cargar antes
  de completar la descarga.
  [Archivo de origen](https://res.cloudinary.com/dlsw7vg31/video/upload/v1792469614/Crear_video_corporativo_con_logo_20261019231043_k2koop.mp4).
- `hero-poster.jpg`: primer fotograma del video, como imagen de respaldo.
- `tree-emblem.png`: emblema original de Árbol de Vida, optimizado para el header
  y el favicon.

El video se reproduce con `autoplay`, `muted`, `loop` y `playsinline`. Se pausa
cuando la pestaña está oculta. El video y las transiciones del formulario están
activos independientemente de la preferencia de movimiento del sistema.
Si el navegador bloquea el inicio automático, un clic o toque vuelve a intentar
la reproducción; los bloqueos explícitos del navegador siguen teniendo prioridad.
Los archivos se sirven desde este repositorio, sin depender de enlaces temporales
de la plataforma de generación.

Para revisar el sitio localmente, ejecuta desde la raíz del repositorio:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

El formulario valida los datos y muestra una revisión. Todavía no tiene un
servicio de envío o almacenamiento de inscripciones conectado.
