/*
  BOLA DE CRISTAL: PREDICCIÓN 2027
  --------------------------------
  Para cambiar ámbitos o emoticonos, edita solo la lista AMBITOS de abajo.
  - n: nombre del ámbito
  - e: lista de emoticonos posibles (en cada consulta sale uno al azar)
  Puedes añadir o quitar ámbitos; la cuadrícula se adapta (mejor un número par).
*/
(function () {
  const AMBITOS = [
    { n: "Amor",     e: ["😍", "💘", "​😈", "​🏳️‍🌈", "💍", "🔥", "​🚩", "🥀"] },
    { n: "Família",  e: ["🏡", "🤗", "​🚼", "🎂", "🐶", "🧸", "👨‍👩‍👧", "🎄"] },
    { n: "Amics",   e: ["🎉", "🍻", "🤝", "​🪩", "🎤", "🏕️", "🍕", "🫂"] },
    { n: "Diners",   e: ["🤑", "​💀", "💸", "📈", "​🎁", "0️⃣", "💎", "🧾"] },
    { n: "Treball",  e: ["🚀", "🏆", "​🫩", "​🤡", "😴", "🎯", "🧠", "💡"] },
    { n: "Salut",    e: ["💪", "🏃‍♀️", "🧘‍♀️", "🥗", "😴", "☀️", "🍫", "🚴"] },
    { n: "Viatges",   e: ["✈️", "🏖️", "🏔️", "🚂", "🌍", "🗺️", "🚗", "🛳️"] },
    { n: "Sort",   e: ["🍀", "🌟", "🎰", "🎁", "🌈", "​🤡", "🐞", "🎲"] }
  ];

  const BALL = `
  <svg viewBox="0 0 120 124" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="bc-g" cx="35%" cy="30%" r="75%">
        <stop offset="0" stop-color="#8f7fe8"/>
        <stop offset=".45" stop-color="#3a3484"/>
        <stop offset="1" stop-color="#141b45"/>
      </radialGradient>
      <linearGradient id="bc-b" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#f6d47b"/>
        <stop offset="1" stop-color="#b9802a"/>
      </linearGradient>
    </defs>
    <path d="M26 104 Q60 92 94 104 L102 118 Q60 124 18 118 Z" fill="url(#bc-b)"/>
    <circle cx="60" cy="56" r="46" fill="url(#bc-g)"/>
    <path d="M30 62 Q48 40 62 58 T92 52" fill="none" stroke="#f6d47b" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>
    <g fill="#f6d47b">
      <path class="bc-star" d="M74 34 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"/>
      <path class="bc-star s2" d="M44 70 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5z"/>
      <circle class="bc-star s3" cx="82" cy="72" r="2"/>
    </g>
    <ellipse cx="42" cy="30" rx="15" ry="8" fill="#fff" fill-opacity=".3" transform="rotate(-30 42 30)"/>
  </svg>`;

  const css = `
  .bc { text-align: center; }
  .bc-ball {
    display: block; margin: 0 auto; padding: 0; border: 0; background: none; cursor: pointer;
    width: 128px; height: 132px;
    transition: width .5s ease, height .5s ease;
    filter: drop-shadow(0 0 14px rgba(143, 127, 232, .55));
    animation: bcGlow 3s ease-in-out infinite;
  }
  .bc-ball svg { display: block; width: 100%; height: 100%; }
  .bc-ball.small { width: 84px; height: 87px; }
  .bc-ball.shake svg { animation: bcShake 1.1s ease-in-out; transform-origin: 50% 90%; }
  .bc-ball:disabled { cursor: default; }
  .bc-star { transform-box: fill-box; transform-origin: center; animation: twinkle 2.6s ease-in-out infinite; }
  .bc-star.s2 { animation-delay: .9s; }
  .bc-star.s3 { animation-delay: 1.7s; }
  .bc-hint { margin: 8px 0 12px; font-weight: 700; color: #7a5848; }
  .bc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .bc-chip {
    padding: 8px 6px 6px; border-radius: 14px; background: rgba(229, 179, 74, .16);
    opacity: 0; transform: scale(.8);
    transition: opacity .35s ease, transform .5s cubic-bezier(.3, 1.5, .5, 1);
  }
  .bc-chip.on { opacity: 1; transform: none; }
  .bc-chip b { display: block; font-size: .85rem; color: #7a5848; }
  .bc-chip span { display: block; font-size: 2.1rem; line-height: 1.25; }
  @keyframes bcGlow { 0%, 100% { filter: drop-shadow(0 0 10px rgba(143, 127, 232, .4)); } 50% { filter: drop-shadow(0 0 20px rgba(143, 127, 232, .8)); } }
  @keyframes bcShake {
    0%, 100% { transform: rotate(0); }
    15% { transform: rotate(-9deg) translateX(-3px); }
    30% { transform: rotate(8deg) translateX(3px); }
    45% { transform: rotate(-7deg); }
    60% { transform: rotate(6deg); }
    80% { transform: rotate(-3deg); }
  }
  @media (prefers-reduced-motion: reduce) { .bc-chip { transition: none; } }
  `;

  function injectCss() {
    if (document.getElementById('bc-css')) return;
    const s = document.createElement('style');
    s.id = 'bc-css';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function h(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function start(host) {
    host.innerHTML = '';
    const wrap = h('div', 'bc');
    const ball = h('button', 'bc-ball');
    ball.type = 'button';
    ball.setAttribute('aria-label', 'Bola de cristal: toca per veure el teu 2027');
    ball.innerHTML = BALL;
    const hint = h('p', 'bc-hint', 'Toca la bola per veure el teu 2027');
    const grid = h('div', 'bc-grid');
    grid.setAttribute('aria-live', 'polite');
    wrap.append(ball, hint, grid);
    host.appendChild(wrap);

    const ultimo = {};   // para que al repetir no salga el mismo emoticono seguido
    let ocupada = false;

    ball.addEventListener('click', () => {
      if (ocupada) return;
      ocupada = true;
      ball.disabled = true;
      hint.textContent = 'Llegint el futur…';
      grid.innerHTML = '';
      ball.classList.remove('small');
      ball.classList.add('shake');

      setTimeout(() => {
        ball.classList.remove('shake');
        ball.classList.add('small');
        AMBITOS.forEach((a, idx) => {
          const opciones = a.e.filter(x => x !== ultimo[a.n]);
          const e = opciones[Math.floor(Math.random() * opciones.length)];
          ultimo[a.n] = e;
          const chip = h('div', 'bc-chip');
          chip.setAttribute('aria-label', `${a.n}: ${e}`);
          chip.append(h('b', null, a.n), h('span', null, e));
          grid.appendChild(chip);
          setTimeout(() => { if (chip.isConnected) chip.classList.add('on'); }, 150 + idx * 220);
        });
        setTimeout(() => {
          if (!hint.isConnected) return;
          hint.textContent = 'El teu 2027 ✨';
          ball.disabled = false;
          ocupada = false;
        }, 150 + AMBITOS.length * 220 + 200);
      }, 1100);
    });
  }

  /* app.js llama a esto cada vez que se abre una habitación */
  window.initBola = function (root) {
    const host = root && root.querySelector('[data-bola]');
    if (!host) return;
    injectCss();
    start(host);
  };
})();
