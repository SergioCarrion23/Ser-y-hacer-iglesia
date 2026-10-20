# Archivos del sitio

- `fabric-loop.mp4`: animación de tela de 10 segundos creada con Kling 2.5 Turbo
  a través de ElevenLabs. Usa como referencia el fotograma de 8,5 segundos del
  video proporcionado por el organizador, con el mismo fotograma de entrada y
  salida. El archivo publicado está optimizado para la web, en 1080p y sin audio.
- `fabric-poster.jpg`: imagen de respaldo y portada del video.
- `tree-emblem.png`: emblema original de Árbol de Vida, optimizado para el header
  y el favicon.
- `church-arbol-de-vida.png` y `church-shalom.png`: logos proporcionados por el
  organizador para presentar a ambas iglesias en la sección del encuentro.
  Se conservan los PNG transparentes originales.
- `event-friday.jpg`: foto original del grupo de jóvenes. El encuadre adaptable
  prioriza al grupo y reduce el espacio vacío superior, sin retocar las personas.
- `event-saturday.jpg`: fotografía de la bandera del Ecuador.
- `event-sunday.jpg`: fotografía de la congregación reunida.
  Las tres fotos fueron proporcionadas por el organizador y se exportan en JPEG
  para reducir el peso de descarga.

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

La sección de los tres días adapta el patrón visual del componente
Feature Showcase Native compartido por el organizador. Está implementada en
HTML, CSS y JavaScript propios, sin cargar el runtime de Framer. En escritorio
la imagen queda fija y cambia al recorrer los días; en móvil cada imagen
acompaña su contenido y se mantiene una navegación compacta. En escritorio,
las leyendas se colocan debajo de las fotografías para mantener visibles a
las personas y la bandera.
