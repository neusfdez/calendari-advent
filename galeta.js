/*
  GALETA DE LA SORT
  -----------------
  Es toca la galeta, es trenca i surt un paperet amb un missatge del 2027.
  Per canviar o afegir missatges, edita només la llista MISSATGES.
  Els missatges surten barrejats i no es repeteixen fins que han sortit tots.
*/
(function () {
  const TEXTOS = {
    intro:    "Toca la galeta per trencar-la 🥠",
    final:    "El teu 2027 🥠",
    numeros:  "Números de la sort",
    una_altra: "Trencar una altra galeta",
    aria:     "Galeta de la sort. Toca per trencar-la"
  };

  const MISSATGES = [
    "El 2027 portarà un somriure inesperat a la teva vida.",
    "Una bona notícia trucarà a la teva porta l’any que ve.",
    "Els teus esforços donaran fruits dolços el 2027.",
    "Un viatge que somies es farà realitat l’any que ve.",
    "El 2027 t’envoltaràs de gent que t’estima de debò.",
    "Una amistat preciosa floreix a l’horitzó.",
    "Tot el que has sembrat, ho colliràs l’any que ve.",
    "Un petit canvi t’aportarà una gran alegria el 2027.",
    "La sort et somriurà quan menys t’ho esperis.",
    "El 2027 serà un any ple d’energia i de bones ganes.",
    "Una porta que creies tancada s’obrirà de bat a bat.",
    "L’any que ve riuràs tant que et faran mal les galtes.",
    "Un projecte que t’il·lusiona començarà a caminar.",
    "El 2027 et sorprendrà amb moments que no oblidaràs mai.",
    "La teva constància et portarà més lluny del que imagines.",
    "Un gest amable tornarà a tu multiplicat per mil.",
    "L’any que ve, la calma i l’alegria aniran de la mà.",
    "Viuràs una nit d’aquelles que s’expliquen durant anys.",
    "El 2027 tindràs més temps per a allò que t’omple.",
    "Un cop de sort inesperat t’alegrarà una setmana qualsevol.",
    "Hi ha algú que pensa en tu amb molta estima.",
    "El teu enginy obrirà camins que ara encara no veus.",
    "L’any que ve guanyaràs en rialles i en abraçades.",
    "Les millors històries del 2027 encara estan per escriure.",
    "Els teus plans aniran millor del que esperes.",
    "La felicitat t’espera a la volta del camí.",
    "El 2027 et regalarà una sorpresa dolça com una xocolatina.",
    "Allò que et feia por et sortirà millor del que pensaves.",
    "Cada dia del 2027 portarà una raó per somriure.",
    "Un petó, una abraçada i molts amics: el 2027 va carregat d’afecte.",
    "El 2027 començarà amb bon peu i acabarà amb millor.",
    "L’any que ve, les peces del puzle encaixaran.",
    "Una trobada casual et canviarà el dia, i potser l’any.",
    "El 2027 et deixarà bons records i ganes de repetir."
  ];

  /* ---------- la galeta: l’emoji, en dues còpies tallades per la meitat ---------- */
  const COOKIE = `
    <span class="gl-emo" aria-hidden="true">
      <span class="gl-h l">🥠</span><span class="gl-h r">🥠</span>
      <i class="gl-crumb" style="--dx:-46px;--dy:-34px"></i>
      <i class="gl-crumb" style="--dx:-24px;--dy:-48px"></i>
      <i class="gl-crumb" style="--dx:30px;--dy:-44px"></i>
      <i class="gl-crumb" style="--dx:50px;--dy:-26px"></i>
      <i class="gl-crumb" style="--dx:-56px;--dy:6px"></i>
      <i class="gl-crumb" style="--dx:58px;--dy:10px"></i>
    </span>
    <span class="gl-shadow"></span>`;

  const css = `
  .gl { text-align: center; }
  .gl-hint { margin: 0 0 4px; font-weight: 700; color: #7a5848; }
  .gl-cookie {
    display: block; margin: 0 auto; padding: 0; border: 0; background: none;
    font-size: clamp(5.5rem, 28vw, 7.5rem); line-height: 1; cursor: pointer;
  }
  .gl-cookie:disabled { cursor: default; }
  .gl-emo {
    position: relative; display: inline-grid; transform-origin: 50% 100%;
    font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
  }
  .gl-h {
    grid-area: 1 / 1; display: block; transform-origin: 50% 85%;
    transition: transform .6s cubic-bezier(.3, 1.4, .5, 1);
  }
  /* tall en zig-zag pel mig: les dues meitats encaixen exactament */
  .gl-h.l { clip-path: polygon(-10% -10%, 50.6% -10%, 46.6% 20%, 54.6% 35%, 47.6% 52%, 54.6% 68%, 48.6% 85%, 50.6% 110%, -10% 110%); }
  .gl-h.r { clip-path: polygon(50% -10%, 110% -10%, 110% 110%, 50% 110%, 48% 85%, 54% 68%, 47% 52%, 54% 35%, 46% 20%); }
  .gl-shadow { display: block; width: .9em; height: .07em; margin: .03em auto 0; border-radius: 50%; background: rgba(0, 0, 0, .18); filter: blur(2px); }
  .gl-cookie:not(.broken) .gl-emo { animation: glFloat 2.8s ease-in-out infinite; }
  .gl-cookie.shake .gl-emo { animation: glShake .45s ease-in-out; }
  .gl-cookie.broken .gl-h.l { transform: translate(-.32em, .1em) rotate(-24deg); }
  .gl-cookie.broken .gl-h.r { transform: translate(.32em, .1em) rotate(24deg); }
  .gl-crumb {
    position: absolute; left: 50%; top: 55%; width: 6px; height: 6px;
    border-radius: 50%; background: #d9953a; opacity: 0;
  }
  .gl-cookie.broken .gl-crumb { animation: glCrumb .9s ease-out both; }
  .gl-paper {
    margin: 4px auto 0; padding: 14px 16px 12px; max-width: 290px;
    background: #fffdf4; border-top: 3px solid var(--red); border-bottom: 3px solid var(--red);
    box-shadow: 0 6px 14px rgba(0, 0, 0, .18);
    transform-origin: 50% 0; animation: glPaper .7s cubic-bezier(.3, 1.3, .5, 1) both;
  }
  .gl-msg { margin: 0; font-family: var(--script); font-weight: 700; font-size: 1.5rem; line-height: 1.2; color: var(--text); }
  .gl-nums { margin: 10px 0 0; font-size: .78rem; font-weight: 700; color: #a0786a; letter-spacing: .02em; }
  .gl-btn {
    margin-top: 14px; font: 700 1rem var(--sans); color: var(--cream);
    background: var(--red); border: 0; border-radius: 999px; padding: 10px 22px; cursor: pointer;
  }
  @keyframes glFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
  @keyframes glShake {
    0%, 100% { transform: rotate(0); }
    20% { transform: rotate(-8deg); }
    40% { transform: rotate(7deg); }
    60% { transform: rotate(-6deg); }
    80% { transform: rotate(4deg); }
  }
  @keyframes glCrumb {
    0% { opacity: 0; transform: translate(0, 0); }
    15% { opacity: 1; }
    100% { opacity: 0; transform: translate(var(--dx), var(--dy)); }
  }
  @keyframes glPaper {
    0% { opacity: 0; transform: translateY(-90px) scale(.4, .2) rotate(-4deg); }
    100% { opacity: 1; transform: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .gl-cookie .gl-emo, .gl-paper, .gl-crumb { animation: none !important; }
    .gl-h { transition-duration: .01s; }
    .gl-cookie.broken .gl-crumb { opacity: 0; }
  }
  `;

  function injectCss() {
    if (document.getElementById('gl-css')) return;
    const s = document.createElement('style');
    s.id = 'gl-css';
    s.textContent = css;
    document.head.appendChild(s);
  }

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

  /* bossa de missatges: no es repeteixen fins que han sortit tots */
  let bossa = [];
  let ultim = null;
  function seguent() {
    if (!bossa.length) {
      bossa = shuffle(MISSATGES);
      if (bossa.length > 1 && bossa[bossa.length - 1] === ultim) {
        [bossa[0], bossa[bossa.length - 1]] = [bossa[bossa.length - 1], bossa[0]];
      }
    }
    ultim = bossa.pop();
    return ultim;
  }

  function numerosDeLaSort() {
    const set = new Set();
    while (set.size < 5) set.add(1 + Math.floor(Math.random() * 49));
    return Array.from(set).sort((a, b) => a - b).join(' · ');
  }

  function start(host) {
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    host.innerHTML = '';
    const wrap = h('div', 'gl');
    const hint = h('p', 'gl-hint', TEXTOS.intro);
    const cookie = h('button', 'gl-cookie');
    cookie.type = 'button';
    cookie.setAttribute('aria-label', TEXTOS.aria);
    cookie.innerHTML = COOKIE;
    const slot = h('div', 'gl-slot');
    slot.setAttribute('aria-live', 'polite');
    const again = h('button', 'gl-btn', TEXTOS.una_altra);
    again.type = 'button';
    again.hidden = true;
    again.onclick = () => start(host);
    wrap.append(hint, cookie, slot, again);
    host.appendChild(wrap);

    const espera = (ms, fn) => setTimeout(() => { if (host.isConnected) fn(); }, reduce ? 0 : ms);

    cookie.addEventListener('click', () => {
      if (cookie.disabled) return;
      cookie.disabled = true;
      cookie.classList.add('shake');
      espera(450, () => {
        cookie.classList.remove('shake');
        cookie.classList.add('broken');
        hint.textContent = TEXTOS.final;
        espera(350, () => {
          const paper = h('div', 'gl-paper');
          paper.append(
            h('p', 'gl-msg', seguent()),
            h('p', 'gl-nums', `${TEXTOS.numeros}: ${numerosDeLaSort()}`)
          );
          slot.appendChild(paper);
        });
        espera(1300, () => { again.hidden = false; });
      });
    });
  }

  /* app.js crida això cada cop que s’obre una habitació */
  window.initGaleta = function (root) {
    const host = root && root.querySelector('[data-galeta]');
    if (!host) return;
    injectCss();
    start(host);
  };
})();
