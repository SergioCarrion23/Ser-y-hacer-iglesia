# Archivos del hero

- `fabric-loop.mp4`: animación de tela creada con Kling 2.5 Turbo a través de
  ElevenLabs. Usa como referencia el fotograma de 8,5 segundos del video
  proporcionado por el organizador, con el mismo fotograma de entrada y salida.
  El archivo publicado está optimizado para la web, sin pista de audio.
- `fabric-poster.jpg`: imagen de respaldo y portada del video.
- `tree-emblem.png`: emblema original de Árbol de Vida, optimizado para el header
  y el favicon.

El video se reproduce con `autoplay`, `muted`, `loop` y `playsinline`. Se pausa
cuando la pestaña está oculta o cuando el visitante prefiere reducir el movimiento.
Los archivos se sirven desde este repositorio, sin depender de enlaces temporales
de la plataforma de generación.

Para revisar el sitio localmente, ejecuta desde la raíz del repositorio:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

El formulario valida los datos y muestra una revisión. Todavía no tiene un
servicio de envío o almacenamiento de inscripciones conectado.
