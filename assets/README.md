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
  Un filtro CSS `brightness(1.12)` aclara su presentación en escritorio y móvil;
  el archivo original y los rasgos de las personas se conservan.
- `event-saturday.jpg`: fotografía de la bandera del Ecuador.
- `event-sunday.jpg`: fotografía de la congregación reunida.
  Las tres fotos fueron proporcionadas por el organizador y se exportan en JPEG
  para reducir el peso de descarga.
- `pastor-roy-soto.jpg`: retrato proporcionado para la presentación del pastor,
  reducido a 1200 × 1800 píxeles para la web.
- `pastor-motion.js`: componente de movimiento compilado con Framer Motion.
  Incluye aparición al entrar en pantalla, movimiento con el desplazamiento
  y profundidad con el cursor, el toque o el foco del teclado. La imagen, el
  marco y el reflejo se mueven en capas; se conserva la fotografía original.
  El efecto móvil acompaña el scroll sin pedir acceso a los sensores.
  El contenido sigue visible sin JavaScript.
  Las licencias se conservan en `motion-licenses.txt`.

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

La presentación de Roy Soto usa un retrato central y texto centrado. El patrón
de interacción toma como referencia las tarjetas inclinables de Framer:
https://www.framer.com/marketplace/components/tiltcard/
Su implementación es propia y utiliza la API DOM de Framer Motion:
https://motion.dev/docs/inview y https://motion.dev/docs/scroll

Para modificar las animaciones, edita `pastor-motion.js` en la raíz, ejecuta
`npm ci` y `npm run build`, y publica también los archivos compilados de `assets/`.
GitHub Pages sirve el resultado ya compilado; no necesita ejecutar Node.

El header flotante, el menú móvil, todos los botones y la etiqueta de fecha
del hero comparten superficies de vidrio translúcido. El desenfoque permanece fijo y el hover anima el reflejo y una
elevación pequeña, manteniendo el efecto de fusión del formulario.
