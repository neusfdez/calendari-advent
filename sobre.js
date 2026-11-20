/*
  SOBRE QUE S’OBRE → EMOJI GIRANT + MISSATGE → FOTO
  --------------------------------------------------
  Es fa servir des de days.js amb la ruta de la foto dins del propi div:

    { titulo: "Una carta per a tu",
      html: "<div data-sobre data-img='contingut/shanghai.jpeg' data-alt='Xina'></div>" }

  Pots reutilitzar-lo en altres dies canviant data-img i data-alt.
  Aquí sota pots canviar l’emoji, el missatge i el temps d’espera.
*/
(function () {
  const EMOJI = "👲";                       // l’emoji que gira
  const MISSATGE = "You’ve just been chinesed";
  const PAUSA = 3200;                       // ms que gira l’emoji abans que aparegui la foto

  const TEXTOS = {
    intro: "Toca el sobre per obrir-lo ✉️",
    aria:  "Sobre tancat. Toca per obrir-lo",
    falta: "Falta la foto"
  };

  const SOBRE = `
  <svg viewBox="0 -30 220 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="110" cy="154" rx="90" ry="6" fill="rgba(0,0,0,.18)"/>
    <rect x="10" y="44" width="200" height="108" rx="8" fill="#8f211c"/>
    <g class="sb-fo"><path d="M10 44 L110 -24 L210 44 Z" fill="#d9473f" stroke="#a82a24" stroke-linejoin="round"/></g>
    <g class="sb-letter">
      <rect x="24" y="56" width="172" height="92" rx="4" fill="#fffdf4" stroke="#e8dcc0"/>
      <path d="M44 78 h132 M44 94 h132 M44 110 h90" stroke="#e5b34a" stroke-opacity=".6" stroke-width="3" stroke-linecap="round" fill="none"/>
    </g>
    <path d="M10 52 L110 108 L210 52 L210 144 Q210 152 202 152 L18 152 Q10 152 10 144 Z" fill="#c9342d"/>
    <path d="M12 150 L96 94 M208 150 L124 94" stroke="rgba(0,0,0,.16)" stroke-width="2" fill="none"/>
    <g class="sb-fc">
      <path d="M10 44 L110 112 L210 44 Z" fill="#d9473f" stroke="#a82a24" stroke-linejoin="round"/>
      <circle cx="110" cy="98" r="11" fill="#e5b34a" stroke="#b98728" stroke-width="1.5"/>
      <path d="M110 91 l2.2 4.8 5.2 .6 -3.9 3.5 1.1 5.1 -4.6 -2.6 -4.6 2.6 1.1 -5.1 -3.9 -3.5 5.2 -.6 z" fill="#b98728"/>
    </g>
  </svg>`;

  const css = `
  .sb { text-align: center; }
  .sb-hint { margin: 0 0 6px; font-weight: 700; color: #7a5848; }
  .sb-wrap { max-height: 220px; transition: max-height .5s ease, opacity .4s ease; }
  .sb-wrap.gone { max-height: 0; opacity: 0; overflow: hidden; }
  .sb-env {
    display: block; margin: 0 auto; padding: 0; border: 0; background: none;
    width: min(100%, 230px); cursor: pointer;
  }
  .sb-env:disabled { cursor: default; }
  .sb-env svg { display: block; width: 100%; height: auto; overflow: visible; }
  .sb-env:not(.open) { animation: sbFloat 2.6s ease-in-out infinite; }
  .sb-fc { transform-origin: 110px 44px; transition: transform .25s ease-in; }
  .sb-fo { transform-origin: 110px 44px; transform: scaleY(0); transition: transform .3s ease-out .22s; }
  .sb-letter { transition: transform .6s cubic-bezier(.3, 1.3, .5, 1) .35s; }
  .sb-env.open .sb-fc { transform: scaleY(0); }
  .sb-env.open .sb-fo { transform: scaleY(1); }
  .sb-env.open .sb-letter { transform: translateY(-52px); }

  .sb-msg { animation: sbIn .6s cubic-bezier(.3, 1.5, .5, 1) both; }
  .sb-spin {
    display: inline-block; font-size: 4.6rem; line-height: 1.1;
    animation: sbSpin 1.4s linear infinite;
  }
  .sb-text { margin: 2px 0 0; font-family: var(--script); font-weight: 700; font-size: 2rem; line-height: 1.05; color: var(--text); }
  .sb-photo {
    display: block; margin: 14px auto 0; max-width: 100%; max-height: 42svh; height: auto;
    border-radius: 10px; box-shadow: 0 0 0 3px var(--gold);
    animation: sbPhoto .8s ease both;
  }
  .sb-miss { margin: 14px 0 0; font-size: .85rem; font-weight: 700; color: #a0786a; }

  @keyframes sbFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
  @keyframes sbSpin { from { transform: perspective(260px) rotateY(0deg); } to { transform: perspective(260px) rotateY(360deg); } }
  @keyframes sbIn { 0% { opacity: 0; transform: scale(.5); } 100% { opacity: 1; transform: none; } }
  @keyframes sbPhoto { 0% { opacity: 0; transform: translateY(14px) scale(.96); } 100% { opacity: 1; transform: none; } }

  @media (prefers-reduced-motion: reduce) {
    .sb-env:not(.open), .sb-spin, .sb-msg, .sb-photo { animation: none !important; }
    .sb-fc, .sb-fo, .sb-letter, .sb-wrap { transition-duration: .01s !important; transition-delay: 0s !important; }
  }
  `;

  function injectCss() {
    if (document.getElementById('sb-css')) return;
    const s = document.createElement('style');
    s.id = 'sb-css';
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
    const src = host.getAttribute('data-img') || '';
    const alt = host.getAttribute('data-alt') || '';
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const espera = (ms, fn) => setTimeout(() => { if (host.isConnected) fn(); }, reduce ? 0 : ms);

    host.innerHTML = '';
    const wrap = h('div', 'sb');
    const hint = h('p', 'sb-hint', TEXTOS.intro);
    const envWrap = h('div', 'sb-wrap');
    const env = h('button', 'sb-env');
    env.type = 'button';
    env.setAttribute('aria-label', TEXTOS.aria);
    env.innerHTML = SOBRE;
    envWrap.appendChild(env);
    const slot = h('div', 'sb-slot');
    slot.setAttribute('aria-live', 'polite');
    wrap.append(hint, envWrap, slot);
    host.appendChild(wrap);

    env.addEventListener('click', () => {
      if (env.disabled) return;
      env.disabled = true;
      env.classList.add('open');

      // anem carregant la foto mentre s’obre el sobre
      const img = new Image();
      img.className = 'sb-photo';
      img.alt = alt;
      let fallida = false;
      const carregada = new Promise(resolve => {
        img.onload = resolve;
        img.onerror = () => { fallida = true; resolve(); };
      });
      if (src) img.src = src; else { fallida = true; }

      espera(1100, () => {
        hint.hidden = true;
        envWrap.classList.add('gone');

        const msg = h('div', 'sb-msg');
        const spin = h('div', 'sb-spin', EMOJI);
        spin.setAttribute('aria-hidden', 'true');
        msg.append(spin, h('p', 'sb-text', MISSATGE));
        slot.appendChild(msg);

        espera(PAUSA, () => {
          (src ? carregada : Promise.resolve()).then(() => {
            if (!host.isConnected) return;
            slot.appendChild(fallida ? h('p', 'sb-miss', `${TEXTOS.falta} ${src}`) : img);
          });
        });
      });
    });
  }

  /* app.js crida això cada cop que s’obre una habitació */
  window.initSobre = function (root) {
    const host = root && root.querySelector('[data-sobre]');
    if (!host) return;
    injectCss();
    start(host);
  };
})();
