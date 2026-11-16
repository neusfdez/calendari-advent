# Calendario de Adviento 🎄

## Publicarlo
Arrastra esta carpeta a https://app.netlify.com/drop (gratis) y te da un enlace para enviar.
También vale GitHub Pages o cualquier hosting: son archivos estáticos (index.html, styles.css, app.js, days.js).

## Botón "Modo prueba" (temporal)
- ON: se pueden abrir todas las ventanas. Lo que abras en prueba no afecta a las ventanas reales,
  y cada vez que lo activas empiezan cerradas otra vez.
- Para quitarlo: borra el <button id="testBtn"> de index.html y el bloque marcado
  "BOTÓN DE MODO PRUEBA" al final de app.js.
- El ON/OFF se guarda solo en tu navegador, pero quien tenga el enlace también verá el botón: bórralo antes de enviarlo.

## Rellenar los días
Edita days.js (titulo + html de cada día) y vuelve a subir la carpeta.

## Otros
- `?reset` al final del enlace cierra todas las ventanas en ese navegador.
- El año del calendario está en CONFIG, al principio de app.js.
