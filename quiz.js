/*
  QUIZ: ADIVINA LA PELÍCULA NAVIDEÑA
  ----------------------------------
  Para cambiar preguntas, edita solo la lista PREGUNTAS de abajo.

  - img:      ruta del fotograma (súbelo a la carpeta quiz/ del repositorio)
  - correcta: título correcto
  - falsas:   3 títulos incorrectos (el orden de las 4 opciones se mezcla solo)
*/
(function () {
  const PREGUNTAS = [
    { img: "quiz/frame1.jpg", correcta: "Solo en casa",         falsas: ["Elf", "El Grinch", "Love Actually"] },
    { img: "quiz/frame2.jpg", correcta: "El Grinch",            falsas: ["Polar Express", "Los Gremlins", "Qué bello es vivir"] },
    { img: "quiz/frame3.jpg", correcta: "Elf",                  falsas: ["Solo en casa", "Qué bello es vivir", "Santa Claus"] },
    { img: "quiz/frame4.jpg", correcta: "Love Actually",        falsas: ["Pesadilla antes de Navidad", "Elf", "El Grinch"] },
    { img: "quiz/frame5.jpg", correcta: "Polar Express",        falsas: ["Solo en casa", "Los Fantasmas atacan al jefe", "Elf"] },
    { img: "quiz/frame6.jpg", correcta: "Qué bello es vivir",   falsas: ["Milagro en la calle 34", "Love Actually", "Polar Express"] }
  ];

  const MENSAJES = [
    [1.0, "¡Perfecto! Eres una enciclopedia navideña 🎄"],
    [0.6, "¡Muy bien! Se nota que has visto muchas pelis con manta y chocolate ☕"],
    [0.3, "Nada mal… toca maratón de cine navideño 🍿"],
    [0,   "Esta Navidad toca ponerse al día con las películas 🎁"]
  ];

  /* ---------- estilos (se inyectan solos, no hace falta tocar styles.css) ---------- */
  const css = `
  .qz { text-align: center; }
  .qz-prog { margin: 0 0 8px; font-weight: 700; font-size: .85rem; color: #a7203d; }
  .qz-frame {
    margin: 0 0 12px; border-radius: 10px; overflow: hidden;
    background: #18214a; box-shadow: 0 0 0 3px var(--gold);
  }
  .qz-frame img { display: block; width: 100%; max-height: 26svh; object-fit: cover; border-radius: 0 !important; }
  .qz-missing { padding: 28px 10px; color: var(--gold-l); font-size: .9rem; }
  .qz-q { margin: 0 0 10px; font-weight: 700; }
  .qz-opts { display: grid; gap: 8px; }
  .qz-opt {
    font: 700 1rem var(--sans); color: var(--text);
    background: #fff; border: 2px solid var(--gold); border-radius: 12px;
    padding: 10px 12px; cursor: pointer; transition: background .2s, border-color .2s, transform .1s;
  }
  .qz-opt:active:not(:disabled) { transform: translateY(1px); }
  .qz-opt:disabled { cursor: default; }
  .qz-opt.ok { background: #dff3e6; border-color: #2f7d4f; color: #1d3b2a; }
  .qz-opt.ko { background: #f9dddb; border-color: var(--red); color: #7b1f1a; }
  .qz-opt.dim { opacity: .55; }
  .qz-fb { min-height: 1.5em; margin: 10px 0 0; font-weight: 700; }
  .qz-btn {
    margin-top: 10px; font: 700 1rem var(--sans); color: var(--cream);
    background: var(--red); border: 0; border-radius: 999px; padding: 10px 22px; cursor: pointer;
  }
  .qz-score { font-family: var(--script); font-size: 3.4rem; font-weight: 700; line-height: 1; margin: 6px 0; }
  `;
  function injectCss() {
    if (document.getElementById('qz-css')) return;
    const s = document.createElement('style');
    s.id = 'qz-css';
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ---------- utilidades ---------- */
  function h(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function shuffle(a) {
    const b = a.slice();
    for (let k = b.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [b[k], b[j]] = [b[j], b[k]];
    }
    return b;
  }

  /* ---------- el quiz ---------- */
  function start(host) {
    const total = PREGUNTAS.length;
    let i = 0, aciertos = 0;

    function pregunta() {
      host.innerHTML = '';
      const p = PREGUNTAS[i];
      const wrap = h('div', 'qz');
      wrap.appendChild(h('p', 'qz-prog', `Fotograma ${i + 1} de ${total}`));

      const fig = h('div', 'qz-frame');
      const img = new Image();
      img.alt = 'Fotograma de una película navideña';
      img.onerror = () => { fig.innerHTML = ''; fig.appendChild(h('div', 'qz-missing', `Falta la imagen ${p.img}`)); };
      img.src = p.img;
      fig.appendChild(img);
      wrap.appendChild(fig);

      wrap.appendChild(h('p', 'qz-q', '¿De qué película es?'));

      const opts = h('div', 'qz-opts');
      const fb = h('p', 'qz-fb');
      const next = h('button', 'qz-btn', i === total - 1 ? 'Ver resultado' : 'Siguiente');
      next.type = 'button';
      next.hidden = true;
      next.onclick = () => { i++; i < total ? pregunta() : final(); };

      shuffle([p.correcta, ...p.falsas]).forEach(t => {
        const b = h('button', 'qz-opt', t);
        b.type = 'button';
        b.onclick = () => {
          const ok = t === p.correcta;
          if (ok) aciertos++;
          opts.querySelectorAll('button').forEach(x => {
            x.disabled = true;
            if (x.textContent === p.correcta) x.classList.add('ok');
            else if (x === b) x.classList.add('ko');
            else x.classList.add('dim');
          });
          fb.textContent = ok ? '¡Correcto! 🎄' : `Era «${p.correcta}»`;
          next.hidden = false;
          next.focus({ preventScroll: true });
        };
        opts.appendChild(b);
      });

      wrap.append(opts, fb, next);
      host.appendChild(wrap);
    }

    function final() {
      host.innerHTML = '';
      const wrap = h('div', 'qz');
      wrap.appendChild(h('p', 'qz-prog', 'Resultado'));
      wrap.appendChild(h('p', 'qz-score', `${aciertos} / ${total}`));
      const ratio = aciertos / total;
      wrap.appendChild(h('p', 'qz-q', MENSAJES.find(m => ratio >= m[0])[1]));
      const again = h('button', 'qz-btn', 'Jugar otra vez');
      again.type = 'button';
      again.onclick = () => { i = 0; aciertos = 0; pregunta(); };
      wrap.appendChild(again);
      host.appendChild(wrap);
    }

    pregunta();
  }

  /* app.js llama a esto cada vez que se abre una habitación */
  window.initQuiz = function (root) {
    const host = root && root.querySelector('[data-quiz]');
    if (!host) return;
    injectCss();
    start(host);
  };
})();
